import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DoctorDashboard.module.css";

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from "axios";


const DoctorDashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Ambil data user dari sessionStorage
  // useEffect(() => {
  //   const nama = sessionStorage.getItem("nama_lengkap") || "Dokter";
  //   setUserName(nama);
  // }, []);


  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    const name = sessionStorage.getItem("nama_lengkap");
    const role = sessionStorage.getItem("role");

    // Jika tidak ada token, atau role bukan dokter, paksa ke login
    if (!token || role !== "dokter") {
      sessionStorage.clear(); // pastikan semua data dibersihkan
      navigate("/", { replace: true }); // cegah kembali ke sini via tombol Back
      return;
    }

    setUserName(name || "Dokter");
  }, []);
  

  // Menu utama dashboard dokter
  // const menuItems = [
  //   { src: "/assets/common/lifesavers.svg", alt: "Overview", label: "Overview", route: "/overview" },
  //   { src: "/assets/common/lifesavers-caretaking.svg", alt: "Data Pasien", label: "Data Pasien", route: "/profile-patient-doctor" },
  //   { src: "/assets/common/videocall.svg", alt: "Janji Temu", label: "Janji Temu", route: "/doctor-appointments" },
  //   // { src: "/assets/common/standing.svg", alt: "Konsultasi", label: "Konsultasi", route: "/consultations" },
  // ];

  const menuItems = [
    { src: "/assets/common/lifesavers.svg", alt: "Overview", label: "Overview", route: "/overview" },
    { src: "/assets/common/lifesavers-caretaking.svg", alt: "Data Pasien", label: "Data Pasien", route: "/profile-patient-doctor" },
    { src: "/assets/common/stomach.svg", alt: "Gejala Pasien", label: "Gejala Pasien", route: "/doctor-patient-symptoms" }, // ← Tambahan ini
    { src: "/assets/common/videocall.svg", alt: "Janji Temu", label: "Janji Temu", route: "/doctor-appointments" },
  ];


  const navItems = [
    { label: "Pengaturan", route: "/settings", className: styles.settingsButton },
    { label: "Keluar", route: "/logout", className: styles.logoutButton },
  ];

  // Gambar fallback
  const FallbackImage = ({ src, alt, className, fallback = "/assets/common/default-avatar.svg" }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => (e.target.src = fallback)}
    />
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1>
          Selamat Datang, <span className={styles.userName}>{userName}</span>
        </h1>
        <FallbackImage
          src="/assets/icon/pp-2.svg"
          alt="User Avatar"
          className={styles.avatar}
        />
      </header>

      {/* Menu Dashboard */}
      <div className={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={styles.menuItem}
            onClick={() => navigate(item.route)}
          >
            <div className={styles.icon}>
              <FallbackImage
                src={item.src}
                alt={item.alt}
                className={styles.iconImage}
                fallback="/assets/common/default-icon.svg"
              />
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Tombol Keluar dan Pengaturan */}
      <nav className={styles.bottomNav}>
        <div
          className={`${styles.navItem} ${styles.logoutButton}`}
          onClick={async () => {
            const result = await Swal.fire({
              title: 'Yakin ingin keluar?',
              text: 'Anda akan logout dari akun ini.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Ya, keluar',
              cancelButtonText: 'Batal',
            });

            if (!result.isConfirmed) return;

            try {
              const token = sessionStorage.getItem("auth_token"); // gunakan auth_token, bukan token

              if (token) {
                await axios.post("/api/logout", {}, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
              }

              await Swal.fire('Berhasil Logout', 'Anda telah keluar.', 'success');

            } catch (err) {
              console.error("Logout gagal:", err);
              await Swal.fire('Gagal Logout', 'Terjadi kesalahan saat logout.', 'error');
            } finally {
              sessionStorage.clear();
              navigate("/", { replace: true }); // gunakan replace agar tidak bisa kembali ke dashboard
            }
          }}
        >
          <span>Keluar</span>
        </div>
      </nav>     

    </div>
  );
};

export default DoctorDashboard;
