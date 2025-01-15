import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddContent.module.css";

const AddContent = () => {
  const [contentType, setContentType] = useState("video"); // video atau artikel
  const [contentTitle, setContentTitle] = useState("");
  const [contentFile, setContentFile] = useState(null);
  const [contentText, setContentText] = useState("");

  const handleFileChange = (e) => {
    setContentFile(e.target.files[0]);
  };

  const handleContentSubmit = () => {
    // Logika untuk mengirimkan konten baru ke server atau database
    console.log({
      title: contentTitle,
      type: contentType,
      file: contentFile,
      text: contentText,
    });
  };

  return (
    <div className={styles.container}>
      <h1>Tambah Konten Baru</h1>
      <label>Judul Konten</label>
      <input
        type="text"
        value={contentTitle}
        onChange={(e) => setContentTitle(e.target.value)}
        placeholder="Masukkan judul konten"
      />

      <div className={styles.contentTypeSelector}>
        <label>
          <input
            type="radio"
            value="video"
            checked={contentType === "video"}
            onChange={() => setContentType("video")}
          />
          Video Edukasi
        </label>
        <label>
          <input
            type="radio"
            value="artikel"
            checked={contentType === "artikel"}
            onChange={() => setContentType("artikel")}
          />
          Artikel
        </label>
      </div>

      {contentType === "video" ? (
        <div>
          <label>Upload Video</label>
          <input type="file" onChange={handleFileChange} accept="video/*" />
        </div>
      ) : (
        <div>
          <label>Konten Artikel</label>
          <textarea
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder="Tuliskan artikel di sini"
          />
        </div>
      )}

      <button onClick={handleContentSubmit}>Submit Konten</button>

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

export default AddContent;
