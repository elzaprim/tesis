import React, { useEffect, useState } from "react";
import styles from "./GuardianDashboard.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from "axios";

const API_BASE = "https://api.sahabatbmeitb.my.id";

const GuardianDashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   const name = sessionStorage.getItem("nama_lengkap");
  //   if (name) setUserName(name);
  // }, []);

    useEffect(() => {
      const token = sessionStorage.getItem("auth_token");
      const name = sessionStorage.getItem("nama_lengkap");
      const role = sessionStorage.getItem("role");
  
      // Jika tidak ada token, atau role bukan pasien, paksa ke login
      if (!token || role !== "pasien") {
        sessionStorage.clear(); // pastikan semua data dibersihkan
        navigate("/", { replace: true }); // cegah kembali ke sini via tombol Back
        return;
      }
  
      setUserName(name || "Pasien");
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

  useEffect(() => {
    const checkDoctorNotes = async () => {
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
        const resSymptoms = await fetch(`${API_BASE}/Symptom/${noRekamMedis}`);
        const jsonSymptoms = await resSymptoms.json();
        if (!jsonSymptoms.success) return;

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Ambil history notifikasi sebelumnya
        const storedKeys = JSON.parse(localStorage.getItem("doctorNoteShown") || "{}");

        // Bersihkan notifikasi lama (>24 jam)
        Object.keys(storedKeys).forEach((key) => {
          const saved = new Date(storedKeys[key]);
          if (now - saved > 24 * 60 * 60 * 1000) {
            delete storedKeys[key];
          }
        });

        jsonSymptoms.data.forEach((item) => {
          if (item.catatan_dokter) {
            const itemDate = new Date(item.updated_at || item.created_at || item.tanggal_gejala);
            const isRecent = itemDate > oneDayAgo;
            const toastKey = `doctor-note-${item.id}`;

            if (isRecent && !storedKeys[toastKey]) {
              toast.info(
                `🩺 Catatan dari dokter tersedia untuk gejala tanggal ${new Date(item.tanggal_gejala).toLocaleDateString("id-ID")}`,
                {
                  onClick: () => navigate("/patient-symptoms"),
                  style: { cursor: "pointer" },
                  toastId: toastKey,
                }
              );

              // Simpan waktu tampil notifikasi
              storedKeys[toastKey] = now.toISOString();
            }
          }
        });

        // Simpan kembali ke localStorage setelah update
        localStorage.setItem("doctorNoteShown", JSON.stringify(storedKeys));
      } catch (err) {
        console.error("Gagal cek catatan dokter:", err);
      }
    };

    checkDoctorNotes();
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
              localStorage.removeItem("doctorNoteShown"); // reset notifikasi agar muncul lagi setelah login
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

export default GuardianDashboard;
