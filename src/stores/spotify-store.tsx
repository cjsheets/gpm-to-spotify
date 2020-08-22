import React, { createContext, useReducer, Dispatch } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { Playlist, Song, SearchResult } from '../types';

interface SpotifyContext {
  store: SpotifyStore;
  dispatch: Dispatch<ActionTypes>;
}

interface SpotifyStore {
  token?: string | null;
  tokenExpires?: number;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  importedPlaylists: { [playlistName: string]: Playlist };
  selectedSongs: { [playlistName: string]: {[importId: string]: number} };
  searchResults: { [playlistName: string]: SearchResult };
  selectedPlaylist: string;
}

type ActionTypes =
  | { type: 'setToken'; token: string | null; tokenExpires?: number }
  | { type: 'setImportedPlaylists'; importedPlaylists: { [playlistName: string]: Playlist } }
  | { type: 'choosePlaylist'; selectedPlaylist: string }
  | { type: 'chooseSong'; playlistName: string; songId: string; selectedSong: number }
  | { type: 'setSearchResults'; playlistName: string; songId: string; songs: Song[] };

const initialStore = {
  spotifyApi: new SpotifyWebApi(),
  importedPlaylists: {},
  selectedSongs: {},
  searchResults: {},
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

    case 'chooseSong':
      return {
        ...store,
        selectedSongs: {
          ...store.selectedSongs,
          [action.playlistName]: {
            ...store.selectedSongs[action.playlistName],
            [action.songId]: action.selectedSong,
          },
        },
      };

    case 'setSearchResults':
      return {
        ...store,
        searchResults: {
          ...store.searchResults,
          [action.playlistName]: {
            ...store.searchResults[action.playlistName],
            [action.songId]: action.songs,
          },
        },
        selectedSongs: {
          ...store.selectedSongs,
          [action.playlistName]: {
            ...store.selectedSongs[action.playlistName],
            [action.songId]: 0,
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
