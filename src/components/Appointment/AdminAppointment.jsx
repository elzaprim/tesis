import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AdminAppointment.module.css";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = "/api";

const AdminAppointment = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/Appointment`);
        if (response.data.success && Array.isArray(response.data.data)) {
          setAppointments(response.data.data);
        } else {
          setError("Data tidak valid.");
        }
      } catch (err) {
        setError("Gagal memuat janji temu.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleRowClick = (appointment) => {
    setSelectedRow(selectedRow === appointment.id ? null : appointment.id);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredAppointments = appointments.filter((a) =>
    filter ? a.status === filter : true
  );

  // const handleApprove = (appointment) => {
  //   setSelectedAppointment(appointment);
  //   if (appointment.status === "reschedule") {
  //     setShowModal(true); // butuh input tanggal baru
  //   } else if (appointment.status === "request") {
  //     handleApproveRequestOnly(appointment); // langsung setujui
  //   }
  // };

  const handleApprove = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true); // selalu minta input tanggal, baik request maupun reschedule
  };

  const handleApproveRequestOnly = async (appointment) => {
    try {
      await axios.put(`${API_BASE_URL}/Appointment/update/${appointment.id}`, {
        nama_lengkap: appointment.nama_lengkap,
        no_registrasi: appointment.no_registrasi,
        no_rekam_medis: appointment.no_rekam_medis,
        id_dokter: appointment.id_dokter || 1,
        tanggal: appointment.tanggal, // tidak diubah
        status: "disetujui",
        keterangan: "Permintaan awal disetujui"
      });

      const updated = appointments.map((a) =>
        a.id === appointment.id ? { ...a, status: "disetujui" } : a
      );
      setAppointments(updated);
      updateNotifications(`Janji temu pasien ${appointment.nama_lengkap} telah disetujui.`);
    } catch (err) {
      alert("Gagal menyetujui janji temu.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/Appointment/update/${id}`, {
        status: "tidak disetujui",
      });
      const updated = appointments.map((a) =>
        a.id === id ? { ...a, status: "tidak disetujui" } : a
      );
      setAppointments(updated);
      updateNotifications(`Janji temu ID ${id} ditolak.`);
    } catch (err) {
      alert("Gagal menolak janji temu.");
    }
  };

  const handleModalSubmit = async () => {
    if (!newDate) {
      toast.error("Tanggal baru harus diisi.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (newDate < today) {
      toast.error("Tanggal tidak boleh di masa lalu.");
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/Appointment/update/${selectedAppointment.id}`, {
        nama_lengkap: selectedAppointment.nama_lengkap,
        no_registrasi: selectedAppointment.no_registrasi,
        no_rekam_medis: selectedAppointment.no_rekam_medis,
        id_dokter: selectedAppointment.id_dokter || 1,
        tanggal: newDate,
        status: "disetujui",
        keterangan:
          selectedAppointment.status === "request"
            ? "Permintaan awal disetujui dengan tanggal baru"
            : "Jadwal direschedule dan disetujui"
      });

      const updated = appointments.map((a) =>
        a.id === selectedAppointment.id
          ? { ...a, status: "disetujui", tanggal: newDate }
          : a
      );
      setAppointments(updated);
      updateNotifications(
        `Janji temu pasien ${selectedAppointment.nama_lengkap} disetujui untuk tanggal ${newDate}.`
      );
      toast.success("Jadwal berhasil diperbarui.");
      setShowModal(false);
      setNewDate("");
    } catch (error) {
      toast.error("Gagal memperbarui jadwal.");
    }
  };



  const updateNotifications = (msg) => {
    setNotifications((prev) => [...prev, { id: Date.now(), message: msg }]);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1>Janji Temu Admin</h1>

        <div className={styles.filterSection}>
          <label>Status:</label>
          <select
            value={filter}
            onChange={handleFilterChange}
            className={`${styles.filterDropdown} ${styles.dropdown}`}
          >
            <option value="">Semua</option>
            <option value="request">Permintaan Awal</option>
            <option value="reschedule">Penjadwalan Ulang</option>
            <option value="disetujui">Disetujui</option>
            <option value="tidak disetujui">Ditolak</option>
          </select>
        </div>


      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Rekam Medis</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((a) => (
              <tr
                key={a.id}
                onClick={() => handleRowClick(a)}
                className={selectedRow === a.id ? styles.selected : ""}
              >
                <td>{a.nama_lengkap}</td>
                <td>{a.no_rekam_medis}</td>
                <td>{a.tanggal}</td>
                <td>{a.status}</td>
                <td>
                  {["request", "reschedule"].includes(a.status) && (
                    <div className={styles.actionButtonContainer}>
                      <button onClick={() => handleApprove(a)} className={styles.approveButton}>
                        Setujui
                      </button>
                      <button onClick={() => handleReject(a.id)} className={styles.rejectButton}>
                        Tolak
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Tidak ada janji temu.</td>
            </tr>
          )}
        </tbody>
      </table>

      <section className={styles.notificationSection}>
        <h2>Catatan</h2>
        <div className={styles.notificationList}>
          {notifications.map((n) => (
            <div key={n.id} className={styles.notificationCard}>
              📝 {n.message}
            </div>
          ))}
        </div>
      </section>


      {/* <div className={styles.footerButtons}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          Kembali
        </button>
        <button onClick={() => navigate("/logout")} className={styles.logoutButton}>
          Keluar
        </button>
      </div> */}

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Pilih Tanggal Baru</h3>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button onClick={handleModalSubmit} className={styles.submitButton}>
                Simpan
              </button>
              <button onClick={() => setShowModal(false)} className={styles.cancelButton}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>

      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default AdminAppointment;
