import React from 'react';
import { getImageUrl } from '../../utils';
import styles from "./About.module.css";

export const About = () => {
    return (
        <section className={styles.container} id="about">
            <h2 className={styles.title}>Tentang Aplikasi</h2>
            <div className={styles.content}>
                <img
                    src={getImageUrl("common/vision.svg")}
                    alt="Ilustrasi keluarga dan dokter"
                    className={styles.aboutImage}
                />
                <ul className={styles.aboutItems}>
                    {/* Tentang Aplikasi */}
                    <li className={styles.aboutItem} key="intro">
                        <div className={styles.aboutItemText}>
                            <h3>Kenalan dengan App</h3>
                            <p>
                                Deskripsi mengenai kegunaan App. Bisa dituliskan di bagian ini 
                                dalam satu paragraf.
                            </p>
                        </div>
                    </li>
                    
                    {/* Visi Kami */}
                    <li className={styles.aboutItem} key="vision">
                        <div className={styles.aboutItemText}>
                            <h3>Visi Kami</h3>
                            <p>
                                Deskripsi mengenai Visi dari pembuatan App. Bisa dituliskan di 
                                bagian ini dalam satu paragraf.
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </section>                  
    );
};
