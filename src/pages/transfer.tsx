import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { spotifyStore } from '../stores/spotify-store';
import { Button, Progress, Spinner, Table } from '@zeit-ui/react';
import { useRouter } from 'next/router';
import PlaylistChooser from '../components/playlist-chooser';
import { createQueue } from '../utility/queue';
import { AlertTriangleFill, CheckInCircle, Circle } from '@zeit-ui/react-icons';
import styles from '../styles/LogIn.module.scss';
import transferStyles from '../styles/transfer.module.scss';

export default function Transfer() {
  const spotifyContext = useContext(spotifyStore);
  const { store: spotifyState, dispatch: spotifyDispatch } = spotifyContext;
  const { importedPlaylists, spotifyPlaylists, selectedPlaylist } = spotifyState;

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
  const spotifyPlaylist = spotifyPlaylists[selectedPlaylist] || {};
  const importedPlaylistKeys = Object.keys(importedPlaylist);
  const spotifyPlaylistKeys = Object.keys(spotifyPlaylist);
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
      if (isLoading || spotifyPlaylist[id]) {
        return {
          id,
          status: spotifyPlaylist[id] ? <CheckInCircle color="green" /> : <Spinner />,
          ...spotifyPlaylist[id],
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
            const track = res.tracks?.items[0];
            if (res.tracks?.items?.length && res.tracks?.items?.length > 1) { 
              console.log(res.tracks?.items);
            }
            if (!res.tracks?.items?.length || res.tracks?.items?.length === 0) { 
              console.log(res);
            }
            if (track) {
              spotifyDispatch({
                type: 'setSpotifySong',
                playlistName: selectedPlaylist,
                songId: song.id,
                song: {
                  spotifyId: track.id,
                  artist: track.artists[0].name,
                  album: track.album.name,
                  title: track.name,
                },
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
            {!!spotifyPlaylistKeys.length && <Table.Column prop="similarity" label="Score" />}
          </Table>
        </main>
      </div>
      <Footer />
    </>
  );
}
