import React from 'react';
import styles from '../styles/pages-index.module.scss';
import Footer from '../components/footer';
import { ListeningImage } from '../components/images/listening-image';
import { GradientWave } from '../components/images/gradient-wave';
import { Button, Spacer } from '@zeit-ui/react';
import { Activity } from '@zeit-ui/react-icons';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();

  return (
    <>
      <GradientWave />
      <div className={styles.container}>
        <main className={styles.hero}>
          <div>
            <h1>Transfer Google Play Music to Spotify</h1>
            <h2>Open source, 100% free</h2>
            <Spacer y={2} />
            <Button
              auto
              ghost
              shadow
              icon={<Activity />}
              size="large"
              style={{ marginLeft: '1rem' }}
              onClick={() => router.replace('/get-started', undefined, { shallow: true })}
            >
              Get started
            </Button>
          </div>
          <div>
            <ListeningImage />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
