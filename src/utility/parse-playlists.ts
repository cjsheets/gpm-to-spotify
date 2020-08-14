import { parse } from 'papaparse';

export function flattenArray<T>(arr: any[]): T[] {
  return arr.reduce((acc: T[], next: T | any[]) => {
    return acc.concat(Array.isArray(next) ? flattenArray(next) : next);
  }, []);
}

export function songArrayReducer(acc: any, next: any) {
  const playlistName = Object.keys(next)[0];
  const { Album, Artist, Title } = next[playlistName];
  if (Album != null && Artist != null && Title != null) {
    if (acc[playlistName]) {
      acc[playlistName].push({ album: Album, artist: Artist, title: Title });
    } else {
      acc[playlistName] = [{ album: Album, artist: Artist, title: Title }];
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
                          complete: (r) => {
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
