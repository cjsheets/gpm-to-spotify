import React, { createContext, useReducer, Dispatch } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { User, Playlist } from '../types';

interface SpotifyContext {
  store: SpotifyStore;
  dispatch: Dispatch<ActionTypes>;
}

interface SpotifyStore {
  token?: string | null;
  tokenExpires?: number;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  importedPlaylists: { [playlistName: string]: Playlist };
  selectedPlaylist: string;
}

type ActionTypes =
  | { type: 'setToken'; token: string | null; tokenExpires?: number }
  | { type: 'setImportedPlaylists'; importedPlaylists: { [playlistName: string]: Playlist } }
  | { type: 'choosePlaylist'; selectedPlaylist: string };

const initialStore = {
  spotifyApi: new SpotifyWebApi(),
  importedPlaylists: {},
  selectedPlaylist: '',
};

const spotifyStore = createContext<SpotifyContext>({
  store: initialStore,
  dispatch: () => null,
});
const { Provider } = spotifyStore;

const userContextReducer = (store: SpotifyStore, action: ActionTypes): SpotifyStore => {
  switch (action.type) {
    case 'setToken':
      store.spotifyApi.setAccessToken(action.token);
      return { ...store, token: action.token, tokenExpires: action.tokenExpires };

    case 'setImportedPlaylists':
      console.log('set playlists', action.importedPlaylists);
      const selectedPlaylist = Object.keys(action.importedPlaylists)[0];
      return { ...store, importedPlaylists: action.importedPlaylists, selectedPlaylist };

    case 'choosePlaylist':
      return { ...store, selectedPlaylist: action.selectedPlaylist };

    default:
      throw new Error();
  }
};

const SpotifyContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [store, dispatch] = useReducer(userContextReducer, initialStore);

  return <Provider value={{ store, dispatch }}> {children} </Provider>;
};

export { spotifyStore, SpotifyContextProvider };
