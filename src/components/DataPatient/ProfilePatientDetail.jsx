import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ProfilePatientDetail.module.css";

const API_BASE_URL = "https://api.sahabatbmeitb.my.id/";

const ProfilePatientDetail = () => {
  const { no_rekam_medis } = useParams(); // Ambil no_rekam_medis dari URL
  const [patientHistory, setPatientHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk diagnosis pasien
  const [diagnosis, setDiagnosis] = useState(null);
  const [diagnosisLoading, setDiagnosisLoading] = useState(true);
  const [diagnosisError, setDiagnosisError] = useState(null);

  // Fetch histori pasien
  useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}DiagnosticReport/${no_rekam_medis}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        });
        if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setPatientHistory(response.data.data[0]); // Ambil data pertama
        } else {
          setError("Histori pasien tidak ditemukan.");
        }
      } catch (err) {
        console.error("Error fetching patient history:", err);
        setError("Gagal mengambil data histori pasien.");
      } finally {
        setLoading(false);
      }
    };

    if (no_rekam_medis) {
      fetchPatientHistory();
    }
  }, [no_rekam_medis]);

  // Fetch diagnosis pasien
  useEffect(() => {
    const fetchDiagnosis = async () => {
      setDiagnosisLoading(true);
      setDiagnosisError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}Condition/${no_rekam_medis}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        });
        if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setDiagnosis(response.data.data);
        } else {
          setDiagnosisError("Data diagnosis tidak ditemukan.");
        }
      } catch (err) {
        console.error("Error fetching diagnosis:", err);
        setDiagnosisError("Gagal mengambil data diagnosis.");
      } finally {
        setDiagnosisLoading(false);
      }
    };

    if (no_rekam_medis) {
      fetchDiagnosis();
    }
  }, [no_rekam_medis]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Detail Histori Pasien</h2>
      </header>

      {patientHistory ? (
        <div className={styles.patientDetail}>
          <p><strong>Nama:</strong> {patientHistory.nama_lengkap}</p>
          <p><strong>No Registrasi:</strong> {patientHistory.no_registrasi}</p>
          <p><strong>No Rekam Medis:</strong> {patientHistory.no_rekam_medis}</p>
          <p><strong>Dasar Diagnosis:</strong> {patientHistory.dasar_diagnosis}</p>
          <p><strong>Berat Badan Lahir:</strong> {patientHistory.bb_lahir}</p>
          <p><strong>Imunisasi:</strong> {patientHistory.imunisasi || "Tidak ada informasi"}</p>
          <p><strong>ASI Eksklusif:</strong> {patientHistory.asi_eksklusif}</p>
          <p><strong>Riwayat Keganasan Keluarga:</strong> {patientHistory.riwayat_keganasan_keluarga}</p>
          <p><strong>Ket. Keganasan Keluarga:</strong> {patientHistory.ket_keganasan_keluarga}</p>
          <p><strong>Tata Laksana:</strong> {patientHistory.tata_laksana}</p>
          <p><strong>Staging Stadium:</strong> {patientHistory.staging_stadium}</p>
          <p><strong>Tanggal Keluhan Pertama:</strong> {patientHistory.tgl_keluhan_pertama}</p>
          <p><strong>Tanggal Diagnosis:</strong> {patientHistory.tgl_diagnosis}</p>
          <p><strong>Tanggal Pertama Terapi:</strong> {patientHistory.tgl_pertama_terapi}</p>
          <p><strong>Status Validasi:</strong> {patientHistory.status_validasi}</p>
          <p><strong>Nama Unit:</strong> {patientHistory.nama_unit}</p>
        </div>
      ) : (
        <p>Histori tidak ditemukan.</p>
      )}

      <section className={styles.diagnosisSection}>
        <h2>Diagnosis Pasien</h2>
        {diagnosisLoading ? (
          <div className={styles.loading}>Loading diagnosis...</div>
        ) : diagnosisError ? (
          <div className={styles.error}>{diagnosisError}</div>
        ) : diagnosis ? (
          diagnosis.map((item) => (
            <div key={item.id} className={styles.diagnosisItem}>
              <p><strong>Subgroup:</strong> {item.subgroup} ({item.kode_subgroup})</p>
              <p><strong>Morfologi:</strong> {item.morfologi} ({item.kode_morfologi})</p>
              <p><strong>Topografi:</strong> {item.topografi} ({item.kode_topografi})</p>
              <p><strong>Literalitas:</strong> {item.literalitas}</p>
              <p><strong>Tanggal Konsultasi:</strong> {item.tgl_pertama_konsultasi}</p>
            </div>
          ))
        ) : (
          <p>Tidak ada data diagnosis.</p>
        )}
      </section>

      <button className={styles.backButton} onClick={() => window.history.back()}>
        Kembali ke Tabel
      </button>
    </div>
  );
};

export default ProfilePatientDetail;
