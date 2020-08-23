import React, { useContext, useState } from 'react';
import indexStyles from '../styles/pages-index.module.scss';
import gettingStartedStyles from '../styles/pages-getting-started.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import { userStore } from '../stores/user-store';
import { Card, Divider } from '@zeit-ui/react';
import DropArea from '../components/droparea';
import { GradientWave } from '../components/images/gradient-wave';

export default function GetStarted() {
  const [isDragOver, setDragOver] = useState(false);

  const userContext = useContext(userStore);
  const { store } = userContext;

  return (
    <>
      <GradientWave />
      <Header />
      <div className={indexStyles.container}>
        <main className={gettingStartedStyles.main}>
          <DropArea>
            <Card
              hoverable
              shadow={isDragOver}
              onDragOver={() => setDragOver(true)}
              onDragLeave={() => setDragOver(false)}
            >
              <p>Only a few steps and you can start transferring!</p>
              <Divider />
              <h2>Sign in using Spotify</h2>

              <p>Transferring playlists to Spotify requires a sign in.</p>

              <Divider />

              <h2>Export from Google</h2>
              <p>
                Using <a href="https://takeout.google.com/">Google Play Music Takeout</a>, download
                your playlists and music
              </p>

              <Card className={gettingStartedStyles.imageContainer}>
                <img src="/export-gpm.png" className={gettingStartedStyles.screenshot} />
              </Card>

              <ol>
                <li>Export your playlists with Google Play Music Takeout</li>
                <li>Extract the zip file</li>
                <ol>
                  <li>
                    If the export has multiple parts, combine them by (copy + paste Takeout folders
                    into each other)
                  </li>
                </ol>
                <li>Drag and Drop the "Google Play Music" folder (inside "Takeout") here</li>
              </ol>
            </Card>
          </DropArea>
        </main>
      </div>
      <Footer />
    </>
  );
}
