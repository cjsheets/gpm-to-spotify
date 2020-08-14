import React, { useContext, useEffect } from 'react';
import styles from '../styles/LogIn.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import { userStore } from '../stores/user-store';
import { spotifyStore } from '../stores/spotify-store';
import { Table } from '@zeit-ui/react';

export default function Index() {
  const spotifyContext = useContext(spotifyStore);
  const { store: spotifyState, dispatch: spotifyDispatch } = spotifyContext;

  const userContext = useContext(userStore);
  const { store } = userContext;

  useEffect(() => {
    if (!spotifyState.importedPlaylists) {
      const importedPlaylists = JSON.parse(
        window.sessionStorage.getItem('importedPlaylists') || '{}'
      );
      spotifyDispatch({ type: 'setImportedPlaylists', importedPlaylists });
    }
  }, [spotifyState.importedPlaylists]);

  const playlist =
    (spotifyState.importedPlaylists &&
      spotifyState.importedPlaylists[Object.keys(spotifyState.importedPlaylists)[0]]) ||
    [];

  const data = playlist.map((song) => song);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
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
