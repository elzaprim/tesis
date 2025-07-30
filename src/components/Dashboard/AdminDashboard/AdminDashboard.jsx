import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const AdminDashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [toastShown, setToastShown] = useState(false); // flag agar toast hanya muncul sekali
  

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    const name = sessionStorage.getItem("nama_lengkap");
    const role = sessionStorage.getItem("role");

    // Jika tidak ada token, atau role bukan administrator, paksa ke login
    if (!token || role !== "administrator") {
      sessionStorage.clear(); // pastikan semua data dibersihkan
      navigate("/", { replace: true }); // cegah kembali ke sini via tombol Back
      return;
    }

    setUserName(name || "Admin");
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
            toast.warn(`Ada ${abandonCount} pasien dengan status abandon!`, {
              toastId: "abandon-warning", // tambahkan toastId unik di sini

              onClick: () => navigate("/abandon"),
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

    useEffect(() => {
      const checkDoctorRequests = async () => {
        try {
          const res = await fetch("/api/Appointment");
          const json = await res.json();
          if (!json.success) return;

          const data = Array.isArray(json.data) ? json.data : [json.data];
          const requests = data.filter((item) =>
            item.status?.toLowerCase() === "request"
          );

          if (requests.length > 0 && !window.hasShownRequestToast) {
            window.hasShownRequestToast = true; // global flag
            toast.info(`📥 Ada ${requests.length} permintaan janji temu dari dokter yang perlu ditinjau.`, {
              onClick: () => navigate("/admin-appointments"),
              position: "top-right",
              autoClose: 6000,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "colored",
              style: { cursor: "pointer" }
            });
          }

        } catch (err) {
          console.error("Gagal cek permintaan janji temu dokter:", err);
        }
      };

      checkDoctorRequests();
    }, [navigate]);


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
              localStorage.removeItem("doctorRequestShown");
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

export default AdminDashboard;
