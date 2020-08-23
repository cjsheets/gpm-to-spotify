import React from 'react';
import styles from '../styles/components-footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a href="https://github.com/cjsheets/gpm-to-spotify" target="_blank">
        <img src="/octocat.svg" /> GitHub
      </a>
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms of use</a>
    </footer>
  );
}
