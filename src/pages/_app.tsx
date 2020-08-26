import '../styles/globals.scss';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { ZeitProvider, CssBaseline } from '@zeit-ui/react';
import { UserContextProvider } from '../stores/user-store';
import { SpotifyContextProvider } from '../stores/spotify-store';
import Head from 'next/head';
import Router from 'next/router';
import { pageview } from '../utility/analytics';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      process.env.NODE_ENV === 'production' && pageview(url);
    };

    Router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <ZeitProvider>
      <Head>
        <title>Google Play Music to Spotify</title>
        {process.env.NODE_ENV === 'production' && (
          <script type="text/javascript" src="/rb.js"></script>
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
