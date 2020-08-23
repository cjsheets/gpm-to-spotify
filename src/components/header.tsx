import React, { useState, useContext } from 'react';
import styles from '../styles/header.module.scss';
import { userStore } from '../stores/user-store';
import { spotifyStore } from '../stores/spotify-store';
import { SessionInfo } from '../types';
import { Avatar, Link, Popover } from '@zeit-ui/react';

export default function Header() {
  const userContext = useContext(userStore);
  const { store: userState, dispatch: userDispatch } = userContext;

  const spotifyContext = useContext(spotifyStore);
  const { dispatch: spotifyDispatch } = spotifyContext;

  const [origin, setOrigin] = useState('');

  React.useEffect(() => {
    // Origin needed for login redirect URI
    setOrigin(window.location.origin);

    // Check for cached session, maybe login isn't needed
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

  const SignOutMenu = () => {
    const clearStorage = () => {
      window.sessionStorage.clear();
    };

    return (
      <div style={{ padding: '0 10px', width: 100 }}>
        <Link onClick={clearStorage}>Sign out</Link>
      </div>
    );
  };

  const url = userState?.user?.images && userState.user.images[0]?.url;

  return (
    <div className={styles.container}>
      <div className={styles.signIn}>
        {userState.user ? (
          <Popover content={SignOutMenu} trigger="hover">
            {url ? <Avatar src={url} size={50} /> : userState.user.display_name}
          </Popover>
        ) : (
          <a href={`${signInUrl}?${params}`}>Sign in</a>
        )}
      </div>
    </div>
  );
}

const spotifyScopes = ['user-read-email', 'user-read-private', 'playlist-modify-private'];
