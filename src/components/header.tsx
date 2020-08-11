import React, { useState, useContext } from 'react';
import styles from '../styles/Header.module.scss';
import { userStore } from '../stores/user-store';
import { spotifyStore } from '../stores/spotify-store';
import { SessionInfo } from '../types';

export default function Header() {
  const userContext = useContext(userStore);
  const { store: userState, dispatch: userDispatch } = userContext;

  const spotifyContext = useContext(spotifyStore);
  const { dispatch: spotifyDispatch } = spotifyContext;

  const [origin, setOrigin] = useState('');

  React.useEffect(() => {
    setOrigin(window.location.origin);

    if (!userState.user) {
      const cachedSession = window.sessionStorage.getItem('sessionInfo');
      if (cachedSession) {
        const { user, token, tokenExpires } = JSON.parse(cachedSession) as SessionInfo;

        if (new Date(tokenExpires) > new Date()) {
          userDispatch({ type: 'setUserInfo', user });
          spotifyDispatch({ type: 'setToken', token, tokenExpires });
        } else {
          window.sessionStorage.clear();
        }
      }
    }
  }, []);

  const signInUrl = 'https://accounts.spotify.com/authorize';
  const params = new URLSearchParams();
  params.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID as string);
  params.append('response_type', 'token');
  params.append('redirect_uri', `${origin}/login`);
  params.append('scope', spotifyScopes.join(','));

  return (
    <div className={styles.container}>
      <div className={styles.logo}>Spotify Admin Panel</div>
      <div className={styles.signIn}>
        {userState.user ? (
          userState.user.display_name
        ) : (
          <a href={`${signInUrl}?${params}`}>Sign in</a>
        )}
      </div>
    </div>
  );
}

const spotifyScopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify',
];
