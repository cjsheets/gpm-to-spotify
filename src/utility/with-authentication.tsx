import React, { useContext } from 'react';
import { userStore } from '../stores/user-store';
import { spotifyStore } from '../stores/spotify-store';
import { SessionInfo } from '../types';

export function withAuthentication(WrappedComponent: (props: any) => JSX.Element | null) {
  return function (props: any) {
    const userContext = useContext(userStore);
    const { store: userState, dispatch: userDispatch } = userContext;

    const spotifyContext = useContext(spotifyStore);
    const { dispatch: spotifyDispatch } = spotifyContext;

    React.useEffect(() => {
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

    return <WrappedComponent {...props} />;
  };
}
