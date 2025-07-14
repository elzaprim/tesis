import React, { useEffect, useState } from "react";
import styles from "./FaqEducation.module.css";
import axios from "axios";

const FaqEducation = () => {
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await axios.get("https://api.sahabatbmeitb.my.id/FAQ");
        if (res.data && res.data.data) {
          setFaqList(res.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil FAQ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, []);

  // Filter data berdasarkan keyword, jika ada
  const filteredFaqList = keyword
    ? faqList.filter((item) =>
        item.pertanyaan.toLowerCase().includes(keyword.toLowerCase())
      )
    : faqList;

  return (
    <div className={styles.container}>
      <h1>❓FAQ - Tanya Jawab</h1>

      <input
        type="text"
        placeholder="Cari pertanyaan..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className={styles.searchInput}
      />

      {loading ? (
        <p>Memuat FAQ...</p>
      ) : faqList.length === 0 ? (
        <p>Belum ada pertanyaan yang tersedia.</p>
      ) : filteredFaqList.length === 0 ? (
        <p>Tidak ada hasil untuk kata kunci "{keyword}".</p>
      ) : (
        <ul className={styles.faqList}>
          {filteredFaqList.map((item) => (
            <li key={item.id} className={styles.faqItem}>
              <strong>{item.pertanyaan}</strong>
              <p>{item.jawaban}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FaqEducation;
