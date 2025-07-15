import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GuardianEducation.module.css";

const GuardianEducation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "FAQ & Edukasi - Guardian";
  }, []);

  return (
    <div className={styles.container}>
      <h1>FAQ dan Edukasi</h1>

      <div className={styles.imageContainer}>
        <img
          src="/assets/common/admin-education.svg"
          alt="Ilustrasi Edukasi Pasien"
          className={styles.image}
        />
      </div>

      <div className={styles.menuContainer}>
        <button
          className={styles.menuButton}
          onClick={() => navigate("/education/content")}
        >
          Lihat Konten Edukasi
        </button>

        <button
          className={styles.menuButton}
          onClick={() => navigate("/education/faq")}
        >
           Frequently Asked Questions (FAQ)
        </button>
      </div>
      <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>
      
    </div>
  );
};

export default GuardianEducation;
