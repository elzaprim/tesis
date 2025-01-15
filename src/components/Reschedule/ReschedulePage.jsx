import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useLocation to access passed data
import styles from "./ReschedulePage.module.css";

const ReschedulePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { appointment } = location.state || {}; // Get the appointment data or fallback empty object
  const [newDate, setNewDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(""); // State untuk validasi error

  // Fungsi validasi input
  const validateForm = () => {
    if (!newDate) return "Tanggal baru harus dipilih.";
    if (!notes.trim()) return "Catatan tidak boleh kosong.";
    return ""; // Tidak ada error
  };

  const handleSubmit = () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage); // Set error jika form tidak valid
      return;
    }

    const confirmSubmit = window.confirm(
      `Apakah Anda yakin ingin mengajukan reschedule untuk ${appointment?.name}?`
    );

    if (confirmSubmit) {
      // Simpan notifikasi ke localStorage
      const newNotification = {
        id: Date.now(),
        message: `Permintaan reschedule untuk ${appointment?.name || "Pasien Tidak Diketahui"} 
          dari tanggal ${appointment?.date || "Tidak Diketahui"} ke ${newDate}. Catatan: ${notes}`,
      };

      const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
      storedNotifications.push(newNotification);
      localStorage.setItem("notifications", JSON.stringify(storedNotifications));

      console.log("Reschedule submitted", { appointment, newDate, notes });
      alert(`Permintaan reschedule untuk ${appointment?.name} telah diajukan.`);
      navigate("/doctor-appointments"); // Redirect setelah pengajuan berhasil
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Reschedule Janji Temu</h1>
      </header>

      <section className={styles.formSection}>
        <h2>Nama Pasien: {appointment?.name || "Tidak Diketahui"}</h2>

        <label>Janji Temu yang Baru</label>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className={styles.datePicker}
        />

        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Pilih jadwal reschedule atau beri keterangan lainnya"
          className={styles.textarea}
        />

        {error && <p className={styles.errorMessage}>{error}</p>} {/* Menampilkan error */}

        <button onClick={handleSubmit} className={styles.submitButton}>
          Ajukan ke Admin
        </button>
      </section>

      <div className={styles.footerButtons}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          Kembali
        </button>
        <button className={styles.logoutButton}>Keluar</button>
      </div>
    </div>
  );
};

export default ReschedulePage;
