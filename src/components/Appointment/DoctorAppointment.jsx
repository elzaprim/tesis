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
  // const [newAddDate, setNewAddDate] = useState("");
  
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

  const [isNewPatient, setIsNewPatient] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newNoRegistrasi, setNewNoRegistrasi] = useState("");

  const [newTanggalLahir, setNewTanggalLahir] = useState("");
  const [newJenisKelamin, setNewJenisKelamin] = useState("");
  const [newBB, setNewBB] = useState("");
  const [newTB, setNewTB] = useState("");

  const doctorName = sessionStorage.getItem("nama_lengkap");

  const [editMode, setEditMode] = useState(false);
  // const [editData, setEditData] = useState({
  //   tanggal: "",
  //   status: "",
  //   kehadiran: "",
  //   keterangan: ""
  // });

  const [editData, setEditData] = useState({
    tanggal_mulai: "",
    tanggal_akhir: "",
    status: "",
    kehadiran: "",
    keterangan: ""
  });


  // useEffect(() => {
  //   const fetchAppointments = async () => {
  //     try {
  //       const response = await axios.get(`${API_BASE_URL}/Appointment`);
  //       if (response.data.success && Array.isArray(response.data.data)) {
  //         const filteredByDoctor = response.data.data.filter(
  //           (a) => a.nama_dokter?.toLowerCase() === doctorName?.toLowerCase()
  //         );
  //         setAppointments(filteredByDoctor);
  //       }
  //     } catch (err) {
  //       toast.error("Gagal memuat janji temu.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAppointments();
  // }, [doctorName]);


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Appointment`);
        if (response.data.success && Array.isArray(response.data.data)) {
          const filteredByDoctor = response.data.data.filter(
            (a) => a.nama_dokter?.toLowerCase() === doctorName?.toLowerCase()
          );

          setAppointments(filteredByDoctor);

          const shownFeedbacks = JSON.parse(localStorage.getItem("shownFeedbacks") || "[]");

          filteredByDoctor.forEach((a) => {
            if (
              a.feedback_admin &&
              !shownFeedbacks.includes(a.id)
            ) {
              toast.info(`📌 Feedback admin untuk pasien ${a.nama_lengkap}: ${a.feedback_admin}`, {
                toastId: `feedback-${a.id}`
              });

              // Simpan ID yang sudah ditampilkan
              shownFeedbacks.push(a.id);
            }
          });

          localStorage.setItem("shownFeedbacks", JSON.stringify(shownFeedbacks));
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
    // Validasi input
    if (
      (!isNewPatient && (!newRekamMedis || !newStartDate)) || 
      (isNewPatient && (!newPatientName || !newNoRegistrasi || !newStartDate))
    ) {
      return toast.error("Lengkapi data!");
    }

    const token = sessionStorage.getItem("auth_token");
    let pasien = null;

    try {
      const token = sessionStorage.getItem('auth_token'); // Ambil token dari sessionStorage

      if (isNewPatient) {
        // Generate No Rekam Medis (sementara)
        const generatedNoRekamMedis = "RM" + Date.now();

        // Simpan pasien baru dengan header Authorization
        const resCreate = await axios.post(
          `${API_BASE_URL}/Patient/store`,
          {
            no_rekam_medis: generatedNoRekamMedis,
            nama_lengkap: newPatientName,
            no_registrasi: newNoRegistrasi,
            tanggal_lahir: newTanggalLahir,
            jenis_kelamin: newJenisKelamin,
            bb: newBB,
            tb: newTB
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        pasien = resCreate.data.data;
      } else {
        // Ambil pasien lama
        const res = await axios.get(`${API_BASE_URL}/Patient/${newRekamMedis}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dataPasien = Array.isArray(res.data?.data) ? res.data.data[0] : res.data.data;

        if (!dataPasien) {
          return toast.error("Pasien tidak ditemukan!");
        }

        pasien = dataPasien;
      }
      //  Tambah Janji Temu
      await axios.post(
        `${API_BASE_URL}/Appointment/store`,
        {
          nama_lengkap: pasien.nama_lengkap,
          no_registrasi: pasien.no_registrasi,
          no_rekam_medis: pasien.no_rekam_medis,
          nama_dokter: doctorName,
          tanggal: newStartDate,
          tanggal_akhir: newEndDate || newStartDate,
          status: "request",
          keterangan: "Jadwal dibuat oleh dokter",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      toast.success("Janji temu berhasil ditambahkan.");

      // Reset form
      setNewRekamMedis("");
      setNewStartDate("");
      setNewEndDate("");
      setNewPatientName("");
      setNewNoRegistrasi("");
      setNewTanggalLahir("");
      setNewJenisKelamin("");
      setNewBB("");
      setNewTB("");
      setIsNewPatient(false);


    } catch (err) {
      toast.error("Gagal menambahkan janji temu.");
      console.error(err.response?.data || err.message);
    }
  };


  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setEditData({
      tanggal_mulai: appointment.tanggal_mulai || appointment.tanggal || "",
      tanggal_akhir: appointment.tanggal_akhir || appointment.tanggal || "",
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
      tanggal_mulai: editData.tanggal_mulai,
      tanggal_akhir: editData.tanggal_akhir || editData.tanggal_mulai, // fallback
      status: editData.status,
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
            <th>Feedback Admin</th>
          </tr>
        </thead>

        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((a) => (
              <tr key={a.id}>
                <td>{a.nama_lengkap}</td>
                <td>{a.no_rekam_medis}</td>

                <td>
                  {a.tanggal
                    ? a.tanggal_akhir && a.tanggal_akhir !== "0000-00-00" && a.tanggal_akhir !== a.tanggal
                      ? `${a.tanggal} s.d. ${a.tanggal_akhir}`
                      : a.tanggal
                    : a.tanggal}
                </td>

                <td>{a.status}</td>
                <td>{a.kehadiran || "-"}</td>
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

                {/* Tambahan untuk menampilkan kolom feedback admin */}
                <td>{a.feedback_admin || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className={styles.noData}>Tidak ada janji temu ditemukan.</td>
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

        {/* Checkbox Pasien Baru */}
        <div className={styles.checkboxRow}>
          <label htmlFor="newPatientCheckbox">Apakah pasien merupakan pasien baru?</label>
          <input
            type="checkbox"
            id="newPatientCheckbox"
            checked={isNewPatient}
            onChange={() => setIsNewPatient(!isNewPatient)}
          />
        </div>


        {/* Input Tambahan untuk Pasien Baru */}
        {isNewPatient && (
          <>
            <label>Nama Lengkap:</label>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={newPatientName}
              onChange={(e) => setNewPatientName(e.target.value)}
            />

            <label>No Registrasi:</label>
            <input
              type="text"
              placeholder="No Registrasi"
              value={newNoRegistrasi}
              onChange={(e) => setNewNoRegistrasi(e.target.value)}
            />

            <label>Tanggal Lahir:</label>
            <input
              type="date"
              value={newTanggalLahir}
              onChange={(e) => setNewTanggalLahir(e.target.value)}
            />

            <label>Jenis Kelamin:</label>
            <select
              value={newJenisKelamin}
              onChange={(e) => setNewJenisKelamin(e.target.value)}
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="laki-laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>

            <label>Berat Badan (kg):</label>
            <input
              type="number"
              placeholder="Berat Badan (kg)"
              value={newBB}
              onChange={(e) => setNewBB(e.target.value)}
            />

            <label>Tinggi Badan (cm):</label>
            <input
              type="number"
              placeholder="Tinggi Badan (cm)"
              value={newTB}
              onChange={(e) => setNewTB(e.target.value)}
            />
          </>
        )}


        <label>Tanggal Mulai:</label>
        <input
          type="date"
          value={newStartDate}
          onChange={(e) => setNewStartDate(e.target.value)}
        />

        <label>Tanggal Akhir:</label>
        <input
          type="date"
          value={newEndDate}
          onChange={(e) => setNewEndDate(e.target.value)}
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

            <label>Tanggal Mulai:</label>
            <input
              type="date"
              value={editData.tanggal_mulai}
              onChange={(e) => setEditData({ ...editData, tanggal_mulai: e.target.value })}
            />

            <label>Tanggal Akhir:</label>
            <input
              type="date"
              value={editData.tanggal_akhir}
              onChange={(e) => setEditData({ ...editData, tanggal_akhir: e.target.value })}
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