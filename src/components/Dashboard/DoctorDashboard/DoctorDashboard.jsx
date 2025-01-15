import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./DoctorDashboard.module.css";

const DoctorDashboard = () => {
  const [userName, setUserName] = useState("dr. Mary Jane, Sp.A(K)");
  const navigate = useNavigate(); // Inisialisasi useNavigate

  useEffect(() => {
    // Simulasi fetch data atau perubahan nama pengguna
    const timer = setTimeout(() => setUserName("dr. John Doe, Sp.PD"), 1000);
    return () => clearTimeout(timer); // Membersihkan timer saat komponen unmount
  }, []);

  // Daftar menu dashboard dokter
  const menuItems = [
    { src: "/assets/common/lifesavers.svg", alt: "Overview", label: "Overview", route: "/overview" },
    { src: "/assets/common/lifesavers-caretaking.svg", alt: "Patient", label: "Data Pasien", route: "/profile-patient-doctor" },
    { src: "/assets/common/videocall.svg", alt: "Appointment", label: "Janji Temu", route: "/doctor-appointments" }, // Perbarui route
    { src: "/assets/common/standing.svg", alt: "Chat", label: "Konsultasi", route: "/consultations" },
  ];

  // Bottom Navigation Items (Logout, Settings)
  const navItems = [
    { label: "Settings", route: "/settings", className: styles.settingsButton }, // 'settingsButton' class for Settings
    { label: "Keluar", route: "/logout", className: styles.logoutButton }, // 'logoutButton' class for Logout
  ];

  // Komponen fallback untuk gambar
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

      {/* Dashboard Menu */}
      <div className={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <div
            className={styles.menuItem}
            key={index}
            onClick={() => navigate(item.route)} // Gunakan useNavigate
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

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        {/* Tombol Settings */}
        <div
          className={`${styles.navItem} ${styles.settingsButton}`}
          onClick={() => navigate("/settings")}
        >
          <span>Pengaturan</span>
        </div>

        {/* Tombol Keluar */}
        <div
          className={`${styles.navItem} ${styles.logoutButton}`}
          onClick={() => navigate("/logout")}
        >
          <span>Keluar</span>
        </div>
      </nav>
    </div>
  );
};

export default DoctorDashboard;
