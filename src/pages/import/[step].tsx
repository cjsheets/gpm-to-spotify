import React, { useContext } from 'react';
import styles from '../../styles/LogIn.module.scss';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { userStore } from '../../stores/user-store';

export default function ImportPlaylist() {
  const userContext = useContext(userStore);
  const { store } = userContext;

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>{'start importing'}</main>
      </div>
      <Footer />
    </>
  );
}
