import React from 'react';
import styles from '../styles/components-footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a href="https://github.com/cjsheets/gpm-to-spotify" target="_blank" rel="noopener">
        <img src="/octocat.svg" alt="GitHub logo" /> GitHub
      </a>
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms of use</a>
    </footer>
  );
}
