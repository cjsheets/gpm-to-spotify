import React, { useContext } from 'react';
import styles from '../styles/LogIn.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import { userStore } from '../stores/user-store';
import { spotifyStore } from '../stores/spotify-store';
import { useFetch } from '../utility/use-fetch';
import { useRouter } from 'next/router';

export default function LogIn() {
  const userContext = useContext(userStore);
  const { dispatch: userDispatch } = userContext;

  const spotifyContext = useContext(spotifyStore);
  const { dispatch: spotifyDispatch, store: spotifyState } = spotifyContext;

  const [fetchResult, getfetchResult] = useFetch<SpotifyApi.CurrentUsersProfileResponse>(
    spotifyState.spotifyApi.getMe
  );

  React.useEffect(() => {
    const search = window.location.hash.replace('#', '?');
    const urlParams = new URLSearchParams(search);
    if (urlParams.get('access_token')) {
      spotifyDispatch({ type: 'setToken', token: urlParams.get('access_token') });
      getfetchResult();
    }
  }, []);

  const router = useRouter();

  React.useEffect(() => {
    if (fetchResult?.data) {
      userDispatch({ type: 'setUserInfo', user: fetchResult.data });
      router.replace('/', undefined, { shallow: true });
    }
  }, [fetchResult]);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>{'Logging in...'}</main>
      </div>
      <Footer />
    </>
  );
}
