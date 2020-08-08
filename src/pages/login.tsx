import Head from 'next/head';
import styles from '../styles/LogIn.module.css';

export default function LogIn() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button className="pure-button">{'Sign in'}</button>
      </main>

      <footer className={styles.footer}>Open Source on GitHub</footer>
    </div>
  );
}
