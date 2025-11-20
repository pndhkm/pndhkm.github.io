import type {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--dark', styles.heroBanner)}>
      <div className="container">

        {/* Avatar */}
        <img
          src="/img/my-1x1.jpg"
          alt="Avatar"
          className={styles.avatar}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "1rem",
          }}
        />

        <Heading as="h3" className="hero__title">
          Pandu Hakam
        </Heading>
        <p className="hero__subtitle">Experienced Network & System Administrator, <br></br>skilled in various Linux distributions, automation, and IT infrastructure.</p>

        <div className={styles.iconButtons}>
          <a
            className={styles.iconLink}
            href="https://www.linkedin.com/in/pandu-hakam/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={28} />
          </a>

          <a
            className={styles.iconLink}
            href="mailto:panduhakam25@gmail.com"
          >
            <FaEnvelope size={28} />
          </a>

          <a
            className={styles.iconLink}
            href="https://github.com/pndhkm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={28} />
          </a>
        </div>
      </div>
    </header>
  );
}


export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
