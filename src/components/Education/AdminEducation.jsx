import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminEducation.module.css";

const AdminEducation = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Konten Edukasi</h1>
      
      {/* Menambahkan gambar di tengah */}
      <div className={styles.imageContainer}>
        <img
          src="/assets/common/admin-education.svg" // Gambar relatif dari folder public
          alt="Admin Education"
          className={styles.image}
        />
      </div>

      <div className={styles.menuContainer}>
        <button
          className={styles.viewAndEditButton} 
          onClick={() => navigate("/admin-education/view-and-edit")}
        >
          Lihat dan Edit Konten
        </button>
        <button
          className={styles.addContentButton} 
          onClick={() => navigate("/admin-education/add-content")}
        >
          Tambah Konten Baru
        </button>
      </div>

      {/* Tombol di bawah */}
      <div className={styles.footerButtons}>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          Kembali
        </button>
        <button className={styles.logoutButton}>Keluar</button>
      </div>      

    </div>
  );
};

export default AdminEducation;
