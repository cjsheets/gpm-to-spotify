import '../styles/globals.scss';
import 'purecss/build/base.css';
import 'purecss/build/buttons.css';
import 'purecss/build/forms-nr.css';
import type { AppProps } from 'next/app';
import { UserContextProvider } from '../stores/user-store';
import { SpotifyContextProvider } from '../stores/spotify-store';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Spotify Admin Panel</title>
      </Head>
      <UserContextProvider>
        <SpotifyContextProvider>
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Component {...pageProps} />
          </div>
        </SpotifyContextProvider>
      </UserContextProvider>
    </>
  );
}

export default MyApp;
