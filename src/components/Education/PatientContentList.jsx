import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ContentList.Patient.module.css";
import { useNavigate } from "react-router-dom";

const PatientContentList = () => {
  const [contents, setContents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await axios.get("/api/Content");
      setContents(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data konten:", error);
    }
  };

  // Fungsi untuk ekstrak src dari embed iframe
  const extractIframeSrc = (htmlString) => {
    const match = htmlString.match(/src="([^"]+)"/);
    return match ? match[1] : "#";
  };

  return (
    <div className={styles.container}>
      <h1>📚 Konten Edukasi Pasien</h1>

      <div className={styles.cardGrid}>
        {contents.map((item) => (
          <div key={item.id} className={styles.card}>
            <h3 className={styles.title}>{item.judul}</h3>
            <p className={styles.source}>Sumber: {item.sumber}</p>

            {/* Tampilkan iframe jika embed HTML */}
            {item.embed?.includes("<iframe") && (
              <div
                className={styles.embedContainer}
                dangerouslySetInnerHTML={{ __html: item.embed }}
              />
            )}

            {/* Tampilkan tombol/link "Kunjungi Konten" */}
            <a
              href={
                item.embed?.includes("<iframe")
                  ? extractIframeSrc(item.embed)
                  : item.embed
              }
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              🔗 Kunjungi Konten
            </a>
          </div>
        ))}
      </div>

      {/* <div className={styles.footerButtons}>
        <button onClick={() => navigate("/guardian-education")}>
          ⬅ Kembali
        </button>
      </div> */}
    </div>
  );
};

export default PatientContentList;
