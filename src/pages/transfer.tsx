import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { spotifyStore } from '../stores/spotify-store';
import { Button, Progress, Select, Spinner, Table } from '@zeit-ui/react';
import { useRouter } from 'next/router';
import PlaylistChooser from '../components/playlist-chooser';
import { createQueue } from '../utility/queue';
import { AlertTriangleFill, CheckInCircle, Circle } from '@zeit-ui/react-icons';
import styles from '../styles/LogIn.module.scss';
import transferStyles from '../styles/transfer.module.scss';

export default function Transfer() {
  const spotifyContext = useContext(spotifyStore);
  const { store: spotifyState, dispatch: spotifyDispatch } = spotifyContext;
  const { importedPlaylists, searchResults, selectedSongs, selectedPlaylist } = spotifyState;

  const [isLoading, setIsLoading] = useState(false);

  const queue = createQueue(3);
  const router = useRouter();

  useEffect(() => {
    if (!spotifyState.selectedPlaylist) {
      const cachedPlaylists = window.sessionStorage.getItem('importedPlaylists');
      if (cachedPlaylists) {
        spotifyDispatch({
          type: 'setImportedPlaylists',
          importedPlaylists: JSON.parse(cachedPlaylists),
        });
      } else {
        router.replace('/', undefined, { shallow: true });
      }
    }
  }, [spotifyState.selectedPlaylist]);

  if (!importedPlaylists || !selectedPlaylist) {
    return null;
  }

  let removedTrackCount = 0;

  const importedPlaylist = importedPlaylists[selectedPlaylist];
  const playlistSelectedSongs = selectedSongs[selectedPlaylist] || {};
  const playlistSearchResults = searchResults[selectedPlaylist] || {};
  const importedPlaylistKeys = Object.keys(importedPlaylist);
  const spotifyPlaylistKeys = Object.keys(playlistSelectedSongs);
  const data = importedPlaylistKeys
    .filter((id) => {
      if (!importedPlaylist[id].title) {
        removedTrackCount++;
        return false;
      } else {
        return true;
      }
    })
    .map((id) => {
      if (isLoading || playlistSelectedSongs[id] != null) {
        const searchResults = playlistSearchResults[id];
        if (!searchResults || searchResults.length === 0) {
          return {
            id,
            status: isLoading ? <Spinner /> : <AlertTriangleFill color="red" />,
          ...importedPlaylist[id],
          }
        }

        const selectedSong = searchResults[playlistSelectedSongs[id]];
        const title = searchResults.length > 1
         ? (<Select initialValue={playlistSelectedSongs[id].toString()} disableMatchWidth>
              {searchResults.map(({ title, artist }, i) => (
                <Select.Option value={i.toString()}>
                  {i === playlistSelectedSongs[id] ? title : `${title} - ${artist}`}
                </Select.Option>
              ))}
            </Select>)
          : selectedSong.title

        return {
          id,
          status: <CheckInCircle color="green" />,
          ...selectedSong,
          title
        };
      }

      return {
        id,
        status: false ? <AlertTriangleFill color="red" /> : <Circle />,
        ...importedPlaylist[id],
      };
    });

  const createSpotifyPlaylist = () => {
    setIsLoading(true);
    data.forEach((song) => {
      queue.push(() =>
        spotifyState.spotifyApi
          .search(`track:${song.title}`, ['track'], {limit: 50})
          .then((res) => {
            const tracks = res.tracks?.items.map(({ id, artists, album, name }) => ({
              spotifyId: id,
              artist: artists[0].name,
              album: album.name,
              title: name
            }));

            if (tracks && tracks[0]) {
              spotifyDispatch({
                type: 'setSearchResults',
                playlistName: selectedPlaylist,
                songId: song.id,
                songs: tracks,
              });
            }
          })
          .catch(() => {})
      );
    });
    queue.promise.then(() => {
      setIsLoading(false);
    });
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={transferStyles.actionContainer}>
            <PlaylistChooser />
            <Button type="success" onClick={createSpotifyPlaylist}>
              Convert Playlist
            </Button>
            <Button type="success" onClick={createSpotifyPlaylist}>
              Create Playlist
            </Button>
          </div>
          <br />
          <br />
          {!!removedTrackCount && (
            <>
              {`FYI: ${removedTrackCount} song(s) were removed from Google Play after you added them to this playlist`}
              <br />
              <br />
            </>
          )}
          <Progress
            type="success"
            value={spotifyPlaylistKeys.length}
            max={importedPlaylistKeys.length}
          />
          <br />
          <br />
          <Table data={data}>
            <Table.Column prop="status" label="" />
            <Table.Column prop="title" label="Name" />
            <Table.Column prop="artist" label="Artist" />
            <Table.Column prop="album" label="Album" />
            {!!spotifyPlaylistKeys.length && <Table.Column prop="similarity" label="Confidence" />}
          </Table>
        </main>
      </div>
      <Footer />
    </>
  );
}
