import React, { useState } from 'react';
import { Button } from '@zeit-ui/react';
import { withAuthentication } from '../utility/with-authentication';

export default withAuthentication(function SignInButton() {
  const [redirectUri, setRedirectUri] = useState<string>();

  React.useEffect(() => {
    if (redirectUri) {
      window.location.href = redirectUri;
    }
  }, [redirectUri]);

  const [origin, setOrigin] = useState('');

  React.useEffect(() => {
    // Origin needed for login redirect URI
    setOrigin(window.location.origin);
  }, []);

  const signInParams = new URLSearchParams();
  signInParams.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID as string);
  signInParams.append('response_type', 'token');
  signInParams.append('redirect_uri', `${origin}/redirect`);

  const spotifyScopes = ['user-read-email', 'user-read-private', 'playlist-modify-private'];
  signInParams.append('scope', spotifyScopes.join(','));

  const signInUrl = 'https://accounts.spotify.com/authorize';

  return (
    <Button
      auto
      type="success-light"
      size="large"
      style={{ marginLeft: '1rem' }}
      onClick={() => setRedirectUri(`${signInUrl}?${signInParams}`)}
    >
      Sign in
    </Button>
  );
});
