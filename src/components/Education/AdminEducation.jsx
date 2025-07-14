import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminEducation.module.css";

const AdminEducation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Konten Edukasi - Admin";
  }, []);

  return (
    <div className={styles.container}>
      <h1>Konten Edukasi</h1>

      <div className={styles.imageContainer}>
        <img
          src="/assets/common/admin-education.svg"
          alt="Ilustrasi Edukasi Admin"
          className={styles.image}
        />
      </div>

      <div className={styles.menuContainer}>
        <button
          className={styles.menuButton}
          onClick={() => navigate("/admin-education/content-list")}
        >
          Lihat dan Edit Konten
        </button>

        <button
          className={styles.menuButton}
          onClick={() => navigate("/admin-education/add-content")}
        >
          Tambah Konten Baru
        </button>
      </div>
    </div>
  );
};

export default AdminEducation;
