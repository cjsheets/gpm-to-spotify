import React, { createContext, useReducer, Dispatch } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { User } from '../types';

interface SpotifyContext {
  store: SpotifyStore;
  dispatch: Dispatch<ActionTypes>;
}

interface SpotifyStore {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
}

type ActionTypes = { type: 'setToken'; token: string | null } | { type: 'getMe' };

const initialStore = { spotifyApi: new SpotifyWebApi() };

const spotifyStore = createContext<SpotifyContext>({
  store: initialStore,
  dispatch: () => null,
});
const { Provider } = spotifyStore;

const userContextReducer = (store: SpotifyStore, action: ActionTypes): SpotifyStore => {
  switch (action.type) {
    case 'setToken':
      store.spotifyApi.setAccessToken(action.token);
      return { ...store };

    case 'getMe':
      store.spotifyApi.getMe();
      return { ...store };

    default:
      throw new Error();
  }
};

const SpotifyContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [store, dispatch] = useReducer(userContextReducer, initialStore);

  return <Provider value={{ store, dispatch }}> {children} </Provider>;
};

export { spotifyStore, SpotifyContextProvider };
