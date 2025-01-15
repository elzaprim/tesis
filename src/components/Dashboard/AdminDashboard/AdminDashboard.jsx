// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import UserInfo from "../../list/userInfo/UserInfo"; // Jalur relatif ke UserInfo.jsx
import ChatList from "../../list/chatList/ChatList"; // Jalur relatif ke ChatList.jsx

const AdminDashboard = () => {
  const [userName, setUserName] = useState(""); // Store dynamic username
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching user data (can be replaced with real data from API or context)
    setUserName("Admin Cantik"); // Replace this with actual data fetching logic
  }, []);

  const menuItems = [
    {
      src: "/assets/common/lifesavers-caretaking.svg",
      alt: "Patient",
      label: "Data Pasien",
      route: "/admin-patients"
    },
    {
      src: "/assets/common/standing.svg",
      alt: "Chat",
      label: "Konsultasi",
      route: "/admin-consultations"
    },
    {
      src: "/assets/common/videocall.svg",
      alt: "Appointment",
      label: "Janji Temu",
      route: "/admin-appointments"
    },
    {
      src: "/assets/common/frontdesk.svg",
      alt: "Content",
      label: "Konten Edukasi",
      route: "/admin-education"
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          👋 Hi, <span className={styles.userName}>{userName}</span>
        </h1>
        <img
          src="/assets/icon/pp-3.svg"
          alt="User Avatar"
          className={styles.avatar}
          onError={(e) => (e.target.src = "/assets/common/default-avatar.svg")}
        />
      </header>

      <div className={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={styles.menuItem}
            onClick={() => navigate(item.route)}
          >
            <div className={styles.icon}>
              <img src={item.src} alt={item.alt} />
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

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

export default AdminDashboard;
