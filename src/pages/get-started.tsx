import React, { useContext, useState } from 'react';
import indexStyles from '../styles/pages-index.module.scss';
import gettingStartedStyles from '../styles/pages-getting-started.module.scss';
import Avatar from '../components/avatar';
import Footer from '../components/footer';
import { userStore } from '../stores/user-store';
import { Card, Divider, Spacer, Image, Display, Note } from '@zeit-ui/react';
import DropArea from '../components/droparea';
import SignInButton from '../components/sign-in-button';

export default function GetStarted() {
  const [isDragOver, setDragOver] = useState(false);

  const userContext = useContext(userStore);
  const { store } = userContext;

  return (
    <>
      <Avatar />
      <div className={indexStyles.container}>
        <main className={gettingStartedStyles.main}>
          <DropArea>
            <Card
              hoverable
              shadow={isDragOver}
              onDragOver={() => setDragOver(true)}
              onDragLeave={() => setDragOver(false)}
            >
              <Spacer y={1} />
              <p>Only a few steps and you can start transferring!</p>
              <Spacer y={1} />

              {!store.user && (
                <>
                  <Divider />
                  <h2>Sign in using Spotify</h2>

                  <Spacer y={2} />
                  <SignInButton />
                  <Spacer y={2} />
                </>
              )}

              <Divider />

              <h2>Export playlists from Google</h2>
              <Spacer y={1} />
              <p>
                Using <a href="https://takeout.google.com/">Google Play Music Takeout</a>, download
                your playlists and music
              </p>

              <Display shadow caption="Un-check all except Google Play Music">
                <Image width={650} height={168} src="/export-gpm.png" />
              </Display>
              <Spacer y={1} />

              {store.user && (
                <>
                  <Spacer y={1} />
                  <Divider />

                  <h2>Import Playlists</h2>

                  <Spacer y={1} />
                  <Note className={gettingStartedStyles.note}>
                    If the export is split into multiple parts, you should combine them by
                    dragging-dropping the "Google Play Music" folders onto each other.
                  </Note>
                  <Spacer y={1} />
                  <p>
                    Drag and drop the "Playlists" folder (located inside "Takeout" &gt; "Google Play
                    Music") here.
                  </p>
                </>
              )}
            </Card>
          </DropArea>
        </main>
      </div>
      <Footer />
    </>
  );
}
