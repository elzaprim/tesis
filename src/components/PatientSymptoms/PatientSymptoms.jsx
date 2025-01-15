import React, { useState } from "react";
import styles from "./PatientSymptoms.module.css";

const PatientSymptoms = () => {
  const symptomOptions = [
    "Fever",
    "Cough",
    "Shortness of Breath",
    "Headache",
    "Nausea",
    "Fatigue",
    "Loss of Appetite",
    "Sore Throat",
    "Chest Pain",
    "Dizziness",
  ];

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default ke tanggal hari ini
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSymptomChange = (event) => {
    const value = event.target.value;
    if (!selectedSymptoms.includes(value) && selectedSymptoms.length < 10) {
      setSelectedSymptoms((prev) => [...prev, value]);
    }
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms((prev) => prev.filter((item) => item !== symptom));
  };

  const handleSave = () => {
    if (selectedSymptoms.length > 0) {
      const newData = { date: selectedDate, symptoms: [...selectedSymptoms] };
      setSavedData((prev) => [...prev, newData]);
      setSelectedSymptoms([]); // Reset gejala setelah disimpan
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000); // Sembunyikan pesan sukses setelah 3 detik
    }
  };

  const handleBack = () => {
    window.history.back(); // Navigasi ke halaman sebelumnya
  };

  const handleLogout = () => {
    alert("Anda telah keluar."); // Logika untuk logout bisa diimplementasikan sesuai kebutuhan
    // Contoh: redirect ke halaman login
    // window.location.href = "/login";
  };

  return (
    <div className={styles.patientSymptoms}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Gejala Pasien</h1>
      </div>

      {/* Pilihan Tanggal */}
      <div className={styles.dateSection}>
        <label htmlFor="date-input" className={styles.dateLabel}>
          Pilih Tanggal:
        </label>
        <input
          type="date"
          id="date-input"
          className={styles.dateInput}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Dropdown Pilihan Gejala */}
      <div className={styles.dropdownSection}>
        <label htmlFor="symptom-dropdown" className={styles.dropdownLabel}>
          Gejala:
        </label>
        <select
          id="symptom-dropdown"
          className={styles.dropdownSelect}
          onChange={handleSymptomChange}
          value=""
        >
          <option value="" disabled>
            -- Pilih Gejala --
          </option>
          {symptomOptions.map((symptom, index) => (
            <option key={index} value={symptom}>
              {symptom}
            </option>
          ))}
        </select>
      </div>

      {/* Daftar Gejala yang Dipilih */}
      <div className={styles.selectedSymptoms}>
        <h3>Gejala yang dipilih:</h3>
        {selectedSymptoms.length > 0 ? (
          <ul className={styles.symptomList}>
            {selectedSymptoms.map((symptom, index) => (
              <li key={index} className={styles.symptomItem}>
                {symptom}{" "}
                <button
                  className={styles.removeButton}
                  onClick={() => removeSymptom(symptom)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Belum ada gejala yang dipilih.</p>
        )}
      </div>

      {/* Tombol Simpan */}
      <div className={styles.saveSection}>
        <button className={styles.saveButton} onClick={handleSave}>
          Simpan
        </button>
        {showSuccessMessage && (
          <p className={styles.successMessage}>Data berhasil disimpan!</p>
        )}
      </div>

      {/* Ringkasan Data */}
      <div className={styles.summarySection}>
        <h3>Ringkasan Gejala:</h3>
        {savedData.length > 0 ? (
          <ul className={styles.summaryList}>
            {savedData.map((entry, index) => (
              <li key={index} className={styles.summaryItem}>
                <strong>{entry.date}:</strong> {entry.symptoms.join(", ")}
              </li>
            ))}
          </ul>
        ) : (
          <p>Belum ada data.</p>
        )}
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

export default PatientSymptoms;
