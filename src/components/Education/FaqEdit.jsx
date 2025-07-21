import React, { useEffect, useState } from "react";
import styles from "./FaqEdit.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const FaqEdit = () => {
  const [faqList, setFaqList] = useState([]);
  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Kelola FAQ";
    fetchFaqList();
  }, []);

  const fetchFaqList = async () => {
    try {
      const res = await axios.get("https://api.sahabatbmeitb.my.id/FAQ");
      setFaqList(res.data?.data || []);
    } catch (err) {
      console.error("Gagal memuat FAQ:", err);
      Swal.fire("Gagal", "Tidak dapat memuat FAQ.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pertanyaan.trim() || !jawaban.trim()) {
      Swal.fire("Oops!", "Pertanyaan dan jawaban wajib diisi.", "warning");
      return;
    }

    setLoading(true);

    try {
      if (editId) {
        await axios.put(`https://api.sahabatbmeitb.my.id/FAQ/update/${editId}`, {
          pertanyaan,
          jawaban,
        });
        Swal.fire("Berhasil", "FAQ berhasil diperbarui.", "success");
      } else {
        await axios.post("https://api.sahabatbmeitb.my.id/FAQ/store", {
          pertanyaan,
          jawaban,
        });
        Swal.fire("Berhasil", "FAQ berhasil ditambahkan.", "success");
      }

      setPertanyaan("");
      setJawaban("");
      setEditId(null);
      fetchFaqList();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Gagal menyimpan data FAQ.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus FAQ?",
      text: "Tindakan ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.get(`https://api.sahabatbmeitb.my.id/FAQ/delete/${id}`);
        Swal.fire("Terhapus!", "FAQ berhasil dihapus.", "success");
        fetchFaqList();
      } catch (err) {
        console.error("Gagal menghapus FAQ:", err);
        Swal.fire("Gagal", "Tidak dapat menghapus FAQ.", "error");
      }
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setPertanyaan(item.pertanyaan);
    setJawaban(item.jawaban);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pagination logic
  const totalPages = Math.ceil(faqList.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentFaqList = faqList.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Kelola FAQ</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Pertanyaan:
          <textarea
            className={styles.searchInput}
            rows={3}
            value={pertanyaan}
            onChange={(e) => setPertanyaan(e.target.value)}
            required
          />
        </label>

        <label>
          Jawaban:
          <textarea
            className={styles.searchInput}
            rows={5}
            value={jawaban}
            onChange={(e) => setJawaban(e.target.value)}
            required
          />
        </label>

        <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
          <button
            type="submit"
            className={styles.backButton}
            style={{
              backgroundColor: "var(--color-primary-2)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              fontWeight: "bold",
            }}
            disabled={loading}
          >
            {loading
              ? "Menyimpan..."
              : editId
              ? "Simpan Perubahan"
              : "Tambah FAQ"}
          </button>

          <button
            type="button"
            className={styles.backButton}
            onClick={() => {
              setPertanyaan("");
              setJawaban("");
              setEditId(null);
            }}
          >
            Batal
          </button>
        </div>
      </form>

      {/* List FAQ */}
      <ul className={styles.faqList}>
        {currentFaqList.map((item) => (
          <li key={item.id} className={styles.faqItem}>
            <strong>{item.pertanyaan}</strong>
            <p>{item.jawaban}</p>
            <div className={styles.actionButtons}>
              <button
                className={styles.editButton}
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(item.id)}
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>

        {totalPages > 1 && (
        <div style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px"
        }}>
            <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.backButton}
            style={{ padding: "10px 16px" }}
            >
            ‹
            </button>

            <span style={{ fontWeight: "bold", color: "var(--color-primary-2)" }}>
            Halaman {currentPage} dari {totalPages}
            </span>

            <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={styles.backButton}
            style={{ padding: "10px 16px" }}
            >
            ›
            </button>
        </div>
        )}

      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Kembali
      </button>
    </div>
  );
};

export default FaqEdit;
