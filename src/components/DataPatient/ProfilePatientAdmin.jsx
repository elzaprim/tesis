import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./ProfilePatientAdmin.module.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { useNavigate } from "react-router-dom";


const API_BASE_URL = "/api";

const ProfilePatientAdmin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [files, setFiles] = useState({});
  const [view, setView] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [subgroups, setSubgroups] = useState({});
  const [stagings, setStagings] = useState({});
  const [updateDate, setUpdateDate] = useState(new Date().toISOString().split("T")[0]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const [conditionRes, reportRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/Condition`),
          axios.get(`${API_BASE_URL}/DiagnosticReport`)
        ]);

        if (Array.isArray(conditionRes.data.data)) {
          const conditionMap = {};
          conditionRes.data.data.forEach(item => {
            conditionMap[item.no_rekam_medis] = item.subgroup || "-";
          });
          setSubgroups(conditionMap);
        }

        if (Array.isArray(reportRes.data.data)) {
          const stagingMap = {};
          reportRes.data.data.forEach(item => {
            stagingMap[item.no_rekam_medis] = item.staging_stadium || "-";
          });
          setStagings(stagingMap);
        }
      } catch (err) {
        console.error("Gagal fetch condition/staging:", err);
      }
    };

    if (view === "lihatData") {
      fetchAdditionalData();
    }
  }, [view]);

  useEffect(() => {
    if (view === "lihatData") {
      const getProfileData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${API_BASE_URL}/Patient`);
          if (response.data.success && Array.isArray(response.data.data)) {
            setData(response.data.data);
          } else {
            setError("Data tidak ditemukan atau format tidak sesuai.");
          }
        } catch (error) {
          setError("Gagal mengambil data pasien. Coba lagi nanti.");
        } finally {
          setLoading(false);
        }
      };
      getProfileData();
    }
  }, [view]);

  useEffect(() => {
    setCurrentPage(1);
  }, [data, searchTerm]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        item.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.no_rekam_medis?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm]);

  const handleExportExcel = () => {
    const exportData = filteredData.map(item => ({
      ID: item.id,
      Nama: item.nama_lengkap,
      "No Rekam Medis": item.no_rekam_medis,
      Subgroup: subgroups[item.no_rekam_medis] || "-",
      "Staging Stadium": stagings[item.no_rekam_medis] || "-",
      "Tanggal Lahir": item.tanggal_lahir,
      Alamat: `${item.alamat}, ${item.kecamatan}, ${item.kabupaten}, ${item.propinsi}`,
      "No BPJS": item.no_bpjs
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DataPasien");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "DataPasien.xlsx");
  };

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileChange = (event, key) => {
    const file = event.target.files[0];
    if (!file) return;
    const validExtensions = ["xls", "xlsx"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setUploadStatus((prev) => ({ ...prev, [key]: "Format file tidak valid." }));
      return;
    }
    setFiles((prev) => ({ ...prev, [key]: file }));
    setUploadStatus((prev) => ({ ...prev, [key]: null }));
  };

  const handleFileUpload = async (key, endpoint) => {
    if (!files[key]) {
      setUploadStatus((prev) => ({ ...prev, [key]: "Silakan pilih file terlebih dahulu." }));
      return;
    }

    const formData = new FormData();
    formData.append("file", files[key]);

    try {
      await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadStatus((prev) => ({ ...prev, [key]: "Upload berhasil!" }));
      setFiles((prev) => ({ ...prev, [key]: null }));

      setTimeout(() => {
        setUploadStatus((prev) => ({ ...prev, [key]: null }));
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Upload gagal. Cek kembali isi file.";
      setUploadStatus((prev) => ({ ...prev, [key]: message }));
    }
  };



  if (!view) {
    return (
      <div className={styles.container}>
        <h1>Manajemen Data Pasien</h1>
        <button onClick={() => setView("importExcel")} className={styles.button}>Import Data Excel</button>
        <button onClick={() => setView("lihatData")} className={styles.button}>Lihat Data Pasien</button>
        {/* <button onClick={() => setView("lihatAbandon")} className={styles.button}>Lihat Data Abandon Pasien</button> */}
          <Link to="/abandon" className={styles.button}>
            Lihat Data Abandon Pasien
          </Link>

                {/* Tambahkan tombol kembali di sini */}
          <button onClick={() => navigate(-1)} className={styles.backButton} style={{ marginTop: "20px" }}>
            ← Kembali
          </button>
      </div>
    );
  }

  if (view === "lihatAbandon") {
    return (
      <div className={styles.container}>
        <AbandonPage />
        <button className={styles.backButton} onClick={() => setView(null)}>← Kembali</button>
      </div>
    );
  }

  if (view === "importExcel") {
    return (
      <div className={styles.container}>
        <h1>Import Data Excel</h1>
        {Object.keys(uploadStatus).map((key) => (
          uploadStatus[key] && <p key={key} className={styles.uploadMessage}>{uploadStatus[key]}</p>
        ))}
        {[
          { key: "diagnosis", label: "Diagnosis", endpoint: "/import/Condition" },
          { key: "profile", label: "Profile", endpoint: "/import/Patient" },
          { key: "histori", label: "Histori", endpoint: "/import/DiagnosticReport" },
          { key: "rujukan", label: "Rujukan", endpoint: "/import/Referral" },
          { key: "rekmed", label: "Rekam Medis", endpoint: "/import/Observation" },
        ].map(({ key, label, endpoint }) => (
          <div key={key} className={styles.uploadSection}>
            <label>{label}: <input type="file" onChange={(e) => handleFileChange(e, key)} /></label>
            <button onClick={() => handleFileUpload(key, endpoint)} className={styles.uploadButton}>Kirim</button>
          </div>
        ))}
        
        <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>
        
        {/* <button onClick={() => setView(null)} className={styles.button}>Kembali</button> */}
      </div>
    );
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1>Data Pasien</h1>
      
        <div className={styles.rowFilterContainer}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Cari nama atau no rekam medis..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={() => setSearchTerm("")} className={styles.resetButton}>Reset</button>
            <button onClick={handleExportExcel} className={styles.exportButton}>Export ke Excel</button>
          </div>
        </div>

        <div className={styles.rowFilterContainer}>
          <div className={styles.inputGroup}>
            <label htmlFor="update-date"><strong>Tanggal Update:</strong></label>
            <input
              id="update-date"
              type="date"
              value={updateDate}
              onChange={(e) => setUpdateDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>


      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Lengkap</th>
              <th>No Rekam Medis</th>
              <th>Subgroup</th>
              <th>Staging Stadium</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr>
                    <td>{item.id}</td>
                    <td>{item.nama_lengkap}</td>
                    <td>{item.no_rekam_medis || "-"}</td>
                    <td>{subgroups[item.no_rekam_medis] || "-"}</td>
                    <td>{stagings[item.no_rekam_medis] || "-"}</td>
                    <td>
                      <button className={styles.viewDetailsButton} onClick={() => toggleRow(item.id)}>
                        {expandedRows[item.id] ? "Tutup" : "Detail"}
                      </button>
                    </td>
                  </tr>
                  {expandedRows[item.id] && (
                    <tr>
                      <td colSpan="6" className={styles.expandedRow}>
                        <p><strong>Tempat Lahir:</strong> {item.tempat_lahir}</p>
                        <p><strong>Tanggal Lahir:</strong> {item.tanggal_lahir}</p>
                        <p><strong>Jenis Kelamin:</strong> {item.jenis_kelamin}</p>
                        <p><strong>Alamat:</strong> {item.alamat}, {item.kecamatan}, {item.kabupaten}, {item.propinsi}</p>
                        <p><strong>No BPJS:</strong> {item.no_bpjs}</p>
                        <Link to={`/patient-detail/${item.no_rekam_medis}`} className={styles.link}>
                          <button className={styles.historyButton}>Diagnosa dan Histori Data Pasien</button>
                        </Link>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6">Tidak ada data pasien.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.paginationWrapper}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            Sebelumnya
          </button>
          <span className={styles.pageInfo}>
            Halaman {currentPage} dari {Math.ceil(filteredData.length / itemsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(filteredData.length / itemsPerPage) ? prev + 1 : prev
              )
            }
            disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
            className={styles.pageButton}
          >
            Selanjutnya
          </button>
        </div>
      </div>
      
    <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>

    </div>
  );
};

export default ProfilePatientAdmin;
