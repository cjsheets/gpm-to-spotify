import React, { useContext, useEffect } from 'react';
import styles from '../styles/LogIn.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import { spotifyStore } from '../stores/spotify-store';
import { Table } from '@zeit-ui/react';
import { useRouter } from 'next/router';
import PlaylistChooser from '../components/playlist-chooser';

export default function Index() {
  const spotifyContext = useContext(spotifyStore);
  const { store: spotifyState, dispatch: spotifyDispatch } = spotifyContext;
  const { importedPlaylists, selectedPlaylist } = spotifyState;

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

  const data = importedPlaylists[selectedPlaylist].map((song) => song);
  console.log(selectedPlaylist);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <PlaylistChooser />
          <Table data={data}>
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
