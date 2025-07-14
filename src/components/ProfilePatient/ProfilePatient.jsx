import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../../context/PatientContext";
import styles from "./ProfilePatient.module.css";

const API_PATIENT = "https://api.sahabatbmeitb.my.id/Patient";
const API_USER = "https://api.sahabatbmeitb.my.id/User";

const ProfilPasien = () => {
  const { patient, setPatient } = usePatient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user_id");
  const nik = sessionStorage.getItem("nik");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientRes = await fetch(API_PATIENT);
        const patientJson = await patientRes.json();
        if (patientRes.ok && patientJson.success) {
          const foundPatient = patientJson.data.find(p => p.nik === nik);
          if (foundPatient) setPatient(foundPatient);
        }

        const userRes = await fetch(API_USER);
        const userJson = await userRes.json();
        if (userRes.ok && userJson.success) {
          const foundUser = userJson.data.find(u => u.id.toString() === userId);
          if (foundUser) {
            setUser(foundUser);
            setUpdatedUser(u => ({
              ...u,
              username: foundUser.username
            }));
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && nik) fetchData();
  }, [userId, nik, setPatient]);

  const handleUpdate = async () => {
    const { username, currentPassword, newPassword, confirmPassword } = updatedUser;

    if (!currentPassword) return alert("Password saat ini wajib diisi.");
    if (newPassword !== confirmPassword) return alert("Konfirmasi password tidak cocok.");

    try {
      const res = await fetch(`https://api.sahabatbmeitb.my.id/User/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          currentPassword,
          password: newPassword,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Berhasil memperbarui akun.");
        setEditing(false);
        setUser(prev => ({ ...prev, username }));
      } else {
        alert(result.message || "Gagal memperbarui akun.");
      }
    } catch (err) {
      console.error("Error update:", err);
      alert("Terjadi kesalahan saat memperbarui data.");
    }
  };

  if (loading) {
    return <div className={styles.container}><p>Memuat data...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1>Profil Pasien</h1>

      {patient && (
        <div className={styles.card}>
          <p><strong>Nama:</strong> {patient.nama_lengkap}</p>
          <p><strong>No Rekam Medis:</strong> {patient.no_rekam_medis}</p>
          <p><strong>NIK:</strong> {patient.nik}</p>
          <p><strong>No BPJS:</strong> {patient.no_bpjs || "-"}</p>
          <p><strong>Tanggal Lahir:</strong> {patient.tanggal_lahir}</p>
          <p><strong>Jenis Kelamin:</strong> {patient.jenis_kelamin}</p>
        </div>
        
      )}

      {user && (
        <div className={styles.card}>
          <h2>🧾 Akun</h2>
          {editing ? (
            <>
              <label>Username:</label>
              <input
                type="text"
                value={updatedUser.username}
                onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
              />

              <label>Password Saat Ini:</label>
              <div className={styles.passwordField}>
                <input
                  type={showPass.current ? "text" : "password"}
                  value={updatedUser.currentPassword}
                  onChange={(e) => setUpdatedUser({ ...updatedUser, currentPassword: e.target.value })}
                />
                <button type="button" onClick={() => setShowPass(p => ({ ...p, current: !p.current }))}>
                  {showPass.current ? "🙈" : "👁️"}
                </button>
              </div>

              <label>Password Baru:</label>
              <div className={styles.passwordField}>
                <input
                  type={showPass.new ? "text" : "password"}
                  value={updatedUser.newPassword}
                  onChange={(e) => setUpdatedUser({ ...updatedUser, newPassword: e.target.value })}
                />
                <button type="button" onClick={() => setShowPass(p => ({ ...p, new: !p.new }))}>
                  {showPass.new ? "🙈" : "👁️"}
                </button>
              </div>

              <label>Konfirmasi Password Baru:</label>
              <div className={styles.passwordField}>
                <input
                  type={showPass.confirm ? "text" : "password"}
                  value={updatedUser.confirmPassword}
                  onChange={(e) => setUpdatedUser({ ...updatedUser, confirmPassword: e.target.value })}
                />
                <button type="button" onClick={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))}>
                  {showPass.confirm ? "🙈" : "👁️"}
                </button>
              </div>

              <div className={styles.buttonGroup}>
                <button className={styles.saveButton} onClick={handleUpdate}>💾 Simpan</button>
                <button className={styles.cancelButton} onClick={() => setEditing(false)}>❌ Batal</button>
              </div>

            </>
          ) : (
            <>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <button className={styles.editButton} onClick={() => setEditing(true)}>
                ✏️ Edit Akun
              </button>

            </>
          )}
        </div>
      )}

      {!patient && (
        <div className={styles.card}>
          <p>Data pasien belum tersedia.</p>
          <button onClick={() => navigate("/isi-data-pasien")}>Isi Data Pasien</button>
        </div>
      )}
    </div>
  );
};

export default ProfilPasien;
