import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DoctorPatientSymptoms.module.css";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const DoctorPatientSymptoms = () => {
  const [symptomsData, setSymptomsData] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSymptomsForDoctor = async () => {
      try {
        const doctorName = sessionStorage.getItem("nama_lengkap");

        const [symptomRes, appointmentRes] = await Promise.all([
          axios.get("/api/Symptom"),
          axios.get("/api/Appointment"),
        ]);

        const symptoms = symptomRes.data?.data || [];
        const appointments = appointmentRes.data?.data || [];

        const patientByDoctor = appointments
          .filter((appt) => appt.nama_dokter === doctorName)
          .map((appt) => appt.no_rekam_medis);

        const filtered = symptoms
          .filter((symptom) => patientByDoctor.includes(symptom.no_rekam_medis))
          .reduce((acc, curr) => {
            const existing = acc.find(
              (item) => item.no_rekam_medis === curr.no_rekam_medis
            );
            if (
              !existing ||
              new Date(curr.tanggal_gejala) > new Date(existing.tanggal_gejala)
            ) {
              const { nama_lengkap, no_rekam_medis, tanggal_gejala } = curr;
              acc = acc.filter((item) => item.no_rekam_medis !== curr.no_rekam_medis);
              acc.push({ nama_lengkap, no_rekam_medis, tanggal_gejala });
            }
            return acc;
          }, []);

        setSymptomsData(filtered);
        setFilteredSymptoms(filtered);
      } catch (error) {
        console.error("Gagal fetch gejala pasien:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptomsForDoctor();
  }, []);

 useEffect(() => {
  let data = [...symptomsData];

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    data = data.filter(
      (item) =>
        item.nama_lengkap.toLowerCase().includes(term) ||
        item.no_rekam_medis.toLowerCase().includes(term)
    );
  }

  if (filterDate) {
    data = data.filter((item) => item.tanggal_gejala === filterDate);
  }

  setFilteredSymptoms(data);
}, [searchTerm, filterDate, symptomsData]);


  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredSymptoms);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gejala Pasien");
    XLSX.writeFile(wb, "gejala_pasien_dokter.xlsx");
  };

  // const handleDetail = (noRekamMedis) => {
  //   navigate(`/doctor-patient-symptoms/${noRekamMedis}`);
  // };

  const handleDetail = (noRekamMedis) => {
  navigate(`/doctor-patient-symptom-detail/${noRekamMedis}`);
  };


    return (
    <div className={styles.container}>
        <h2 className={styles.header}>Daftar Gejala Pasien Anda</h2>

        <div className={styles.filterWrapper}>
        <div className={styles.searchRow}>
            <input
            type="text"
            placeholder="Cari nama atau no. rekam medis..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
            type="date"
            className={styles.searchInput}
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            />

            <div className={styles.buttonGroup}>
            <button
                className={styles.resetButton}
                onClick={() => {
                setSearchTerm("");
                setFilterDate("");
                }}
            >
                Reset
            </button>

            <button
                className={styles.exportButton}
                onClick={handleExport}
            >
                Export Excel
            </button>
            </div>
        </div>
        </div>


      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nama Pasien</th>
                <th>No. Rekam Medis</th>
                <th>Tanggal Terakhir Gejala</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSymptoms.length > 0 ? (
                filteredSymptoms.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nama_lengkap}</td>
                    <td>{item.no_rekam_medis}</td>
                    <td>{item.tanggal_gejala}</td>
                    <td>
                      <button
                        className={styles.viewDetailsButton}
                        onClick={() => handleDetail(item.no_rekam_medis)}
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Tidak ada data gejala untuk pasien Anda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>      
    </div>
  );
};

export default DoctorPatientSymptoms;
