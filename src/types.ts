export enum HTTPMethod {
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
}

export type User = SpotifyApi.CurrentUsersProfileResponse;

export interface SessionInfo {
  user: SpotifyApi.CurrentUsersProfileResponse;
  token: string;
  tokenExpires: number;
}
