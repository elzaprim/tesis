import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import styles from "./DoctorAppointment.module.css";
import { getImageUrl } from "../../utils";

const DoctorAppointment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  
  const today = new Date().toLocaleDateString("en-CA");

  const appointments = [
    { name: "Lupinus", diagnosis: "Leukimia", treatment: "Kemoterapi -1", date: "2024-12-27" },
    { name: "Plumeria", diagnosis: "Leukimia", treatment: "Kemoterapi -2", date: "2024-12-27" },
    { name: "Peony", diagnosis: "Limfoma", treatment: "Kemoterapi -1", date: "2024-12-26" },
    { name: "Wisteria", diagnosis: "Leukimia", treatment: "Radioterapi -1", date: "2024-12-27" },
    { name: "Magnolia", diagnosis: "Kanker Otak", treatment: "Radioterapi -2", date: "2024-12-25" },
    { name: "Rose", diagnosis: "Leukimia", treatment: "Kemoterapi -3", date: "2024-12-27" },
  ];

  const filteredAppointments = appointments.filter((appointment) => {
    const isToday = appointment.date === today;
    const isDateMatch = filterDate ? appointment.date === filterDate : true;
    if (!isToday && !isDateMatch) return false;
    if (searchTerm === "") return true;
    if (filterType === "name") {
      return appointment.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (filterType === "diagnosis") {
      return appointment.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const navigate = useNavigate();

  const handleRescheduleClick = (appointment) => {
    navigate(`/reschedule/${appointment.name}`, { state: { appointment } }); // Pass appointment data to the reschedule page
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Janji Temu</h1>
      </header>
      
      <section className={styles.searchSection}>
        <h2>Janji Temu Hari ini: {today}</h2>
        <div className={styles.filterSection}>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className={styles.datePicker}
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.dropdown}
          >
            <option value="">Tampilkan semua</option>
            <option value="name">Filter Nama</option>
            <option value="diagnosis">Filter Diagnosis</option>
          </select>
          
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Cari"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
              <img src={getImageUrl("icon/search.svg")} alt="Search" />
            </button>
          </div>
        </div>
      </section>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nama Pasien</th>
            <th>Diagnosis</th>
            <th>Perawatan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment, index) => (
              <tr key={index}>
                <td>{appointment.name}</td>
                <td>{appointment.diagnosis}</td>
                <td>{appointment.treatment}</td>
                <td>
                  <button
                    className={styles.rescheduleButton}
                    onClick={() => handleRescheduleClick(appointment)}
                  >
                    Reschedule
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className={styles.noData}>
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.footerButtons}>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          Kembali
        </button>
        <button className={styles.logoutButton}>Keluar</button>
      </div>
    </div>
  );
};

export default DoctorAppointment;
