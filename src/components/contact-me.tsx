import React from 'react';
import { Divider } from '@zeit-ui/react';

export default function ContactMe() {
  return (
    <>
      <Divider />
      <h3>Contact</h3>
      <p>
        Problems with the website should be submitted as{' '}
        <a href="https://github.com/cjsheets/gpm-to-spotify/issues">issues on GitHub</a>. Feel free
        to reach out to chad@sheets.ch with other concerns.
      </p>
    </>
  );
}
