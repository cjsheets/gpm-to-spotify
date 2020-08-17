import React, { useContext, useEffect } from 'react';
import styles from '../styles/LogIn.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import { spotifyStore } from '../stores/spotify-store';
import { Button, Table } from '@zeit-ui/react';
import { useRouter } from 'next/router';
import PlaylistChooser from '../components/playlist-chooser';
import { createQueue } from '../utility/queue';
import { CheckInCircle, Circle } from '@zeit-ui/react-icons';

export default function Transfer() {
  const spotifyContext = useContext(spotifyStore);
  const { store: spotifyState, dispatch: spotifyDispatch } = spotifyContext;
  const { importedPlaylists, spotifyPlaylists, selectedPlaylist } = spotifyState;

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

  const importedPlaylist = importedPlaylists[selectedPlaylist];
  const spotifyPlaylist = spotifyPlaylists[selectedPlaylist] || {};
  const data = Object.keys(importedPlaylist).map((id) =>
    spotifyPlaylist[id]
      ? { id, status: <CheckInCircle />, ...spotifyPlaylist[id] }
      : { id, status: <Circle />, ...importedPlaylist[id] }
  );

  const createSpotifyPlaylist = () => {
    data.forEach((song) => {
      queue.push(() =>
        spotifyState.spotifyApi.search(song.title, ['track']).then((res) => {
          const track = res.tracks?.items[0];
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
      );
    });
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <PlaylistChooser />
          <Button type="success" onClick={createSpotifyPlaylist}>
            Convert to Spotify Playlist
          </Button>
          <Table data={data}>
            <Table.Column prop="status" label="" />
            <Table.Column prop="title" label="Name" />
            <Table.Column prop="artist" label="Artist" />
            <Table.Column prop="album" label="Album" />
          </Table>
        </main>
      </div>
      <Footer />
    </>
  );
}
