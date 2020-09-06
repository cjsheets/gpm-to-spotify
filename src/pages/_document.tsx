import Document, { Html, Head, Main, NextScript } from 'next/document';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    crossorigin?: string;
  }
}

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="Transfer playlists from Google Play Music to Spotify, 100% free and open source"
          ></meta>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                var _paq = window._paq = window._paq || [];
                _paq.push(['trackPageView']);
                _paq.push(['enableLinkTracking']);
                (function() {
                  var u="https://log.sheets.ch/";
                  _paq.push(['setTrackerUrl', u+'matomo.php']);
                  _paq.push(['setSiteId', '${process.env.NEXT_PUBLIC_SITE_ID}']);
                  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                  g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
                })();
          `,
            }}
          />
          <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
