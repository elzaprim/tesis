import React, { useEffect, useState } from "react";
import styles from "./MedicalRecord.module.css";
import { useNavigate } from "react-router-dom";

const API_PATIENT = "https://api.sahabatbmeitb.my.id/Patient";
const API_DIAGNOSTIC = "https://api.sahabatbmeitb.my.id/DiagnosticReport";
const API_CONDITION = "https://api.sahabatbmeitb.my.id/Condition";

const MedicalRecord = () => {
  const [loading, setLoading] = useState(true);
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [conditionData, setConditionData] = useState(null);

  const nik = sessionStorage.getItem("nik");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Ambil data pasien berdasarkan NIK
        const patientRes = await fetch(`${API_PATIENT}/${nik}`);
        const patientJson = await patientRes.json();

        // Jika data berupa array, ambil elemen pertama
        const patient = Array.isArray(patientJson.data)
          ? patientJson.data[0]
          : patientJson.data;

        if (patientRes.ok && patientJson.success && patient?.no_rekam_medis) {
          const noRekamMedis = patient.no_rekam_medis;

          // Step 2: Ambil data Diagnostic dan Condition berdasarkan no_rekam_medis
          const [diagRes, condRes] = await Promise.all([
            fetch(`${API_DIAGNOSTIC}/${noRekamMedis}`),
            fetch(`${API_CONDITION}/${noRekamMedis}`),
          ]);

          const [diagJson, condJson] = await Promise.all([
            diagRes.json(),
            condRes.json(),
          ]);

          if (diagRes.ok && diagJson.success) {
            setDiagnosticData(Array.isArray(diagJson.data) ? diagJson.data[0] : diagJson.data);
            }

        if (condRes.ok && condJson.success) {
            setConditionData(Array.isArray(condJson.data) ? condJson.data[0] : condJson.data);
            }

        } else {
          console.warn("Pasien tidak ditemukan untuk NIK:", nik);
        }
      } catch (error) {
        console.error("Gagal mengambil data rekam medis:", error);
      } finally {
        setLoading(false);
      }
    };

    if (nik) fetchData();
  }, [nik]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Memuat data rekam medis...</p>
      </div>
    );
  }

    return (
    <div className={styles.container}>
        <h1 className={styles.header}>📋Riwayat Medis</h1>

        <div className={styles.cardsGrid}>
        <div className={styles.card}>
            <h2>🩺 Diagnosis Pasien</h2>
            {conditionData ? (
            <>
                <p><strong>Nama Lengkap:</strong> {conditionData.nama_lengkap}</p>
                <p><strong>No Rekam Medis:</strong> {conditionData.no_rekam_medis}</p>
                <p><strong>Subgroup:</strong> {conditionData.subgroup}</p>
                <p><strong>Morfologi:</strong> {conditionData.morfologi}</p>
                <p><strong>Kode Morfologi:</strong> {conditionData.kode_morfologi}</p>
                <p><strong>Topografi:</strong> {conditionData.topografi}</p>
                <p><strong>Kode Topografi:</strong> {conditionData.kode_topografi}</p>
                <p><strong>Literalitas:</strong> {conditionData.literalitas}</p>
                <p><strong>Tanggal Pertama Konsultasi:</strong> {conditionData.tgl_pertama_konsultasi}</p>
            </>
            ) : (
            <p>Data diagnosis tidak ditemukan.</p>
            )}
        </div>
        </div>
    
    <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>
        
    </div>
    );
};

export default MedicalRecord;
