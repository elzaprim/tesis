import React, { useEffect, useState } from "react";
import styles from "./GuardianDashboard.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = "https://api.sahabatbmeitb.my.id";

const GuardianDashboard = () => {
  const [userName, setUserName] = useState("Guest");
  const navigate = useNavigate();

  useEffect(() => {
    const name = sessionStorage.getItem("nama_lengkap");
    if (name) setUserName(name);
  }, []);

  useEffect(() => {
    const fetchAppointmentNotifs = async () => {
      const nik = sessionStorage.getItem("nik");
      if (!nik) return;

      try {
        const resPasien = await fetch(`${API_BASE}/Patient/${nik}`);
        const jsonPasien = await resPasien.json();
        if (!jsonPasien.success) return;

        const pasien = Array.isArray(jsonPasien.data)
          ? jsonPasien.data[0]
          : jsonPasien.data;

        const noRekamMedis = pasien.no_rekam_medis;
        const resAppt = await fetch(`${API_BASE}/Appointment/${noRekamMedis}`);
        const jsonAppt = await resAppt.json();
        if (!jsonAppt.success) return;

        const data = Array.isArray(jsonAppt.data) ? jsonAppt.data : [jsonAppt.data];
        const approved = data.filter((item) => item.status?.toLowerCase() === "disetujui");

        approved.forEach((appt, index) => {
          const tanggal = new Date(appt.tanggal).toLocaleDateString("id-ID");

          if (isTodayNear(appt.tanggal, 3)) {
            const toastKey = `appt-${appt.tanggal}-H3`;
            toast.info(`📅 Janji temu H-3: ${tanggal} - ${appt.catatan || "Tidak ada catatan."}`, {
              onClick: () => navigate("/appointment"),
              style: { cursor: "pointer" },
              toastId: toastKey,
            });
          }

          if (isTodayNear(appt.tanggal, 1)) {
            const toastKey = `appt-${appt.tanggal}-H1`;
            toast.info(`⏰ Janji temu H-1: ${tanggal} - ${appt.catatan || "Tidak ada catatan."}`, {
              onClick: () => navigate("/appointment"),
              style: { cursor: "pointer" },
              toastId: toastKey,
            });
          }
        });
      } catch (err) {
        console.error("Gagal fetch notifikasi janji temu:", err);
      }
    };

    fetchAppointmentNotifs();
  }, [navigate]);

  const isTodayNear = (dateStr, daysBefore) => {
    const target = new Date(dateStr);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diff = (target - today) / (1000 * 60 * 60 * 24);
    return diff === daysBefore;
  };

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

export default GuardianDashboard;
