import React from 'react';
import styles from './Appdown.module.css';

export const Appdown = () => {
  return (
    <section className={styles.container} id="appdown">
      <h2 className={styles.title}>Download Aplikasi</h2>
      <p className={styles.subtitle}>
        Unduh aplikasi kami di App Store atau Google Play untuk pengalaman terbaik!
      </p>
      <div className={styles.buttonContainer}>
        <a 
          href="https://apps.apple.com" 
          className={`${styles.button} ${styles.apple}`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="/assets/icon/app-store.svg" 
            alt="Download on App Store" 
            className={styles.icon}
          />
        </a>
        <a 
          href="https://play.google.com/store" 
          className={`${styles.button} ${styles.google}`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="/assets/icon/google-playstore.svg" 
            alt="Download on Google Play" 
            className={styles.icon}
          />
        </a>
      </div>
    </section>
  );
};
