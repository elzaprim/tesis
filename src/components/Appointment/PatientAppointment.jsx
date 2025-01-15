import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import styles from "./PatientAppointment.module.css";

const PatientAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([
    { date: "2024-12-25", note: "Check-up rutin dengan Dr. Amanda" },
    { date: "2024-12-30", note: "Tes darah dan konsultasi hasil" },
    { date: "2024-12-05", note: "Kontrol setelah operasi" },
    { date: "2024-12-15", note: "Pemeriksaan umum" },
  ]);

  const navigate = useNavigate();

  // Fungsi untuk menangani perubahan bulan/tahun
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setSelectedDate(new Date(activeStartDate)); // Set ke awal bulan aktif
  };

  // Fungsi untuk menangani perubahan tanggal
  const handleDateChange = (date) => {
    setSelectedDate(date); // Update selectedDate saat memilih tanggal
  };

  const handleBackToDashboard = () => {
    navigate("/guardian-dashboard");
  };

  const getStartOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getEndOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // Filter janji temu untuk bulan yang dipilih
  const notesForMonth = appointments.filter((appt) => {
    const appointmentDate = new Date(appt.date);
    return (
      appointmentDate >= getStartOfMonth(selectedDate) &&
      appointmentDate <= getEndOfMonth(selectedDate)
    );
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Jadwal Janji Temu</h1>

      <div className={styles.calendarContainer}>
        <Calendar
          onChange={handleDateChange} // Saat tanggal dipilih
          onActiveStartDateChange={handleActiveStartDateChange} // Saat bulan/tahun berubah
          value={selectedDate} // Tanggal yang dipilih
        />
      </div>

      <div className={styles.notesContainer}>
        <h2 className={styles.notesTitle}>
          Catatan untuk Bulan{" "}
          {selectedDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        {notesForMonth.length > 0 ? (
          <ul className={styles.notesList}>
            {notesForMonth.map((appt, index) => (
              <li key={index} className={styles.noteItem}>
                {appt.date} : {appt.note}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noNotes}>Tidak ada janji temu untuk bulan ini.</p>
        )}
      </div>


      {/* Tombol di bawah */}
      <div className={styles.footerButtons}>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          Kembali
        </button>
        <button className={styles.logoutButton}>Keluar</button>
      </div>
    </div>
  );
};    

export default PatientAppointment;
