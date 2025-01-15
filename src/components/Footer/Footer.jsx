import React from "react";
import styles from "./Footer.module.css";

export const Footer = () => {
    return (
        <footer className={styles.footer} id="contact">
            <div className={styles.container}>
                <h3 className={styles.title}>Hubungi Kami</h3>
                <ul className={styles.contactList}>
                    <li>
                        Email: 
                        <a href="mailto:myemail@email.com"> myemail@email.com</a>
                    </li>
                    <li>
                        <a href="https://instagram.com/myprofile" target="_blank" rel="noopener noreferrer">
                            <img 
                                src="/assets/icon/ig.svg" 
                                alt="Instagram" 
                                className={styles.icon} 
                            />
                            @myprofile
                        </a>
                    </li>
                    <li>
                        <a href="https://facebook.com/myprofile" target="_blank" rel="noopener noreferrer">
                            <img 
                                src="/assets/icon/fb.svg" 
                                alt="Facebook" 
                                className={styles.icon} 
                            />
                            My Facebook
                        </a>
                    </li>
                    <li>
                        Alamat: Jl. Contoh No. 123, Bandung, Indonesia
                    </li>
                </ul>
            </div>
        </footer>
    );
};
