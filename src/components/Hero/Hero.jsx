import React from "react";
import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";

export const Hero = () => {
    const scrollToFooter = () => {
        const footer = document.getElementById("contact");
        footer.scrollIntoView({ behavior: "smooth" });
    };

    return ( 
     <section className={styles.container}>
        <div className={styles.content}>
            <h1 className={styles.title}>Halo, Saya Nama</h1>
            <h2 className={styles.subtitle}>Kenalan dengan Nama</h2>
            <p className={styles.description}>
                Deskripsi mengenai maskot App. Bisa dituliskan
                di bagian ini dalam satu paragraf.
            </p>
            <button onClick={scrollToFooter} className={styles.contactBtn}>
                Hubungi Kami
            </button>
        </div>
        <img src={getImageUrl("hero/hero.svg")} 
        alt="Hero image of me"
        className={styles.heroImg}
        />
        <div className={styles.topBlur} />
        <div className={styles.bottomBlur} />
    </section>
    );
};
