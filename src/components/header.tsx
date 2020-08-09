import React, { useState, useContext } from 'react';
import styles from '../styles/Header.module.scss';
import { userStore } from '../stores/user-store';

export default function Header() {
  const userContext = useContext(userStore);
  const { store } = userContext;

  const [origin, setOrigin] = useState('');

  React.useEffect(() => {
    setOrigin(window.location.origin);
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
        {store.user ? store.user.display_name : <a href={`${signInUrl}?${params}`}>Sign in</a>}
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
