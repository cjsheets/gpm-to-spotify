import React, { createContext, useReducer, Dispatch } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { User, Playlist, Song } from '../types';

interface SpotifyContext {
  store: SpotifyStore;
  dispatch: Dispatch<ActionTypes>;
}

interface SpotifyStore {
  token?: string | null;
  tokenExpires?: number;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  importedPlaylists: { [playlistName: string]: Playlist };
  spotifyPlaylists: { [playlistName: string]: Playlist };
  selectedPlaylist: string;
}

type ActionTypes =
  | { type: 'setToken'; token: string | null; tokenExpires?: number }
  | { type: 'setImportedPlaylists'; importedPlaylists: { [playlistName: string]: Playlist } }
  | { type: 'choosePlaylist'; selectedPlaylist: string }
  | { type: 'setSpotifySong'; playlistName: string; songId: string; song: Song };

const initialStore = {
  spotifyApi: new SpotifyWebApi(),
  importedPlaylists: {},
  spotifyPlaylists: {},
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
      const selectedPlaylist = Object.keys(action.importedPlaylists)[0];
      return { ...store, importedPlaylists: action.importedPlaylists, selectedPlaylist };

    case 'choosePlaylist':
      return { ...store, selectedPlaylist: action.selectedPlaylist };

    case 'setSpotifySong':
      const { playlistName, songId, song } = action;
      return {
        ...store,
        spotifyPlaylists: {
          ...store.spotifyPlaylists,
          [playlistName]: {
            ...store.spotifyPlaylists[playlistName],
            [songId]: song,
          },
        },
      };

    default:
      throw new Error();
  }
};

const SpotifyContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [store, dispatch] = useReducer(userContextReducer, initialStore);

  return <Provider value={{ store, dispatch }}> {children} </Provider>;
};

export { spotifyStore, SpotifyContextProvider };
