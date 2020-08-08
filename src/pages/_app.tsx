import '../styles/globals.css';
import 'purecss/build/base.css';
import 'purecss/build/buttons.css';
import 'purecss/build/forms-nr.css';
import type { AppProps } from 'next/app';
import UserContextProvider from '../contexts/user-context-provider';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Spotify Admin Panel</title>
      </Head>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </>
  );
}

export default MyApp;
