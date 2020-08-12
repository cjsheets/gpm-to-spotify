import React, { useContext, useState } from 'react';
import styles from '../styles/LogIn.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import { userStore } from '../stores/user-store';
import { Card } from '@zeit-ui/react';
import DropArea from '../components/droparea';

export default function Index() {
  const [isDragOver, setDragOver] = useState(false);

  const userContext = useContext(userStore);
  const { store } = userContext;

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          {!store.user && (
            <>
              <h1>Import Google Play Music playlists to Spotify</h1>
            </>
          )}
          {store.user && (
            <DropArea>
              <Card
                hoverable
                shadow={isDragOver}
                onDragOver={() => setDragOver(true)}
                onDragLeave={() => setDragOver(false)}
                style={{ width: '80vw', height: '50vh' }}
              >
                <h3>Hi {store.user.display_name}</h3>
                <p>Only a few more steps and you can start importing!</p>
                <ol>
                  <li>Export your playlists with Google Play Music Takeout</li>
                  <li>Extract the zip file</li>
                  <ol>
                    <li>
                      If the export has multiple parts, combine them by (copy + paste Takeout
                      folders into each other)
                    </li>
                  </ol>
                  <li>Drag and Drop the "Google Play Music" folder (inside "Takeout") here</li>
                </ol>
              </Card>
            </DropArea>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
