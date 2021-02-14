import { parse } from 'papaparse';

export function flattenArray<T>(arr: any[]): T[] {
  return arr.reduce((acc: T[], next: T | any[]) => {
    return acc.concat(Array.isArray(next) ? flattenArray(next) : next);
  }, []);
}

export function songArrayReducer(acc: any, next: any) {
  const decodeChars = (str: string) =>  str.replace(/\&#39;/g, '\'')
    .replace(/\&quot;/g, '"').replace(/\&amp;/g, '&')
    .replace(/\&lt;/g, '<').replace(/\&gt;/g, '>');
  const playlistName = Object.keys(next)[0];
  const { Album, Artist, Title, PlayCount, PlaylistIndex} = next[playlistName];
  if (Album != null && Artist != null && Title != null && PlayCount != null && PlaylistIndex != null) {
    const album = decodeChars(Album);
    const artist = decodeChars(Artist);
    const title = decodeChars(Title).replace(/"/g, '');
    const playcount = parseInt(PlayCount);
    const playlistindex = parseInt(PlaylistIndex);
    if (!acc[playlistName]) {
      acc[playlistName] = { 0: { album, artist, title, playcount, playlistindex } };
    } else {
      const numSongs = Object.keys(acc[playlistName]).length;
      acc[playlistName][numSongs] = { album, artist, title, playcount, playlistindex };
    }
  }

  return acc;
}

export function findAndParseCsvs(entry: any): Promise<any[]> {
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
                          complete: (r: any) => {
                            // Reassign properties to names that don't contain spaces
                            // There's probably a better way to reference these columns in
                            // songArrayReducer which doesn't require this, but I don't know it.
                            r.data[0]["PlayCount"] = r.data[0]["Play Count"];
                            r.data[0]["PlaylistIndex"] = r.data[0]["Playlist Index"];

                            res({ [playlist]: r.data[0] });
                          },
                        });
                      });
                    });
                  }

                  return findAndParseCsvs(entry);
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
