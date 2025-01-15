import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ProfilePatientDetail.module.css";

const ProfilePatientDetail = () => {
  const { patientId } = useParams(); // Get patientId from the URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patientId) {
      axios.get(`https://jsonplaceholder.typicode.com/users/${patientId}`)
        .then(response => {
          setPatient(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
    }
  }, [patientId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const renderDetails = (data, prefix = '') => {
    return Object.entries(data).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={key}>
            <strong>{prefix + key}:</strong>
            {renderDetails(value, `${prefix}${key}.`)}
          </div>
        );
      }
      return (
        <p key={key}>
          <strong>{prefix + key}:</strong> {value}
        </p>
      );
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Detail Pasien</h2>
      </header>

      <div className={styles.patientDetail}>
        {renderDetails(patient)}
      </div>

      <button className={styles.backButton} onClick={() => window.history.back()}>
        Kembali ke Tabel
      </button>
    </div>
  );
};

export default ProfilePatientDetail;
