import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { spotifyStore } from '../stores/spotify-store';
import { Button, Progress, Select, Spinner, Table, Tooltip } from '@zeit-ui/react';
import { useRouter } from 'next/router';
import PlaylistChooser from '../components/playlist-chooser';
import { createQueue } from '../utility/queue';
import {
  AlertTriangle,
  AlertTriangleFill,
  CheckInCircle,
  Circle,
  XOctagon,
} from '@zeit-ui/react-icons';
import styles from '../styles/LogIn.module.scss';
import transferStyles from '../styles/transfer.module.scss';
import { appendConfidenceLevel } from '../utility/confidence';
import { userStore } from '../stores/user-store';

export default function Transfer() {
  const userContext = useContext(userStore);
  const { store: userState } = userContext;

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

  const chooseSong = (songId: string, selectedSong: number) => {
    spotifyDispatch({
      type: 'chooseSong',
      playlistName: spotifyState.selectedPlaylist,
      songId,
      selectedSong,
    });
  };

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
          };
        }

        const selectedSong = searchResults[playlistSelectedSongs[id]];
        const title =
          searchResults.length > 1 ? (
            <Select
              initialValue={playlistSelectedSongs[id].toString()}
              onChange={(index) => chooseSong(id, +index)}
              disableMatchWidth
            >
              {searchResults.map(({ title, artist, confidence }, i) => (
                <Select.Option key={i.toString()} value={i.toString()}>
                  {i === playlistSelectedSongs[id] ? title : `${title} - ${artist} (${confidence})`}
                </Select.Option>
              ))}
            </Select>
          ) : (
            selectedSong.title
          );

        let icon = <CheckInCircle color="green" />;
        const confidenceValue = selectedSong.confidence?.replace('%', '') || 0;
        if (+confidenceValue < 50) {
          icon = <XOctagon color="red" />;
        } else if (+confidenceValue < 90) {
          icon = <AlertTriangle color="orange" />;
        }

        const status = (
          <Tooltip
            placement="right"
            text={
              <div style={{ fontSize: 12 }}>
                <div>
                  <b>{'Original Song:'}</b>
                </div>
                <div>{importedPlaylist[id].title}</div>
                <div>{importedPlaylist[id].artist}</div>
                <div>{importedPlaylist[id].album}</div>
              </div>
            }
          >
            {icon}
          </Tooltip>
        );

        return {
          id,
          status,
          ...selectedSong,
          title,
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
    importedPlaylistKeys
      .filter((id) => importedPlaylist[id].title)
      .forEach((id) => {
        queue.push(() =>
          spotifyState.spotifyApi
            .search(`track:${importedPlaylist[id].title}`, ['track'], { limit: 50 })
            .then((res) => {
              const tracks = appendConfidenceLevel(
                importedPlaylist[id],
                res.tracks?.items.map(({ uri, artists, album, name }) => ({
                  uri,
                  artist: artists[0].name,
                  album: album.name,
                  title: name,
                }))
              );

              if (tracks && tracks[0]) {
                spotifyDispatch({
                  type: 'setSearchResults',
                  playlistName: selectedPlaylist,
                  songId: id,
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

  const uploadSpotifyPlaylist = async () => {
    const playlist = await spotifyState.spotifyApi.createPlaylist(userState.user?.id || '', {
      name: spotifyState.selectedPlaylist,
    });

    const uris = data.map((song) => song.uri as string).filter(Boolean);

    await spotifyState.spotifyApi.addTracksToPlaylist(playlist.id, uris);
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
            <Button type="success" onClick={uploadSpotifyPlaylist}>
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
            {!!spotifyPlaylistKeys.length && <Table.Column prop="confidence" label="Confidence" />}
            <Table.Column prop="remove" label="" />
          </Table>
        </main>
      </div>
      <Footer />
    </>
  );
}
