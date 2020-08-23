import { ChevronLeft } from '@zeit-ui/react-icons';
import React from 'react';
import ContactMe from '../components/contact-me';
import Footer from '../components/footer';
import { GradientWave } from '../components/images/gradient-wave';
import styles from '../styles/pages-index.module.scss';

export default function Terms() {
  return (
    <>
      <GradientWave />
      <div className={styles.container}>
        <main className={styles.policy}>
          <a href="/" style={{ display: 'flex' }}>
            <ChevronLeft /> Go back
          </a>
          <h1>Terms of use</h1>
          <p>Use of this site means you accept its terms.</p>
          <h2>Terms and Conditions</h2>
          <p>
            This web site provides material I find useful. With that said, you are 100% responsible
            for what you do (or don’t do) with it. Please use ALL code, commands, configurations and
            information with care. I will not be responsible for damages of any kind resulting from
            the use of anything found on this site. Use is your OWN sole responsibility.
          </p>
          <p>
            The code posted to this site and information compiled (as well as links to complimentary
            material) is provided “as is” with no warranty, express or implied.
          </p>
          <h2>Trademarks and Copyrights</h2>
          <p>
            All marks and names used on this site are the property of their respective owners and
            are used without permission but within fair use for educational or critical purposes.
          </p>
          <p>All images are copyrighted by their respective owner.</p>
          <p>
            I make every effort to respect the copyrights of outside parties. If you believe your
            copyright has been misused please contact me with a detailed message so we can determine
            an appropriate course of action.
          </p>
          <p>
            Except as otherwise noted, the content of this site is licensed under the Creative
            Commons Attribution 3.0 License and code samples are licensed under the MIT License.
          </p>
          <h2>No Affiliation</h2>
          <p>
            I am not affiliated with the projects or companies referenced on this site and all views
            expressed are my own.
          </p>
          <ContactMe />
        </main>
      </div>
      <Footer />
    </>
  );
}
