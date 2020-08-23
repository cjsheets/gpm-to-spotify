import React, { useContext } from 'react';
import { spotifyStore } from '../stores/spotify-store';
import { Select } from '@zeit-ui/react';

export default function PlaylistChooser() {
  const spotifyContext = useContext(spotifyStore);
  const { store: spotifyState, dispatch: spotifyDispatch } = spotifyContext;
  const { importedPlaylists, selectedPlaylist } = spotifyState;

  const playlistNames = Object.keys(importedPlaylists);

  return (
    <Select
      width="100%"
      style={{ height: 40 }}
      initialValue={selectedPlaylist}
      onChange={(p) => spotifyDispatch({ type: 'choosePlaylist', selectedPlaylist: p as string })}
    >
      {playlistNames.map((name) => (
        <Select.Option key={name} value={name}>
          {name}
        </Select.Option>
      ))}
    </Select>
  );
}
