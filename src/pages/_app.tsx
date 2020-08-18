import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { ZeitProvider, CssBaseline } from '@zeit-ui/react';
import { UserContextProvider } from '../stores/user-store';
import { SpotifyContextProvider } from '../stores/spotify-store';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ZeitProvider>
      <Head>
        <title>Spotify Admin Panel</title>
        {process.env.NODE_ENV === 'production' && (
          <script type="text/javascript" src="/public/rollbar.js"></script>
        )}
      </Head>
      <CssBaseline />
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
    </ZeitProvider>
  );
}

export default MyApp;
