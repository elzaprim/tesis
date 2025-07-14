import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ContentList.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ContentList = () => {
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
      toast.error("Gagal memuat konten edukasi.");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus konten ini?",
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.get(`/api/Content/delete/${id}`);
        toast.success("Konten berhasil dihapus");
        fetchContents();
      } catch (error) {
        console.error("Gagal menghapus konten:", error);
        toast.error("Gagal menghapus konten");
      }
    }
  };

  const handleEdit = async (content) => {
    const result = await Swal.fire({
      title: "Edit Konten?",
      text: "Anda akan diarahkan ke halaman edit konten.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6c948c",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Lanjutkan",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      navigate("/admin-education/edit-content", { state: content });
    }
  };

  return (
    <div className={styles.container}>
      <h1>Daftar Konten Edukasi</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Judul</th>
            <th>Sumber</th>
            <th>Embed</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((item) => (
            <tr key={item.id}>
              <td>{item.judul}</td>
              <td>{item.sumber}</td>
              <td>
                {item.embed?.includes("<iframe") ? (
                  <div dangerouslySetInnerHTML={{ __html: item.embed }} />
                ) : (
                  <a
                    href={item.embed}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.embed}
                  </a>
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <div className={styles.footerButtons}>
        <button onClick={() => navigate("/admin-education")}>Kembali</button>
      </div> */}
    </div>
  );
};

export default ContentList;
