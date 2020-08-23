import React, { useState, useContext, useEffect } from 'react';
import { useToasts, Loading, Card } from '@zeit-ui/react';
import { findAndParseCsvs, flattenArray, songArrayReducer } from '../utility/parse-playlists';
import { Playlist } from '../types';
import { useRouter } from 'next/router';
import { spotifyStore } from '../stores/spotify-store';

export default function DropArea({
  children,
  disabled,
}: React.PropsWithChildren<{ disabled?: boolean }>) {
  const [isDragOver, setDragOver] = useState(false);

  const spotifyContext = useContext(spotifyStore);
  const { dispatch: spotifyDispatch } = spotifyContext;

  const [parsingState, setParsingState] = useState<'parsing' | 'done'>();
  const [, setToast] = useToasts();

  const router = useRouter();

  useEffect(() => {
    if (parsingState === 'done') {
      router.replace('/transfer', undefined, { shallow: true });
    }
  }, [parsingState]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!event?.dataTransfer || disabled) {
      return;
    }

    const rootFolder = event.dataTransfer.items[0].webkitGetAsEntry();
    if (rootFolder?.name !== 'Playlists') {
      setToast({ text: 'Drag in the folder called "Playlists"', type: 'error' });
      return;
    }

    setParsingState('parsing');
    findAndParseCsvs(rootFolder).then((nestedResults) => {
      const importedPlaylists = flattenArray(nestedResults).reduce(songArrayReducer, {}) as {
        [playlistName: string]: Playlist;
      };
      window.sessionStorage.setItem('importedPlaylists', JSON.stringify(importedPlaylists));
      spotifyDispatch({ type: 'setImportedPlaylists', importedPlaylists });
      setParsingState('done');
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}>
      <Card
        hoverable
        shadow={isDragOver}
        onDragOver={() => setDragOver(true)}
        onDragLeave={() => setDragOver(false)}
        style={{ padding: 10, minHeight: '60vh', minWidth: 650 }}
      >
        {parsingState ? (
          <Loading size="large">{'Please wait, parsing playlists'}</Loading>
        ) : (
          children
        )}
      </Card>
    </div>
  );
}
