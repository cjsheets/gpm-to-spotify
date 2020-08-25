import React, { useState } from 'react';
import { Button } from '@zeit-ui/react';
import { withAuthentication } from '../utility/with-authentication';

interface Props {
  componentRef?: React.RefObject<HTMLButtonElement>;
}

export default withAuthentication(function SignInButton({ componentRef }: Props) {
  const [redirectUri, setRedirectUri] = useState<string>();

  React.useEffect(() => {
    if (redirectUri) {
      const signInParams = new URLSearchParams();
      signInParams.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID as string);
      signInParams.append('response_type', 'token');
      signInParams.append('redirect_uri', `${window.location.origin}/redirect`);

      const spotifyScopes = [
        'user-read-email',
        'user-read-private',
        'playlist-modify-public',
        'playlist-modify-private',
      ];
      signInParams.append('scope', spotifyScopes.join(','));

      window.location.href = `${redirectUri}?${signInParams}`;
    }
  }, [redirectUri]);

  const signInUrl = 'https://accounts.spotify.com/authorize';

  return (
    <Button
      auto
      type="success-light"
      size="large"
      style={{ marginLeft: '1rem' }}
      onClick={() => setRedirectUri(signInUrl)}
      ref={componentRef}
    >
      Sign in
    </Button>
  );
});
