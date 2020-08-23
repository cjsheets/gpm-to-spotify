import { ChevronLeft } from '@zeit-ui/react-icons';
import React from 'react';
import ContactMe from '../components/contact-me';
import Footer from '../components/footer';
import { GradientWave } from '../components/images/gradient-wave';
import styles from '../styles/pages-index.module.scss';

export default function Privacy() {
  return (
    <>
      <GradientWave />
      <div className={styles.container}>
        <main className={styles.policy}>
          <a href="/" style={{ display: 'flex' }}>
            <ChevronLeft /> Go back
          </a>
          <h1>Privacy Policy</h1>
          <p>
            This site, like millions of others, uses{' '}
            <a href="http://analytics.google.com/">Google Analytics</a>. Google helps developers
            understand how visitors use their site and which pages are most popular.
          </p>
          <p>
            Google Analytics utilizes “cookies” (small text files stored in your browsers cache)
            which contain <strong>anonymized</strong> information. This means no personally
            identifiable information is stored unless you explicitly submit it to the website.
          </p>
          <h2>What type of information is recorded?</h2>
          <p>
            Google Analytics stores session information, but not personally identifying information.
            Examples of session information include:
          </p>
          <ul>
            <li>Referring website</li>
            <li>Length of visit</li>
            <li>Pages visited</li>
            <li>Type of web browser used</li>
            <li>…and quite a bit more along these lines</li>
          </ul>
          <h2>Do you store information about my visit?</h2>
          <p>
            The information collected by Google Analytics is sent straight to Google servers and is
            only accessible to me through reports. Google manages the technical details relating to
            the gathering and storing of all analytics information.
          </p>
          <h2>What do I do with your data?</h2>
          <p>
            Analytics allows me to better understand what content is most popular and how users
            navigate the site. This helps me make better future design and writing decisions.
          </p>
          <p>
            All of my activity falls within the bounds of the Google Analytics Terms of Service.
          </p>
          <h2>More information</h2>
          <p>
            You can find additional information about Google Analytics{' '}
            <a href="https://en.wikipedia.org/wiki/Google_Analytics#Privacy">here</a>
          </p>
          <h2>Can I opt out of tracking?</h2>
          <p>
            Google gives you the option of{' '}
            <a href="http://www.google.com/privacy_ads.html">opting-out</a> of Google’s advertising
            tracking cookies. You can also use a{' '}
            <a href="https://tools.google.com/dlpage/gaoptout?hl=en">browser plugin</a> to opt out
            of Google Analytics completely.
          </p>
          <ContactMe />
        </main>
      </div>
      <Footer />
    </>
  );
}
