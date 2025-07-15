import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [toastShown, setToastShown] = useState(false); // flag agar toast hanya muncul sekali

  useEffect(() => {
    const name = sessionStorage.getItem("nama_lengkap");
    if (name) {
      setUserName(name);
    } else {
      setUserName("Admin");
    }
  }, []);

  useEffect(() => {
    const checkAbandonPatients = async () => {
      try {
        const res = await axios.get("/api/Appointment");
        if (res.data.success) {
          const today = new Date();
          const data = res.data.data;

          // Ambil data terbaru berdasarkan no_rekam_medis
          const latestByRekamMedis = {};
          data.forEach((item) => {
            const key = item.no_rekam_medis;
            const tgl = new Date(item.tanggal);
            if (!latestByRekamMedis[key] || tgl > new Date(latestByRekamMedis[key].tanggal)) {
              latestByRekamMedis[key] = item;
            }
          });

          const filtered = Object.values(latestByRekamMedis);

          // Hitung yang abandon === "ya"
          const abandonCount = filtered.reduce((count, item) => {
            let abandonStatus = item.abandon;
            if (!abandonStatus) {
              const appointmentDate = new Date(item.tanggal);
              const kehadiran = item.kehadiran?.toLowerCase();
              const selisihMinggu =
                (today - appointmentDate) / (1000 * 60 * 60 * 24 * 7);
              abandonStatus =
                kehadiran === "tidak hadir" && selisihMinggu > 4 ? "ya" : "tidak";
            }
            return abandonStatus === "ya" ? count + 1 : count;
          }, 0);

          if (abandonCount > 0) {           
            toast.warn(`⚠️ Ada ${abandonCount} pasien dengan status abandon!`, {
              toastId: "abandon-warning", // tambahkan toastId unik di sini

              onClick: () => navigate("/abandon-page"),
              position: "top-right",
              autoClose: 5000,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "colored",
            });
          }
        }
      } catch (err) {
        console.error("Gagal cek data abandon:", err);
      }
    };

    checkAbandonPatients();
  }, []);


  const menuItems = [
    {
      src: "/assets/common/lifesavers-caretaking.svg",
      alt: "Patient",
      label: "Data Pasien",
      route: "/profile-patient-admin",
    },
    {
      src: "/assets/common/videocall.svg",
      alt: "Appointment",
      label: "Janji Temu",
      route: "/admin-appointments",
    },
    {
      src: "/assets/common/frontdesk.svg",
      alt: "Content",
      label: "Konten Edukasi",
      route: "/admin-education",
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

export default AdminDashboard;
