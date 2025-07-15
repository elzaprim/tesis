import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./DoctorAppointment.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Swal from 'sweetalert2';

const API_BASE_URL = "/api";

const DoctorAppointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newRekamMedis, setNewRekamMedis] = useState("");
  const [newAddDate, setNewAddDate] = useState("");


  const doctorName = sessionStorage.getItem("nama_lengkap");

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    tanggal: "",
    status: "",
    kehadiran: "",
    keterangan: ""
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Appointment`);
        if (response.data.success && Array.isArray(response.data.data)) {
          const filteredByDoctor = response.data.data.filter(
            (a) => a.nama_dokter?.toLowerCase() === doctorName?.toLowerCase()
          );
          setAppointments(filteredByDoctor);
        }
      } catch (err) {
        toast.error("Gagal memuat janji temu.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorName]);

  // const handleReschedule = (appointment) => {
  //   setSelectedAppointment(appointment);
  //   setShowModal(true);
  // };

  const handleReschedule = (appointment) => {
    const today = new Date();
    const appointmentDate = new Date(appointment.tanggal);
    const sudahLewat = appointmentDate < today;
    const sudahHadir = appointment.kehadiran?.toLowerCase() === "hadir";

    if (sudahLewat && sudahHadir) {
      toast.error("Janji temu ini tidak bisa dijadwal ulang karena pasien sudah hadir dan tanggal telah lewat.");
      return;
    }

    setSelectedAppointment(appointment);
    setShowModal(true);
  };


  const handleSubmitReschedule = async () => {
    if (!newDate) return toast.error("Tanggal baru harus diisi.");

    try {
      await axios.put(`${API_BASE_URL}/Appointment/update/${selectedAppointment.id}`, {
        ...selectedAppointment,
        tanggal: newDate,
        status: "request",
        keterangan: "Jadwal diubah oleh dokter"
      });

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selectedAppointment.id ? { ...a, tanggal: newDate, status: "request" } : a
        )
      );

      toast.success("Jadwal berhasil diajukan ulang.");
      setShowModal(false);
      setNewDate("");
    } catch (err) {
      toast.error("Gagal melakukan reschedule.");
    }
  };

  const handleAddAppointment = async () => {
    if (!newRekamMedis || !newAddDate) return toast.error("Lengkapi data!");

    const token = sessionStorage.getItem("auth_token");

    try {
      await axios.post(
        `${API_BASE_URL}/Appointment/store`,
        {
          nama_lengkap: "Pasien 1", // bisa kamu ubah jadi dynamic kalau mau
          no_registrasi: "01108711", // juga bisa dynamic jika perlu
          no_rekam_medis: newRekamMedis,
          nama_dokter: doctorName,
          tanggal: newAddDate,
          status: "request",
          keterangan: "Jadwal diubah oleh dokter"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Janji temu baru berhasil ditambahkan.");
      setNewRekamMedis("");
      setNewAddDate("");
    } catch (err) {
      toast.error("Gagal menambahkan janji temu.");
      console.error(err.response?.data || err.message);
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setEditData({
      tanggal: appointment.tanggal || "",
      status: appointment.status || "",
      kehadiran: appointment.kehadiran || "",
      keterangan: appointment.keterangan || ""
    });
    setEditMode(true);
  };

  const handleSubmitEdit = async () => {
    try {
      const payload = {
        ...selectedAppointment,
        ...editData,
        kehadiran: editData.kehadiran === "" ? null : editData.kehadiran,
        keterangan: editData.keterangan === "" ? null : editData.keterangan,
      };

      await axios.put(`${API_BASE_URL}/Appointment/update/${selectedAppointment.id}`, payload);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selectedAppointment.id ? { ...a, ...payload } : a
        )
      );

      toast.success("Janji temu berhasil diperbarui.");
      setEditMode(false);
      setSelectedAppointment(null);
    } catch (err) {
      toast.error("Gagal memperbarui janji temu.");
      console.error("DETAIL ERROR:", err.response?.data || err.message);
    }
  };

  const handleDeleteAppointment = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data janji temu ini akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal"
    });

    if (!result.isConfirmed) return;

    try {
      await axios.get(`${API_BASE_URL}/Appointment/delete/${selectedAppointment.id}`);
      setAppointments((prev) =>
        prev.filter((a) => a.id !== selectedAppointment.id)
      );
      toast.success("Janji temu berhasil dihapus.");
      setEditMode(false);
      setSelectedAppointment(null);
    } catch (err) {
      toast.error("Gagal menghapus janji temu.");
      console.error("DETAIL ERROR:", err.response?.data || err.message);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchDate = filterDate ? appointment.tanggal === filterDate : true;
    const matchText = searchTerm
      ? filterType === "name"
        ? appointment.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase())
        : filterType === "rekam"
        ? appointment.no_rekam_medis?.toLowerCase().includes(searchTerm.toLowerCase())
        : filterType === "status"
        ? appointment.status?.toLowerCase().includes(searchTerm.toLowerCase())
        : true
      : true;
    return matchDate && matchText;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Janji Temu Dokter: {doctorName}</h1>

      <div className={styles.filterSection}>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className={styles.filterDropdown}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={styles.filterDropdown}
        >
          <option value="">Filter</option>
          <option value="name">Nama</option>
          <option value="rekam">No Rekam Medis</option>
          <option value="status">Status</option>
        </select>


        <input
          type="text"
          placeholder="Cari..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.filterDropdown}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
        <thead>
          <tr>
            <th>Nama Pasien</th>
            <th>No Rekam Medis</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Kehadiran</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((a) => (
              <tr key={a.id}>
                <td>{a.nama_lengkap}</td>
                <td>{a.no_rekam_medis}</td>
                <td>{a.tanggal}</td>
                <td>{a.status}</td>
                <td>{a.kehadiran || "-"}</td> {/* jika null, tampilkan "-" */}
                <td>
                  <div className={styles.actionButtonContainer}>

                    <button
                      onClick={() => handleEdit(a)}
                      className={`${styles.actionButton} ${styles.approveButton}`}
                    >
                      Edit
                    </button>

                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.noData}>Tidak ada janji temu ditemukan.</td>
            </tr>
          )}
        </tbody>


        </table>
      </div>

      <div className={styles.addAppointmentSection}>
        <h2>Tambah Janji Temu Baru</h2>
        <input
          type="text"
          placeholder="No Rekam Medis"
          value={newRekamMedis}
          onChange={(e) => setNewRekamMedis(e.target.value)}
        />
        <input
          type="date"
          value={newAddDate}
          onChange={(e) => setNewAddDate(e.target.value)}
        />
        <button className={styles.addButton} onClick={handleAddAppointment}>
          Tambah
        </button>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Reschedule Tanggal Baru</h3>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button onClick={handleSubmitReschedule} className={styles.submitButton}>
                Simpan
              </button>
              <button onClick={() => setShowModal(false)} className={styles.cancelButton}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {editMode && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Edit Janji Temu</h3>

            <label>Tanggal:</label>
            <input
              type="date"
              value={editData.tanggal}
              onChange={(e) => setEditData({ ...editData, tanggal: e.target.value })}
            />

            <label>Status:</label>
            <select
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            >
              <option value="">-- Pilih Status --</option>
              <option value="request">request</option>
              <option value="disetujui">disetujui</option>
              <option value="tidak disetujui">tidak disetujui</option>
            </select>

            <label>Kehadiran:</label>
            <select
              value={editData.kehadiran}
              onChange={(e) => setEditData({ ...editData, kehadiran: e.target.value })}
            >
              <option value="">Kosongkan</option>
              <option value="hadir">Hadir</option>
              <option value="tidak hadir">Tidak Hadir</option>
            </select>


            <label>Keterangan (boleh dikosongkan):</label>
            <textarea
              value={editData.keterangan}
              placeholder="Opsional"
              onChange={(e) => setEditData({ ...editData, keterangan: e.target.value })}
            />

            <div className={styles.modalActions}>
              <button onClick={handleSubmitEdit} className={styles.submitButton}>
                Simpan Perubahan
              </button>
              <button onClick={handleDeleteAppointment} className={styles.deleteButton}>
                Hapus Janji Temu
              </button>
              <button onClick={() => setEditMode(false)} className={styles.cancelButton}>
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

export default DoctorAppointment;