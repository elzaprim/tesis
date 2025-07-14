import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./PatientAdd.module.css";

const API_BASE_URL = "/api";

const initialFormState = {
  nama_lengkap: "",
  no_registrasi: "",
  no_rekam_medis: "",
  nik: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: "",
  usia_terdiagnosis: "",
  alamat: "",
  propinsi: "",
  kabupaten: "",
  kecamatan: "",
  desa: "",
  no_hp: "",
  no_hp2: "",
  no_bpjs: "",
  bb: "",
  tb: "",
  kesimpulan: ""
};

const PatientAdd = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/Patient/store`, formData, {
        headers: { "Content-Type": "application/json" }
      });
      if (response.data?.success) {
        alert("Pasien berhasil ditambahkan.");
        navigate("/profile-patient");
      } else {
        alert("Gagal menambahkan pasien.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Tambah Data Pasien</h1>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <div className={styles.formGrid}>
          <input name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} placeholder="Nama Lengkap" required />
          <input name="no_registrasi" value={formData.no_registrasi} onChange={handleChange} placeholder="No Registrasi" />
          <input name="no_rekam_medis" value={formData.no_rekam_medis} onChange={handleChange} placeholder="No Rekam Medis" />
          <input name="nik" value={formData.nik} onChange={handleChange} placeholder="NIK" />
          <input name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} placeholder="Tempat Lahir" />
          <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} placeholder="Tanggal Lahir" />
          <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange}>
            <option value="">Pilih Jenis Kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          <input name="usia_terdiagnosis" value={formData.usia_terdiagnosis} onChange={handleChange} placeholder="Usia Terdiagnosis" />
          <input name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Alamat" />
          <input name="propinsi" value={formData.propinsi} onChange={handleChange} placeholder="Propinsi" />
          <input name="kabupaten" value={formData.kabupaten} onChange={handleChange} placeholder="Kabupaten" />
          <input name="kecamatan" value={formData.kecamatan} onChange={handleChange} placeholder="Kecamatan" />
          <input name="desa" value={formData.desa} onChange={handleChange} placeholder="Desa" />
          <input name="no_hp" value={formData.no_hp} onChange={handleChange} placeholder="No HP" />
          <input name="no_hp2" value={formData.no_hp2} onChange={handleChange} placeholder="No HP Cadangan" />
          <input name="no_bpjs" value={formData.no_bpjs} onChange={handleChange} placeholder="No BPJS" />
          <input name="bb" value={formData.bb} onChange={handleChange} placeholder="Berat Badan (kg)" />
          <input name="tb" value={formData.tb} onChange={handleChange} placeholder="Tinggi Badan (cm)" />
          <input name="kesimpulan" value={formData.kesimpulan} onChange={handleChange} placeholder="Kesimpulan" />
        </div>

        <button type="submit" className={styles.submitButton} disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
};

export default PatientAdd;
