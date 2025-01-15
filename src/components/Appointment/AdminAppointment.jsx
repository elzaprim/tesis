import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminAppointment.module.css"; // Import file CSS

const AdminAppointment = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([
    { id: 1, name: "Lupinus", diagnosis: "Leukimia", date: "2024-12-27", reschedule: "Tidak Ada" },
    { id: 2, name: "Peony", diagnosis: "Limfoma", date: "2024-12-26", reschedule: "Ada" },
    { id: 3, name: "Rose", diagnosis: "Leukimia", date: "2024-12-27", reschedule: "Tidak Ada" },
  ]);

  const [filteredAppointments, setFilteredAppointments] = useState(appointments);
  const [filter, setFilter] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [selectedRow, setSelectedRow] = useState(null); // State for selected row

  const handleRowClick = (appointment) => {
    if (selectedRow === appointment.id) {
      setSelectedRow(null); // Deselect the row if clicked again
    } else {
      setSelectedRow(appointment.id); // Select the row
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    const filtered = appointments.filter((appointment) =>
      value ? appointment.reschedule === value : true
    );
    setFilteredAppointments(filtered);
  };

  const handleApprove = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleReject = (id) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === id ? { ...appointment, reschedule: "Ditolak" } : appointment
    );
    setAppointments(updatedAppointments);
    setFilteredAppointments(updatedAppointments);
    updateNotifications(`Janji temu pasien dengan ID ${id} telah ditolak.`);
  };

  const handleModalSubmit = () => {
    if (!newDate) {
      alert("Tanggal baru harus diisi untuk menyetujui janji temu.");
      return;
    }

    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === selectedAppointment.id
        ? { ...appointment, reschedule: "Disetujui", date: newDate }
        : appointment
    );
    setAppointments(updatedAppointments);
    setFilteredAppointments(updatedAppointments);
    updateNotifications(
      `Janji temu pasien ${selectedAppointment.name} telah dijadwalkan ulang ke tanggal ${newDate}.`
    );
    setShowModal(false);
    setNewDate("");
  };

  const updateNotifications = (message) => {
    const newNotifications = [...notifications, { id: Date.now(), message }];
    setNotifications(newNotifications);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Janji Temu Admin</h1>
      </header>

      <section className={styles.filterSection}>
        <label>Filter Reschedule:</label>
        <select value={filter} onChange={handleFilterChange}>
          <option value="">Semua</option>
          <option value="Ada">Ada</option>
          <option value="Tidak Ada">Tidak Ada</option>
        </select>
      </section>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nama Pasien</th>
            <th>Diagnosis</th>
            <th>Tanggal</th>
            <th>Reschedule</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <tr
                key={appointment.id}
                className={selectedRow === appointment.id ? styles.selected : ""}
                onClick={() => handleRowClick(appointment)} // Handle row click
              >
                <td>{appointment.name}</td>
                <td>{appointment.diagnosis}</td>
                <td>{appointment.date}</td>
                <td>{appointment.reschedule}</td>
                <td>
                  {appointment.reschedule === "Ada" && (
                    <div className={styles.actionButtonContainer}>
                      <button
                        className={`${styles.actionButton} ${styles.approveButton}`}
                        onClick={() => handleApprove(appointment)}
                      >
                        Setujui
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.rejectButton}`}
                        onClick={() => handleReject(appointment.id)}
                      >
                        Tolak
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className={styles.noData}>
                Tidak ada janji temu.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <section className={styles.notificationSection}>
        <h2>Notifikasi</h2>
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>{notification.message}</li>
          ))}
        </ul>
      </section>

      <div className={styles.footerButtons}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          Kembali
        </button>
        <button className={styles.logoutButton} onClick={() => navigate("/logout")}>
          Keluar
        </button>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Pilih Tanggal Baru</h3>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button
                className={styles.submitButton}
                onClick={handleModalSubmit}
                disabled={!newDate}
              >
                Submit
              </button>
              <button className={styles.cancelButton} onClick={() => setShowModal(false)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointment;
