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
            This site uses <a href="https://matomo.org//">Matomo</a> to help me understand how
            visitors are using the site and which pages are most popular.
          </p>
          <p>
            All information collected is <strong>anonymized</strong> with PII removed unless you
            explicitly submit it to the website.
          </p>
          <h2>What type of information is recorded?</h2>
          <p>
            Matomo stores session information, but not personally identifying information. Examples
            of session information include:
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
            The information collected by Matomo is sent straight to a self hosted logging servers
            and is only accessible to me through reports. Matomo manages the technical details
            relating to the gathering and storing of all analytics information.
          </p>
          <h2>What do I do with your data?</h2>
          <p>
            Analytics allows me to better understand what content is most popular and how users
            navigate the site. This helps me make better future design and writing decisions.
          </p>
          <p>All of my activity falls within the bounds of the Matomo Terms of Service.</p>
          <h2>More information</h2>
          <p>
            You can find additional information about Matomo, including their commitment to privacy
            protection <a href="https://matomo.org/">here</a>
          </p>
          <h2>Can I opt out of tracking?</h2>
          <p>
            Matomo respects browsers built-in{' '}
            <a href="https://www.eff.org/issues/do-not-track">Do Not Track</a> setting. You can also
            opt out of tracking below:
          </p>
          <iframe
            style={{ border: 0, height: 160, width: '100%' }}
            src="https://log.sheets.ch/index.php?module=CoreAdminHome&action=optOut&language=en&backgroundColor=&fontColor=&fontSize=&fontFamily="
          ></iframe>
          <ContactMe />
        </main>
      </div>
      <Footer />
    </>
  );
}
