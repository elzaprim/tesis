import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Abandon.module.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";

const AbandonPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/Appointment");
        // if (res.data.success) {
        //   const today = new Date();

        //   const updatedData = res.data.data.map((item) => {
        //     let abandon = item.abandon; // pakai dari DB dulu

        //     // Jika belum pernah diubah manual (abandon belum diset di DB)
        //     if (!abandon) {
        //       const appointmentDate = new Date(item.tanggal);
        //       const kehadiran = item.kehadiran?.toLowerCase();
        //       const selisihMinggu = (today - appointmentDate) / (1000 * 60 * 60 * 24 * 7);
        //       abandon =
        //         kehadiran === "tidak hadir" && selisihMinggu > 4 ? "ya" : "tidak";
        //     }

        //     return { ...item, abandon };
        //   });


        //   setAppointments(updatedData);

        if (res.data.success) {
          const today = new Date();
          const data = res.data.data;

          // Grup berdasarkan no_rekam_medis, ambil yang tanggalnya paling baru
          const grouped = {};

          data.forEach((item) => {
            const key = item.no_rekam_medis;
            const itemDate = new Date(item.tanggal);

            if (!grouped[key] || itemDate > new Date(grouped[key].tanggal)) {
              grouped[key] = item;
            }
          });

          const updatedData = Object.values(grouped).map((item) => {
            let abandon = item.abandon;

            if (!abandon) {
              const appointmentDate = new Date(item.tanggal);
              const kehadiran = item.kehadiran?.toLowerCase();
              const selisihMinggu =
                (today - appointmentDate) / (1000 * 60 * 60 * 24 * 7);

              abandon =
                kehadiran === "tidak hadir" && selisihMinggu > 4 ? "ya" : "tidak";
            }

            return { ...item, abandon };
          });

          setAppointments(updatedData);
        }

      } catch (err) {
        console.error("Gagal fetch data appointment", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleToggleAbandon = async (id, currentAbandon) => {
    const newStatus = currentAbandon === "ya" ? "tidak" : "ya";

    const result = await Swal.fire({
      title: "Yakin ubah status abandon?",
      text: `Status akan diubah menjadi "${newStatus.toUpperCase()}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, ubah",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        // Kirim ke backend
        await axios.put(`/api/Appointment/update/${id}`, { abandon: newStatus });

        // Update frontend state
        setAppointments((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, abandon: newStatus } : item
          )
        );

        toast.success("Status abandon berhasil diperbarui!");
      } catch (error) {
        toast.error("Gagal memperbarui status abandon.");
        console.error("PUT error:", error);
      }
    }
  };

  const handleExportExcel = () => {
    const exportData = appointments.map((item) => ({
      Nama: item.nama_lengkap,
      "No Registrasi": item.no_registrasi,
      "No Rekam Medis": item.no_rekam_medis,
      "Nama Dokter": item.nama_dokter,
      Abandon: item.abandon,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AbandonPasien");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "AbandonPasien.xlsx");
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Data Abandon Pasien</h1>
        <button onClick={handleExportExcel} className={styles.exportButton}>
          Export ke Excel
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama</th>
              <th>No Registrasi</th>
              <th>No Rekam Medis</th>
              <th>Nama Dokter</th>
              <th>Abandon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.nama_lengkap}</td>
                  <td>{a.no_registrasi}</td>
                  <td>{a.no_rekam_medis}</td>
                  <td>{a.nama_dokter}</td>
                  <td>{a.abandon}</td>
                  <td>
                    <button
                      className={styles.viewDetailsButton}
                      onClick={() => handleToggleAbandon(a.id, a.abandon)}
                    >
                      Ubah
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Tidak ada data appointment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>
    </div>
  );
};

export default AbandonPage;
