import React, { useContext, useEffect, useState } from 'react';
import Avatar from '../components/avatar';
import Footer from '../components/footer';
import { spotifyStore } from '../stores/spotify-store';
import { Button, Card, Divider, Loading, Select, Spacer, Table, Tooltip } from '@zeit-ui/react';
import { useRouter } from 'next/router';
import PlaylistChooser from '../components/playlist-chooser';
import { createQueue } from '../utility/queue';
import {
  AlertTriangle,
  AlertTriangleFill,
  CheckCircle,
  CheckInCircle,
  Download,
  XOctagon,
} from '@zeit-ui/react-icons';
import styles from '../styles/pages-transfer.module.scss';
import { appendConfidenceLevel } from '../utility/confidence';
import { userStore } from '../stores/user-store';
import StatusIcon from '../components/status-icon';

export default function Transfer() {
  const userContext = useContext(userStore);
  const { store: userState } = userContext;

  const spotifyContext = useContext(spotifyStore);
  const { store: spotifyState, dispatch: spotifyDispatch } = spotifyContext;
  const { importedPlaylists, searchResults, selectedSongs, selectedPlaylist } = spotifyState;

  const [sortColumn, setSortColumn] = useState<'title' | 'artist' | 'album' | 'playcount' | 'playlistindex' | 'confidence'>(
    'title'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferringPlaylist, setTransferringPlaylist] = useState(false);
  const [transferredPlaylists, setTransferredPlaylists] = useState<string[]>([]);

  const searchSpotifyQueue = createQueue(4);
  const addToPlaylistQueue = createQueue(1);
  const router = useRouter();

  useEffect(() => {
    if (!spotifyState.selectedPlaylist) {
      const cachedPlaylists = window.sessionStorage.getItem('importedPlaylists');
      if (cachedPlaylists) {
        spotifyDispatch({
          type: 'setImportedPlaylists',
          importedPlaylists: JSON.parse(cachedPlaylists),
        });
      } else {
        router.replace('/', undefined, { shallow: true });
      }
    }
  }, [spotifyState.selectedPlaylist]);

  if (!importedPlaylists || !selectedPlaylist) {
    return null;
  }

  const chooseSong = (songId: string, selectedSong: number) => {
    spotifyDispatch({
      type: 'chooseSong',
      playlistName: spotifyState.selectedPlaylist,
      songId,
      selectedSong,
    });
  };

  const removeSong = (songId: string) => {
    spotifyDispatch({
      type: 'removeSong',
      playlistName: spotifyState.selectedPlaylist,
      songId,
    });
  };

  const importedPlaylist = importedPlaylists[selectedPlaylist];
  const playlistSelectedSongs = selectedSongs[selectedPlaylist] || {};
  const playlistSearchResults = searchResults[selectedPlaylist] || {};
  const importedPlaylistKeys = Object.keys(importedPlaylist).filter((id) => {
    if (!importedPlaylist[id].title) {
      return false;
    } else {
      return true;
    }
  });
  const spotifyPlaylistKeys = Object.keys(playlistSelectedSongs);
  const data = importedPlaylistKeys
    .map((id) => {
      if (isLoading || playlistSelectedSongs[id] != null) {
        const searchResults = playlistSearchResults[id];
        if (!searchResults || searchResults.length === 0) {
          return {
            id,
            status: (
              <StatusIcon
                Icon={AlertTriangleFill}
                color="red"
                disabled
                isLoading={isLoading}
                onRemove={() => removeSong(id)}
              />
            ),
            ...importedPlaylist[id],
          };
        }

        const selectedSong = searchResults[playlistSelectedSongs[id]];
        const title =
          searchResults.length > 1 ? (
            <Select
              initialValue={playlistSelectedSongs[id].toString()}
              onChange={(index) => chooseSong(id, +index)}
              disableMatchWidth
            >
              {searchResults.map(({ title, artist, confidence }, i) => (
                <Select.Option key={i.toString()} value={i.toString()}>
                  {i === playlistSelectedSongs[id] ? title : `${title} - ${artist} (${confidence})`}
                </Select.Option>
              ))}
            </Select>
          ) : (
            selectedSong.title
          );

        let icon = (
          <StatusIcon Icon={CheckInCircle} color="green" onRemove={() => removeSong(id)} />
        );
        const confidenceValue = selectedSong.confidence?.replace('%', '') || 0;
        if (+confidenceValue < 50) {
          icon = <StatusIcon Icon={XOctagon} color="red" onRemove={() => removeSong(id)} />;
        } else if (+confidenceValue < 90) {
          icon = <StatusIcon Icon={AlertTriangle} color="orange" onRemove={() => removeSong(id)} />;
        }

        const status = (
          <Tooltip
            placement="right"
            enterDelay={0}
            text={
              <div style={{ fontSize: 12 }}>
                <div>
                  <b>{'Original Song:'}</b>
                </div>
                <div>{importedPlaylist[id].title}</div>
                <div>{importedPlaylist[id].artist}</div>
                <div>{importedPlaylist[id].album}</div>
              </div>
            }
          >
            {icon}
          </Tooltip>
        );

        let playcount = importedPlaylist[id].playcount;
        let playlistindex = importedPlaylist[id].playlistindex;

        return {
          id,
          status,
          ...selectedSong,
          title,
          playcount,
          playlistindex,
        };
      }

      return {
        id,
        status: null,
        ...importedPlaylist[id],
      };
    })
    .sort((a, b) => {
      switch (sortColumn) {
        case 'confidence':
          return +(a.confidence?.replace('%', '') || 0) > +(b.confidence?.replace('%', '') || 0)
            ? 1
            : -1;
        case 'artist':
          return a.artist > b.artist ? 1 : -1;
        case 'album':
          return a.album > b.album ? 1 : -1;
        case 'playlistindex':
          return a.playlistindex > b.playlistindex ? 1 : -1;
        case 'playcount':
          return a.playcount < b.playcount ? 1 : -1;
        case 'title':
        default:
          // a.title could be a react component
          return importedPlaylist[a.id].title > importedPlaylist[b.id].title ? 1 : -1;
      }
    });

  const createSpotifyPlaylist = () => {
    setIsLoading(true);
    importedPlaylistKeys
      .filter((id) => importedPlaylist[id].title)
      .forEach((id) => {
        searchSpotifyQueue.push(() =>
          spotifyState.spotifyApi
            .search(`track:${importedPlaylist[id].title}`, ['track'], { limit: 50 })
            .then((res) => {
              // If no tracks were found, strip extra metadata (parentheses) and single quotes
              if (!res.tracks || res.tracks.items.length === 0) {
                let trimmedTitle = importedPlaylist[id].title.replace(/ *\([^)]*\) */g, '');
                trimmedTitle = trimmedTitle.replace(/ *\[[^\]]*\] */g, '');
                trimmedTitle = trimmedTitle.replace(/'/g, '');
                trimmedTitle.trim();
                return spotifyState.spotifyApi
                  .search(`track:${trimmedTitle}`, ['track'], {
                    limit: 50,
                  })
                  .then((_res) => _res.tracks?.items || []);
              }

              // If 50 tracks were found, call for another 50
              if (res.tracks && res.tracks.items.length === 50) {
                return spotifyState.spotifyApi
                  .search(`track:${importedPlaylist[id].title}`, ['track'], {
                    limit: 50,
                    offset: 50,
                  })
                  .then((_res) => res.tracks?.items.concat(_res.tracks?.items || []) || []);
              }

              return res.tracks?.items || [];
            })
            .then((items) => {
              const songs = appendConfidenceLevel(
                importedPlaylist[id],
                items.map(({ uri, artists, album, name, playcount, playlistindex }) => ({
                  uri,
                  artist: artists[0].name,
                  album: album.name,
                  title: name,
                  playcount: playcount,
                  playlistindex: playlistindex,
                }))
              );

              if (songs && songs[0]) {
                spotifyDispatch({
                  type: 'setSearchResults',
                  playlistName: selectedPlaylist,
                  songId: id,
                  songs,
                });
              }
            })
            .catch(() => {})
        );
      });
    searchSpotifyQueue.promise.then(() => {
      setIsLoading(false);
    });
  };

  const uploadSpotifyPlaylist = async () => {
    setTransferringPlaylist(true);
    const playlist = await spotifyState.spotifyApi.createPlaylist(userState.user?.id || '', {
      name: spotifyState.selectedPlaylist,
    });

    const uris = data.map((song) => song.uri as string).filter(Boolean);
    let i = 0;
    while (i < uris.length) {
      // Spotify only allows adding 100 songs at a time
      const subset = uris.slice(i, i + 90);
      addToPlaylistQueue.push(() =>
        spotifyState.spotifyApi.addTracksToPlaylist(playlist.id, subset)
      );
      i += 90;
    }

    await addToPlaylistQueue.promise;
    transferredPlaylists.push(spotifyState.selectedPlaylist);
    setTransferredPlaylists(transferredPlaylists);
    setTransferringPlaylist(false);
  };

  const downloadCsv = () => {
    const csv = data.reduce((acc, song) => {
      let str = `${importedPlaylist[song.id].title?.replace(/[,"]/g, '')}, ${song.artist?.replace(
        /[,"]/g,
        ''
      )}, ${song.album?.replace(/[,"]/g, '')}`;
      if (song.confidence) {
        str += `,${song.confidence}`;
      }
      return acc + str + '\n';
    }, '');
    const blob = new Blob([decodeURIComponent('%ef%bb%bf') + csv], {
      type: 'text/csv;charset=utf-8',
    });
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = `${selectedPlaylist}.csv`;
    document.body.appendChild(anchor);
    anchor.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
    document.body.removeChild(anchor);
  };

  const DownloadButton = () => (
    <>
      <Spacer x={2} />
      <Button
        auto
        ghost
        type="secondary"
        size="small"
        style={{ display: 'flex', alignItems: 'center' }}
        title="Download Playlist as CSV"
        onClick={downloadCsv}
      >
        <Download size={18} />
      </Button>
    </>
  );

  let actionButton;
  if (isLoading) {
    actionButton = (
      <Button type="success" style={{ margin: 'auto', display: 'block' }}>
        {`${Object.keys(playlistSearchResults).length} / ${importedPlaylistKeys.length}`}
        <Loading />
      </Button>
    );
  } else if (spotifyPlaylistKeys.length) {
    actionButton = (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button
          type="success-light"
          onClick={uploadSpotifyPlaylist}
          icon={
            transferredPlaylists.indexOf(spotifyState.selectedPlaylist) >= 0 ? (
              <CheckCircle />
            ) : undefined
          }
          loading={isTransferringPlaylist}
          title="Transfer Playlist to Spotify"
        >
          Transfer
        </Button>
        <DownloadButton />
      </div>
    );
  } else {
    actionButton = (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button
          ghost
          type="success"
          onClick={createSpotifyPlaylist}
          title="Convert GPM Songs to Spotify Songs"
        >
          Convert
        </Button>
        <DownloadButton />
      </div>
    );
  }

  return (
    <>
      <Avatar />
      <div className={styles.container}>
        <div className={styles.actionContainer}>
          <div>
            <Card width="100%">
              <Card.Content>
                <b>Choose an imported playlist</b>
              </Card.Content>
              <Divider y={0} />
              <Card.Content>
                <PlaylistChooser />
              </Card.Content>
            </Card>
          </div>
          <div>
            <Card width="100%">
              <Card.Content>
                {spotifyPlaylistKeys.length ? (
                  <b>Transfer playlist to Spotify</b>
                ) : (
                  <b>Convert to Spotify playlist</b>
                )}
              </Card.Content>
              <Divider y={0} />
              <Card.Content>{actionButton}</Card.Content>
            </Card>
          </div>
        </div>
        <Spacer y={1} />
        <h2 style={{ paddingLeft: 20 }}>{spotifyState.selectedPlaylist}</h2>
        <Spacer y={1} />

        <Table data={data}>
          <Table.Column prop="status" label="" />
          <Table.Column prop="title">
            <span className={styles.tableHeader} onClick={() => setSortColumn('title')}>
              {'Name'}
            </span>
          </Table.Column>
          <Table.Column prop="artist">
            <span className={styles.tableHeader} onClick={() => setSortColumn('artist')}>
              {'Artist'}
            </span>
          </Table.Column>
          <Table.Column prop="album">
            <span className={styles.tableHeader} onClick={() => setSortColumn('album')}>
              {'Album'}
            </span>
          </Table.Column>
          <Table.Column prop="playcount">
            <span className={styles.tableHeader} onClick={() => setSortColumn('playcount')}>
              {'Play Count'}
            </span>
          </Table.Column>
          <Table.Column prop="playlistindex">
            <span className={styles.tableHeader} onClick={() => setSortColumn('playlistindex')}>
              {'Playlist Index'}
            </span>
          </Table.Column>
          {!!spotifyPlaylistKeys.length && (
            <Table.Column prop="confidence">
              <span className={styles.tableHeader} onClick={() => setSortColumn('confidence')}>
                {'Confidence'}
              </span>
            </Table.Column>
          )}
          <Table.Column prop="remove" label="" />
        </Table>
      </div>
      <Footer />
    </>
  );
}
