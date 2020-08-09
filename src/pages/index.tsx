import React, { useContext } from 'react';
import styles from '../styles/LogIn.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';
import { userStore } from '../stores/user-store';

export default function Index() {
  const userContext = useContext(userStore);
  const { store } = userContext;

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          {store.user ? `Welcome ${store.user.display_name}` : 'Click Sign In'}
        </main>
      </div>
      <Footer />
    </>
  );
}
