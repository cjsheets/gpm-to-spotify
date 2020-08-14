import React, { useContext, useState, useEffect } from 'react';
import styles from '../styles/LogIn.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import { userStore } from '../stores/user-store';
import { spotifyStore } from '../stores/spotify-store';
import { useFetch } from '../utility/use-fetch';
import { useRouter } from 'next/router';
import { SessionInfo } from '../types';

export default function LogIn() {
  const userContext = useContext(userStore);
  const { dispatch: userDispatch } = userContext;

  const spotifyContext = useContext(spotifyStore);
  const { dispatch: spotifyDispatch, store: spotifyState } = spotifyContext;

  const [fetchResult, getfetchResult] = useFetch<SpotifyApi.CurrentUsersProfileResponse>(
    spotifyState.spotifyApi.getMe
  );

  const [tokenInfo, setTokenInfo] = useState<Partial<SessionInfo>>({});

  useEffect(() => {
    // Call spotifyApi.getMe() with the token from the auth redirect
    const search = window.location.hash.replace('#', '?');
    const urlParams = new URLSearchParams(search);

    const token = urlParams.get('access_token');
    if (token) {
      const tokenExpires = Number(urlParams.get('expires_in')) * 1000 + new Date().getTime();

      setTokenInfo({ token, tokenExpires });
      spotifyDispatch({ type: 'setToken', token, tokenExpires });

      getfetchResult();
    }
  }, []);

  const router = useRouter();

  useEffect(() => {
    // Cache the token and GET /me results for use on future routes
    const user = fetchResult.data;
    if (user) {
      userDispatch({ type: 'setUserInfo', user });

      const sessionInfo = JSON.stringify({ user, ...tokenInfo });
      window.sessionStorage.setItem('sessionInfo', sessionInfo);

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
