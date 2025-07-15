import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EditContent.module.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const EditContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const content = location.state;

  const [judul, setJudul] = useState(content.judul || "");
  const [sumber, setSumber] = useState(content.sumber || "video");
  const [embed, setEmbed] = useState(content.embed || "");

  const handleUpdate = async () => {
    if (!judul || !sumber || !embed) {
      toast.error("Mohon lengkapi semua kolom sebelum update.");
      return;
    }

    const result = await Swal.fire({
      title: "Yakin ingin memperbarui konten ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, simpan perubahan",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(`https://api.sahabatbmeitb.my.id/Content/update/${content.id}`, {
        judul,
        sumber,
        embed,
      });

      toast.success("Konten berhasil diperbarui!");
      navigate("/admin-education/content-list");
    } catch (error) {
      console.error("Gagal update konten:", error);
      toast.error("Gagal memperbarui konten.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Edit Konten</h1>

      <label>Judul</label>
      <input
        type="text"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
        placeholder="Masukkan judul konten"
      />

      <label>Sumber</label>
      <select value={sumber} onChange={(e) => setSumber(e.target.value)}>
        <option value="video">Video</option>
        <option value="artikel">Artikel</option>
      </select>

      <label>{sumber === "video" ? "Nama File Video" : "Isi Artikel / Link"}</label>
      <input
        type="text"
        value={embed}
        onChange={(e) => setEmbed(e.target.value)}
        placeholder={
          sumber === "video" ? "Contoh: edukasi.mp4" : "Contoh: https://artikel.com/..."
        }
      />

      <div className={styles.buttonGroup}>
        <button className={styles.saveButton} onClick={handleUpdate}>
          Update Konten
        </button>
        <button className={styles.cancelButton} onClick={() => navigate("/admin-education/content-list")}>
          Batal
        </button>
      </div>
          
      <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>
    
    </div>
  );
};

export default EditContent;
