import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DoctorDashboard.module.css";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "https://api.sahabatbmeitb.my.id";

const DoctorDashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    const name = sessionStorage.getItem("nama_lengkap");
    const role = sessionStorage.getItem("role");

    if (!token || role !== "dokter") {
      sessionStorage.clear();
      navigate("/", { replace: true });
      return;
    }

    setUserName(name || "Dokter");
  }, []);

  useEffect(() => {
    const fetchCatatanPasien = async () => {
      try {
        const res = await fetch(`${API_BASE}/Symptom`);
        const json = await res.json();

        if (!json.success) return;

        const storedKeys = JSON.parse(localStorage.getItem("notif_followup_keys") || "{}");
        const now = Date.now();

        // Hapus notifikasi yang lebih dari 24 jam
        Object.keys(storedKeys).forEach((key) => {
          const saved = new Date(storedKeys[key]);
          if (now - saved > 24 * 60 * 60 * 1000) {
            delete storedKeys[key];
          }
        });

        json.data.forEach((item) => {
          if (item.catatan_pasien && !item.catatan_dokter) {
            const key = `followup-${item.id}`;
            if (!storedKeys[key]) {
              toast.info(`📌 Follow up catatan pasien: ${item.nama_lengkap || "Pasien"} (${item.tanggal_gejala})`, {
                onClick: () => navigate("/doctor-patient-symptoms"),
                toastId: key,
              });
              storedKeys[key] = new Date().toISOString();
            }
          }
        });

        localStorage.setItem("notif_followup_keys", JSON.stringify(storedKeys));
      } catch (err) {
        console.error("Gagal fetch catatan pasien untuk notifikasi dokter:", err);
      }
    };

    fetchCatatanPasien();
  }, [navigate]);

    useEffect(() => {
      const checkUpdatedAppointments = async () => {
        try {
          const token = sessionStorage.getItem("auth_token");
          const nama_dokter = sessionStorage.getItem("nama_lengkap");
          const res = await fetch("/api/Appointment", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const json = await res.json();
          if (!json.success) return;

          const storedStatus = JSON.parse(localStorage.getItem("doctorAppointmentStatus") || "{}");
          const updatedStatus = {};

          json.data.forEach((item) => {
            if (item.nama_dokter === nama_dokter) {
              const key = `appointment-${item.id}`;
              const currentStatus = item.status?.toLowerCase();

              // Deteksi jika sebelumnya "request" tapi sekarang bukan
              if (
                (!storedStatus[key] && currentStatus !== "request") || // perubahan langsung
                (storedStatus[key] && storedStatus[key].toLowerCase() === "request" && currentStatus !== "request")
              ) {
                toast.info(`📣 Status janji temu diubah menjadi "${item.status}"`, {
                  onClick: () => navigate("/doctor-appointments"),
                  toastId: key,
                  autoClose: 6000,
                  position: "top-right",
                  theme: "colored",
                });
              }

              // Simpan status terbaru
              updatedStatus[key] = item.status;
            }
          });

          localStorage.setItem("doctorAppointmentStatus", JSON.stringify(updatedStatus));
        } catch (err) {
          console.error("Gagal cek pembaruan status janji temu:", err);
        }
      };

      checkUpdatedAppointments();
    }, [navigate]);


  const menuItems = [
    { src: "/assets/common/lifesavers.svg", alt: "Overview", label: "Overview", route: "/overview" },
    { src: "/assets/common/lifesavers-caretaking.svg", alt: "Data Pasien", label: "Data Pasien", route: "/profile-patient-doctor" },
    { src: "/assets/common/stomach.svg", alt: "Gejala Pasien", label: "Gejala Pasien", route: "/doctor-patient-symptoms" },
    { src: "/assets/common/videocall.svg", alt: "Janji Temu", label: "Janji Temu", route: "/doctor-appointments" },
  ];

  const navItems = [
    { label: "Pengaturan", route: "/settings", className: styles.settingsButton },
    { label: "Keluar", route: "/logout", className: styles.logoutButton },
  ];

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
              const token = sessionStorage.getItem("auth_token");

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
              navigate("/", { replace: true });
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
