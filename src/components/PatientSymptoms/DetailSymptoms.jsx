import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./DetailSymptoms.module.css";
import axios from "axios";
import * as XLSX from "xlsx";

const DetailSymptoms = () => {
  const { noRekamMedis } = useParams();
  const [gejalaPasien, setGejalaPasien] = useState([]);
  const [namaPasien, setNamaPasien] = useState("");
  const [editedNotes, setEditedNotes] = useState({});
  const [savingStatus, setSavingStatus] = useState({});
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

  const handleExport = () => {
    const dataToExport = gejalaPasien.map((item) => ({
      "Tanggal Gejala": item.tanggal_gejala,
      "Gejala": item.gejala,
      "Catatan Pasien": item.catatan_pasien || "-",
      "Catatan Dokter": item.catatan_dokter || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gejala Pasien");
    XLSX.writeFile(wb, `riwayat_gejala_${noRekamMedis}.xlsx`);
  };

  const handleNoteChange = (id, value) => {
    setEditedNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveNote = async (id) => {
    const note = editedNotes[id];
    if (note === undefined) return;

    try {
      await axios.put(`/api/Symptom/update/${id}`, {
        catatan_dokter: note,
      });

      setGejalaPasien((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, catatan_dokter: note } : item
        )
      );

      setSavingStatus((prev) => ({ ...prev, [id]: "saved" }));
      setEditedNotes((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.error("Gagal menyimpan catatan dokter:", error);
      setSavingStatus((prev) => ({ ...prev, [id]: "error" }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Riwayat Gejala Pasien</h1>
        <p><strong>Nama:</strong> {namaPasien}</p>
        <p><strong>No Rekam Medis:</strong> {noRekamMedis}</p>
      </div>

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
                <th>Catatan Pasien</th>
                <th>Catatan Dokter</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {gejalaPasien.map((item) => (
                <tr key={item.id}>
                  <td>{item.tanggal_gejala}</td>
                  <td>{item.gejala}</td>
                  <td>{item.catatan_pasien || <em>-</em>}</td>

                  <td>
                    {editedNotes[item.id] !== undefined ? (
                      <>
                        <input
                          type="text"
                          className={styles.noteInput}
                          value={editedNotes[item.id]}
                          onChange={(e) => handleNoteChange(item.id, e.target.value)}
                        />
                        {savingStatus[item.id] === "error" && (
                          <div className={styles.errorText}>Gagal simpan</div>
                        )}
                      </>
                    ) : (
                      item.catatan_dokter || <em>-</em>
                    )}
                  </td>
                  <td>
                    {editedNotes[item.id] !== undefined ? (
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.saveButton}
                          onClick={() => handleSaveNote(item.id)}
                        >
                          Simpan
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleNoteChange(item.id, "")}
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <button
                        className={styles.saveButton}
                        onClick={() =>
                          handleNoteChange(item.id, item.catatan_dokter || "")
                        }
                      >
                        Edit
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Tidak ada data gejala untuk pasien ini.</p>
        )}
      </div>

      <div className={styles.backButtonWrapper}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Kembali
        </button>
      </div>
    </div>
  );
};

export default DetailSymptoms;
