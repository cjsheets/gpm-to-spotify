import React, { useState } from 'react';
import { useToasts, Loading } from '@zeit-ui/react';
import { parse } from 'papaparse';

export default function DropArea({ children }: React.PropsWithChildren<{}>) {
  const [isParsing, setIsParsing] = useState(false);
  const [, setToast] = useToasts();

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    function traverseDirectory(entry: any) {
      const reader = entry.createReader();
      return new Promise((resolve, reject) => {
        const iterationAttempts: any = [];

        function readEntries() {
          reader.readEntries(
            (entries: any) => {
              if (entries.length) {
                iterationAttempts.push(
                  Promise.all(
                    entries.map((entry: any) => {
                      if (entry.isFile && entry.name.indexOf('.csv') > -1) {
                        return new Promise((res) => {
                          const playlist = entry.fullPath.split('/')[2];
                          entry.file((file: File) => {
                            parse(file, {
                              header: true,
                              complete: (r) => {
                                res({ [playlist]: r.data[0] });
                              },
                            });
                          });
                        });
                      }

                      return traverseDirectory(entry);
                    })
                  )
                );

                // Call again until all entries are returned
                readEntries();
              } else {
                // Done iterating this directory
                resolve(Promise.all(iterationAttempts));
              }
            },
            (error: Error) => reject(error)
          );
        }

        readEntries();
      });
    }

    if (event?.dataTransfer) {
      const items = event.dataTransfer.items;
      for (let i = 0; i < items.length; i++) {
        const rootFolder = items[i].webkitGetAsEntry();
        if (rootFolder && rootFolder.name == 'Playlists') {
          setIsParsing(true);
          traverseDirectory(rootFolder).then((result) => {
            setIsParsing(false);
            console.log(result);
          });
        } else {
          setToast({ text: 'Drag in the folder called "Playlists"', type: 'error' });
        }
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}>
      {children}
      {isParsing && <Loading size="large">{'Please wait, parsing playlists'}</Loading>}
    </div>
  );
}
