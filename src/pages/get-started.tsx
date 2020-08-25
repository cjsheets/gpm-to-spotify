import React, { createRef, useContext, useEffect } from 'react';
import indexStyles from '../styles/pages-index.module.scss';
import gettingStartedStyles from '../styles/pages-getting-started.module.scss';
import Avatar from '../components/avatar';
import Footer from '../components/footer';
import { userStore } from '../stores/user-store';
import { Divider, Spacer, Image, Display, Note } from '@zeit-ui/react';
import DropArea from '../components/droparea';
import SignInButton from '../components/sign-in-button';

export default function GetStarted() {
  const signInRef = createRef<HTMLButtonElement>();
  const userContext = useContext(userStore);
  const { store } = userContext;

  useEffect(() => {
    const returningUser = window.localStorage.getItem('returningUser');
    const knownUser = returningUser && JSON.parse(returningUser);
    if (knownUser?.isReturning && !store.user) {
      signInRef?.current?.click();
    }
  }, []);

  return (
    <>
      <Avatar />
      <div className={indexStyles.container}>
        <main className={gettingStartedStyles.main}>
          <DropArea disabled={!store.user}>
            <p>Only a few steps and you can start transferring!</p>
            <Spacer y={1} />

            {!store.user && (
              <>
                <Divider />
                <h2>1. Sign in using Spotify</h2>

                <Spacer y={2} />
                <SignInButton componentRef={signInRef} />
                <Spacer y={2} />
              </>
            )}

            <Divider />

            <h2>2. Export playlists from Google</h2>
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

                <h2>3. Import Playlists</h2>

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
          </DropArea>
        </main>
      </div>
      <Footer />
    </>
  );
}
