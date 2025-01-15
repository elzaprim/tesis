import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GuardianEducation.module.css";

const GuardianEducation = () => {
  const [content, setContent] = useState([
    { id: 1, title: "Judul Konten Edukasi 1", description: "Deskripsi singkat konten" },
    { id: 2, title: "Judul Konten Edukasi 2", description: "Deskripsi singkat konten" },
    { id: 3, title: "Judul Konten Edukasi 3", description: "Deskripsi singkat konten" },
  ]);
  const [isConfirmDelete, setIsConfirmDelete] = useState(null); // Menyimpan ID konten yang akan dihapus
  const [deleteId, setDeleteId] = useState(null); // ID konten yang dipilih untuk dihapus
  const navigate = useNavigate();

  const handleEdit = (id) => {
    // Fungsi untuk mengedit konten (misalnya, navigasi ke halaman edit)
    console.log("Edit content with id:", id);
    navigate(`/edit-content/${id}`);
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setIsConfirmDelete(true); // Menampilkan pesan konfirmasi
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      const updatedContent = content.filter(item => item.id !== deleteId);
      setContent(updatedContent);
      console.log("Deleted content with id:", deleteId);
    }
    setIsConfirmDelete(false); // Menutup konfirmasi
    setDeleteId(null); // Reset ID setelah penghapusan
  };

  const handleCancelDelete = () => {
    setIsConfirmDelete(false); // Menutup konfirmasi tanpa menghapus
    setDeleteId(null); // Reset ID tanpa penghapusan
  };

  return (
    <div className={styles.container}>
      <h1>Konten Edukasi</h1>
      <div className={styles.contentContainer}>
        {content.map((item) => (
          <div key={item.id} className={styles.contentItem}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className={styles.adminControls}>
              <button
                className={styles.editButton}
                onClick={() => handleEdit(item.id)}
              >
                Edit
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteConfirm(item.id)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Konfirmasi Hapus */}
      {isConfirmDelete && (
        <div className={styles.confirmationDialog}>
          <p>Apakah Anda yakin akan menghapus ini?</p>
          <button className={styles.confirmButton} onClick={handleDelete}>Ya</button>
          <button className={styles.cancelButton} onClick={handleCancelDelete}>Tidak</button>
        </div>
      )}

      {/* Tombol di bawah */}
      <div className={styles.footerButtons}>
        <button
          className={styles.backButton}
          onClick={() => window.history.back()}
        >
          Kembali
        </button>
        <button className={styles.logoutButton}>Keluar</button>
      </div>
    </div>
  );
};

export default GuardianEducation;
