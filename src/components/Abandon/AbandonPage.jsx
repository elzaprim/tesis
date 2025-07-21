import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Abandon.module.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const formatDate = (tanggalStr) => {
  const date = new Date(tanggalStr);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Format YYYY-MM-DD
};


const AbandonPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/Appointment");

        if (res.data.success) {
          const today = new Date();
          const data = res.data.data;

          // Filter hanya appointment yang sudah lewat hari ini
          const pastAppointments = data.filter((item) => {
            const itemDate = new Date(item.tanggal);
            return itemDate < today;
          });

          // Cari appointment 'tidak hadir' dan lebih dari 4 minggu lalu
          const grouped = {};
          pastAppointments.forEach((item) => {
            const key = item.no_rekam_medis;
            const itemDate = new Date(item.tanggal);
            const kehadiran = item.kehadiran?.toLowerCase();
            const selisihHari = (today - itemDate) / (1000 * 60 * 60 * 24);

            const shouldAbandon =
              kehadiran === "tidak hadir" && selisihHari > 28;

            if (shouldAbandon) {
              if (!grouped[key] || itemDate > new Date(grouped[key].tanggal)) {
                grouped[key] = item;
              }
            }
          });

          // Tandai hanya yang latest sebagai abandon = "ya"
          const updatedData = data.map((item) => {
            const abandonItem = grouped[item.no_rekam_medis];
            const isAbandon = abandonItem && abandonItem.id === item.id;
            return {
              ...item,
              abandon: isAbandon ? "ya" : "tidak",
            };
          });

          // Hanya tampilkan yang abandon = "ya"
          const filteredAbandonOnly = updatedData.filter(
            (item) => item.abandon === "ya"
          );

          setAppointments(filteredAbandonOnly);

          // Update abandon ke backend
          updatedData.forEach(async (item) => {
            try {
              await axios.put(`/api/Appointment/update/${item.id}`, {
                abandon: item.abandon,
              });
            } catch (err) {
              console.error("Gagal update abandon otomatis:", err);
            }
          });
        }
      } catch (err) {
        console.error("Gagal fetch data appointment", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleUpdateCatatan = async (id, newCatatan) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: `Ubah catatan menjadi "${newCatatan}" untuk pasien ini?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const tanggalAkhir = getTodayDateString();

        await axios.put(`/api/Appointment/update/${id}`, {
          catatan: newCatatan,
          abandon: "ya",
          tanggal_akhir: tanggalAkhir,
        });

        setAppointments((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  catatan: newCatatan,
                  abandon: "ya",
                  tanggal_akhir: tanggalAkhir,
                }
              : item
          )
        );

        toast.success("Catatan berhasil diperbarui!");
      } catch (error) {
        toast.error("Gagal memperbarui catatan.");
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
      "Tanggal Tidak Hadir": formatDate(item.tanggal),
      Abandon: item.abandon,
      Catatan: item.catatan || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AbandonPasien");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "AbandonPasien.xlsx");
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <ToastContainer />
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
              <th>Tanggal Tidak Hadir</th>
              <th>Abandon</th>
              <th>Tanggal Update</th>
              <th>Tindaklanjut</th>
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
                  <td>{formatDate(a.tanggal)}</td>
                  <td>{a.abandon}</td>
                  <td>
                    {a.tanggal_akhir && a.tanggal_akhir !== "0000-00-00"
                      ? formatDate(a.tanggal_akhir)
                      : "-"}
                  </td>
                  <td>
                    <select
                      value={a.catatan || ""}
                      onChange={(e) => handleUpdateCatatan(a.id, e.target.value)}
                      className={styles.dropdown}
                    >
                      <option value="">Pilih Aksi</option>
                      <option value="Sudah Ditindaklanjuti">Sudah</option>
                      <option value="Belum Ditindaklanjuti">Belum</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Tidak ada data abandon.</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Kembali
      </button>
    </div>
  );
};

export default AbandonPage;
