import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./DetailSymptoms.module.css";
import axios from "axios";
import * as XLSX from "xlsx"; 

const DetailSymptoms = () => {
  const { noRekamMedis } = useParams();
  const [gejalaPasien, setGejalaPasien] = useState([]);
  const [namaPasien, setNamaPasien] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await axios.get("/api/Symptom");
        const allSymptoms = response.data?.data || [];

        const filtered = allSymptoms.filter(
          (item) => item.no_rekam_medis === noRekamMedis
        );

        if (filtered.length > 0) {
          setNamaPasien(filtered[0].nama_lengkap);
        }

        const sorted = filtered.sort(
          (a, b) => new Date(b.tanggal_gejala) - new Date(a.tanggal_gejala)
        );

        setGejalaPasien(sorted);
      } catch (error) {
        console.error("Gagal mengambil data gejala pasien:", error);
      }
    };

    fetchSymptoms();
  }, [noRekamMedis]);

  // Fungsi Export ke Excel
  const handleExport = () => {
    const dataToExport = gejalaPasien.map((item) => ({
      "Tanggal Gejala": item.tanggal_gejala,
      "Gejala": item.gejala,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gejala Pasien");
    XLSX.writeFile(wb, `riwayat_gejala_${noRekamMedis}.xlsx`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Riwayat Gejala Pasien</h1>
        <p><strong>Nama:</strong> {namaPasien}</p>
        <p><strong>No Rekam Medis:</strong> {noRekamMedis}</p>
      </div>

      {/* Tombol Export */}
      <div style={{ marginBottom: "16px" }}>
        <button className={styles.exportButton} onClick={handleExport}>
          Export ke Excel
        </button>
      </div>

      <div className={styles.tableWrapper}>
        {gejalaPasien.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Gejala</th>
              </tr>
            </thead>
            <tbody>
              {gejalaPasien.map((item, index) => (
                <tr key={index}>
                  <td>{item.tanggal_gejala}</td>
                  <td>{item.gejala}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Tidak ada data gejala untuk pasien ini.</p>
        )}
      </div>

      <div className={styles.backButtonWrapper}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>
      </div>
    </div>
  );
};

export default DetailSymptoms;
