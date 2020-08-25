import React, { useContext, useState, useEffect } from 'react';
import styles from '../styles/pages-index.module.scss';
import Footer from '../components/footer';
import { userStore } from '../stores/user-store';
import { spotifyStore } from '../stores/spotify-store';
import { useFetch } from '../utility/use-fetch';
import { useRouter } from 'next/router';
import { SessionInfo } from '../types';
import { Loading } from '@zeit-ui/react';

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

      window.sessionStorage.setItem('sessionInfo', JSON.stringify({ user, ...tokenInfo }));
      window.localStorage.setItem('returningUser', JSON.stringify({ isReturning: true }));

      router.replace('/get-started', undefined, { shallow: true });
    }
  }, [fetchResult]);

  return (
    <>
      <div className={styles.container}>
        <Loading>Logging in</Loading>
      </div>
      <Footer />
    </>
  );
}
