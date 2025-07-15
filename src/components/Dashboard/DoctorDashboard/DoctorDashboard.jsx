import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DoctorDashboard.module.css";

const DoctorDashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Ambil data user dari sessionStorage
  useEffect(() => {
    const nama = sessionStorage.getItem("nama_lengkap") || "Dokter";
    setUserName(nama);
  }, []);

  // Menu utama dashboard dokter
  const menuItems = [
    { src: "/assets/common/lifesavers.svg", alt: "Overview", label: "Overview", route: "/overview" },
    { src: "/assets/common/lifesavers-caretaking.svg", alt: "Data Pasien", label: "Data Pasien", route: "/profile-patient-doctor" },
    { src: "/assets/common/videocall.svg", alt: "Janji Temu", label: "Janji Temu", route: "/doctor-appointments" },
    // { src: "/assets/common/standing.svg", alt: "Konsultasi", label: "Konsultasi", route: "/consultations" },
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
          onClick={() => navigate("/")}
        >
          <span>Keluar</span>
        </div>
      </nav>
      
    </div>
  );
};

export default DoctorDashboard;
