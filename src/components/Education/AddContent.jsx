import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddContent.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AddContent = () => {
  const [contentType, setContentType] = useState("video"); // "video" atau "artikel"
  const [contentTitle, setContentTitle] = useState("");
  const [contentFile, setContentFile] = useState(null);
  const [contentText, setContentText] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setContentFile(e.target.files[0]);
  };

  const handleContentSubmit = async () => {
    if (!contentTitle || (contentType === "video" && !contentFile) || (contentType === "artikel" && !contentText)) {
      toast.error("Mohon lengkapi semua kolom sebelum submit.");
      return;
    }

    const result = await Swal.fire({
      title: "Yakin ingin menyimpan konten ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const dataToSend = {
      judul: contentTitle,
      sumber: contentType,
      embed: contentType === "video" ? contentFile?.name || "namavideo.mp4" : contentText,
    };

    try {
      const res = await axios.post("https://api.sahabatbmeitb.my.id/Content/store", dataToSend);
      toast.success("Konten berhasil ditambahkan!");
      navigate("/admin-education/content-list");
    } catch (error) {
      console.error("Gagal menambahkan konten:", error);
      toast.error("Gagal menambahkan konten.");
    }
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

      {/* <button onClick={handleContentSubmit}>Submit Konten</button> */}
      <div className={styles.buttonContainer}>
        <button className={styles.submitButton} onClick={handleContentSubmit}>
          Submit Konten
        </button>
      </div>

      <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>


      {/* <div className={styles.footerButtons}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          Kembali
        </button>
        <button className={styles.logoutButton}>Keluar</button>
      </div> */}
    </div>
  );
};

export default AddContent;
