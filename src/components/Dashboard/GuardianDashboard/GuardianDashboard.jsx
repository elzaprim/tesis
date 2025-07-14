import React, { useEffect, useState } from "react";
import styles from "./GuardianDashboard.module.css";
import { useNavigate } from "react-router-dom";

const GuardianDashboard = () => {
  const [userName, setUserName] = useState("Guest");
  const navigate = useNavigate();

  useEffect(() => {
    const name = sessionStorage.getItem("nama_lengkap");
    if (name) setUserName(name);
  }, []);

  // Menu dashboard pasien
  const menuItems = [
    {
      src: "/assets/common/lifesavers-caretaking.svg",
      alt: "Profil Pasien",
      label: "Profil Pasien",
      route: "/profil-pasien",
    },
    {
      src: "/assets/common/stomach.svg",
      alt: "Patient Symptoms",
      label: "Gejala Pasien",
      route: "/patient-symptoms",
    },
    {
      src: "/assets/common/electrocardiogram.svg",
      alt: "Medical History",
      label: "Riwayat Medis",
      route: "/medical-history",
    },
    {
      src: "/assets/common/videocall.svg",
      alt: "Appointment",
      label: "Janji Temu",
      route: "/appointment",
    },
    {
      src: "/assets/common/standing.svg",
      alt: "Chat Doctor",
      label: "Konsultasi",
      route: "/chat-doctor",
    },
    {
      src: "/assets/common/frontdesk.svg",
      alt: "Finding Content",
      label: "FAQ dan Edukasi",
      route: "/guardian-education",
    },
  ];

  const handleMenuClick = (route) => {
    navigate(route);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1>
          👋 Hi, <span className={styles.userName}>{userName}!</span>
        </h1>
        <img
          src="/assets/icon/pp-1.svg"
          alt="User Avatar"
          className={styles.avatar}
          onError={(e) => (e.target.src = "/assets/common/default-avatar.svg")}
        />
      </header>

      {/* Dashboard Menu */}
      <div className={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <div
            className={styles.menuItem}
            key={index}
            onClick={() => handleMenuClick(item.route)}
          >
            <div className={styles.icon}>
              <img
                src={item.src}
                alt={item.alt}
                onError={(e) => (e.target.src = "/assets/common/default-icon.svg")}
              />
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Tombol Keluar dan Pengaturan */}
      <nav className={styles.bottomNav}>
        <div
          className={`${styles.navItem} ${styles.settingsButton}`}
          onClick={() => navigate("/settings")}
        >
          <span>Pengaturan</span>
        </div>
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

export default GuardianDashboard;
