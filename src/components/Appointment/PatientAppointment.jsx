import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import styles from "./PatientAppointment.module.css";
import { toast } from "react-toastify";


const API_BASE = "https://api.sahabatbmeitb.my.id";

const PatientAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noRekamMedis, setNoRekamMedis] = useState("");

  const navigate = useNavigate();
  const nik = sessionStorage.getItem("nik");
  

  // Ambil no_rekam_medis berdasarkan nik
  useEffect(() => {
    const fetchRekamMedis = async () => {
      try {
        const res = await fetch(`${API_BASE}/Patient/${nik}`);
        const json = await res.json();
        if (res.ok && json.success) {
          const data = Array.isArray(json.data) ? json.data[0] : json.data;
          setNoRekamMedis(data.no_rekam_medis);
        }
      } catch (err) {
        console.error("Gagal fetch pasien:", err);
      }
    };

    if (nik) fetchRekamMedis();
  }, [nik]);

  // Fetch jadwal janji temu
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!noRekamMedis) return;

      try {
        const res = await fetch(`${API_BASE}/Appointment/${noRekamMedis}`);
        const json = await res.json();

        if (res.ok && json.success) {
          const data = Array.isArray(json.data) ? json.data : [json.data];
          // setAppointments(data);

          // Filter hanya yang disetujui
          const approved = data.filter((item) => item.status?.toLowerCase() === "disetujui");
          setAppointments(approved);


          // Notifikasi jika ada H-3 atau H-1
          data.forEach((appt) => {
            const tanggal = new Date(appt.tanggal).toLocaleDateString("id-ID");
            if (isTodayNear(appt.tanggal, 3)) {
              toast.info(`📅 Janji temu Anda H-3: ${tanggal} - ${appt.catatan || "Tidak ada catatan."}`);
            }
            if (isTodayNear(appt.tanggal, 1)) {
              toast.info(`⏰ Janji temu Anda H-1: ${tanggal} - ${appt.catatan || "Tidak ada catatan."}`);
            }
          });
        }
      } catch (err) {
        console.error("Gagal fetch appointment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [noRekamMedis]);

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setSelectedDate(new Date(activeStartDate));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getStartOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const getEndOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const isTodayNear = (dateStr, daysBefore) => {
    const target = new Date(dateStr);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diff = (target - today) / (1000 * 60 * 60 * 24);
    return diff === daysBefore;
  };

  const notesForMonth = appointments.filter((appt) => {
    const apptDate = new Date(appt.tanggal);
    return apptDate >= getStartOfMonth(selectedDate) && apptDate <= getEndOfMonth(selectedDate);
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Jadwal Janji Temu</h1>

      
      <div className={styles.calendarWrapper}>
        <Calendar
          onChange={handleDateChange}
          onActiveStartDateChange={handleActiveStartDateChange}
          value={selectedDate}
        />
      </div>

      <div className={styles.notesContainer}>
        <h2 className={styles.notesTitle}>Janji Temu Bulan Ini:</h2>

        {loading ? (
          <p>Memuat jadwal...</p>
        ) : notesForMonth.length > 0 ? (
          <ul className={styles.notesList}>
            {notesForMonth
              .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)) // urutkan terbaru
              .map((appt, idx) => (
                <li key={idx} className={styles.noteItem}>
                  {new Date(appt.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  - {appt.keterangan || appt.catatan || "Tidak ada catatan."}
                  {isTodayNear(appt.tanggal, 3) && <span className={styles.tagH3}> (H-3)</span>}
                  {isTodayNear(appt.tanggal, 1) && <span className={styles.tagH1}> (H-1)</span>}
                </li>
              ))}
          </ul>
        ) : (
          <p className={styles.noNotes}>Tidak ada janji temu bulan ini.</p>
        )}
      </div>


      {/* <div className={styles.footerButtons}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          Kembali
        </button>
        <button
          className={styles.logoutButton}
          onClick={() => {
            sessionStorage.clear();
            navigate("/login");
          }}
        >
          Keluar
        </button>
      </div> */}
       <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>
        
    </div>
  );
};

export default PatientAppointment;
