import React, { useState } from 'react';

export default function DropArea({ children }: React.PropsWithChildren<{}>) {
  const [folderTree, setFolderTree] = useState({ Playlists: {} });

  function traverseTree(fsEntry: any, path = '') {
    if (fsEntry.isFile) {
      fsEntry.file((file: File) => {
        console.log('file', file.name);
      });
    } else if (fsEntry.isDirectory) {
      const dirReader = fsEntry.createReader();
      dirReader.readEntries((entries: any) => {
        for (let i = 0; i < entries.length; i++) {
          traverseTree(entries[i], path + fsEntry.name + '/');
        }
      });
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event?.dataTransfer) {
      const items = event.dataTransfer.items;
      for (let i = 0; i < items.length; i++) {
        const playlistFolder = items[i].webkitGetAsEntry();
        if (playlistFolder && playlistFolder.name == 'Playlists') {
          traverseTree(playlistFolder);
        } else {
          throw new Error('Must drag and drop the "Playlists" folder');
        }
      }

      console.log(folderTree);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}>
      {children}
    </div>
  );
}
