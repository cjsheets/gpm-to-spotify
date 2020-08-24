# Google Play Music to Spotify

This is a lightweight client side web application for transferring playlists from Google Play Music to Spotify.

To use this app, you need to manually export your playlists using Google Takeout (they come in CSV format). Instructions are provided in the app.

## Running locally

You can use this app at [gpm-to-spotify.sheets.ch](https://gpm-to-spotify.sheets.ch) or you can run it locally.

- Create a new Spotify app at the [Spotify for Developers dashboard](https://developer.spotify.com/dashboard/applications)
  - Note the "Client ID" of your new app
  - Edit Settings and add a redirect URI: `http://localhost:3000/redirect`
- Create a `.env.local` file in the projects root directory
  - Add this line: `NEXT_PUBLIC_CLIENT_ID=[ YOUR_CLIENT_ID ]`
- Install and run the application.
  - `yarn` then `yarn dev`
- View the running application at [http://localhost:3000](http://localhost:3000)

## Project objectives

I built this app partially to migrate my playlists and partially to gain experience with certain frameworks and techniques. Goals for this codebase included:

- Build with [next.js](https://nextjs.org/)
- Use only hooks for state management
- Use only functions for all components and utilities

## Author and License

Chad Sheets - [GitHub](https://github.com/cjsheets) | [Blog](http://sheets.ch/) | [Email](mailto:chad@sheets.ch)

Released under the [MIT License](https://tldrlegal.com/license/mit-license)
