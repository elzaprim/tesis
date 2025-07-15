import React, { useState, useEffect } from "react";
import styles from "./PatientSymptoms.module.css";
import { useNavigate } from "react-router-dom";


const API_BASE = "https://api.sahabatbmeitb.my.id";

const symptomCategories = {
  Mulut: ["Mulut kering", "Sulit menelan", "Luka pada mulut/ tenggorokan", "Perubahan kualitas suara", "Suara serak", "Sakit tenggorokan"],
  Pencernaan: ["Perubahan rasa pada lidah/mulut", "Nafsu makan menurun", "Mual", "Muntah", "Rasa panas di dada", "Gangguan saat buang angin/sendawa", "Perut kembung", "Cegukan", "Sembelit", "Diare", "Nyeri perut", "Tidak bisa menahan BAB"],
  Pernapasan: ["Sesak napas", "Batuk", "Napas berbunyi", "Bersin"],
  Jantung: ["Pembengkakan di dada", "Jantung berdebar"],
  Kulit: ["Kulit kering", "Jerawat", "Rambut rontok", "Gatal", "Ruam", "Sensitif terhadap sinar matahari", "Luka terbuka pada kulit"],
  Saraf: ["Mati rasa & kesemutan", "Pusing"],
  Penglihatan: ["Penglihatan kabur", "Kilatan cahaya", "Mata berair", "Telinga berdenging", "Mata kering"],
  "Konsentrasi/ Ingatan": ["Tidak Bisa berkonsentrasi", "Daya ingat melemah"],
  Nyeri: ["Nyeri umum", "Sakit kepala", "Nyeri otot", "Nyeri sendi"],
  "Tidur/ Bangun": ["Susah tidur", "Kelelahan"],
  "Suasana Hati": ["Cemas", "Sedih", "Pikiran ingin bunuh diri"],
  "Kemih & Reproduksi": ["Nyeri saat buang air kecil", "Dorongan mendesak untuk buang air kecil", "Frekuensi buang air kecil meningkat", "Perubahan warna urin", "Tidak bisa menahan kencing"],
  "Lain-lain": ["Memar", "Menggigil", "Berkeringat berlebihan", "Rasa panas mendadak", "Mimisan", "Jatuh", "Lemah otot", "Gelisah"],
};

const PatientSymptoms = () => {
  const nik = sessionStorage.getItem("nik");
  const [noRekamMedis, setNoRekamMedis] = useState(sessionStorage.getItem("no_rekam_medis") || "");
  const [namaLengkap, setNamaLengkap] = useState(sessionStorage.getItem("nama_lengkap") || "");
  const [noRegistrasi, setNoRegistrasi] = useState(sessionStorage.getItem("no_registrasi") || "");

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [symptomsList, setSymptomsList] = useState([]);
  const [existingSymptoms, setExistingSymptoms] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`${API_BASE}/Patient/${nik}`);
        const json = await res.json();
        if (json.success) {
          const data = Array.isArray(json.data) ? json.data[0] : json.data;
          sessionStorage.setItem("no_rekam_medis", data.no_rekam_medis);
          sessionStorage.setItem("nama_lengkap", data.nama_lengkap);
          sessionStorage.setItem("no_registrasi", data.no_registrasi || "");

          setNoRekamMedis(data.no_rekam_medis);
          setNamaLengkap(data.nama_lengkap);
          setNoRegistrasi(data.no_registrasi || "");
        } else {
          console.warn("Data pasien tidak ditemukan");
        }
      } catch (err) {
        console.error("Gagal fetch pasien:", err);
      }
    };

    if (nik && (!noRekamMedis || !namaLengkap || !noRegistrasi)) {
      fetchPatient();
    }
  }, [nik]);

  // Fetch symptoms from DB
  useEffect(() => {
    if (noRekamMedis) {
      fetch(`${API_BASE}/Symptom/${noRekamMedis}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setExistingSymptoms(data.data || []);
          }
        })
        .catch(err => console.error("Gagal fetch gejala:", err));
    }
  }, [noRekamMedis]);

  // Update filteredSymptoms when selectedDate or existingSymptoms change
  useEffect(() => {
    const matched = existingSymptoms.filter(item => item.tanggal_gejala === selectedDate);
    setFilteredSymptoms(matched);
  }, [existingSymptoms, selectedDate]);

  const handleRemove = (symptom) => {
    setSymptomsList(prev => prev.filter(s => s !== symptom));
  };

  // const handleDelete = async (id, no_rekam_medis) => {
  //   try {
  //     await fetch(`${API_BASE}/Symptom/delete/${no_rekam_medis}`, { method: "DELETE" });
  //     setExistingSymptoms(prev => prev.filter(item => item.id !== id));
  //   } catch (err) {
  //     console.error("Gagal hapus gejala:", err);
  //   }
  // };

  const handleDelete = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/Symptom/delete/${id}`);
    const data = await res.json();
    if (res.ok && data.success) {
      setExistingSymptoms(prev => prev.filter(item => item.id !== id));
    } else {
      console.error("Gagal hapus gejala:", data.message || data);
    }
  } catch (err) {
    console.error("Gagal hapus gejala:", err);
  }
};


  const handleSave = async () => {
    if (
      !namaLengkap?.trim() ||
      !noRekamMedis?.trim() ||
      !noRegistrasi?.trim() ||
      !selectedDate?.trim() ||
      symptomsList.length === 0
    ) {
      alert("Harap lengkapi semua data sebelum menyimpan.");
      return;
    }

    const payload = {
      nama_lengkap: namaLengkap.trim(),
      no_rekam_medis: noRekamMedis.trim(),
      no_registrasi: noRegistrasi.trim(),
      gejala: symptomsList.join(", "),
      tanggal_gejala: selectedDate,
    };

    try {
      const res = await fetch(`${API_BASE}/Symptom/store`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setShowSuccess(true);
        setSymptomsList([]);
        setTimeout(() => setShowSuccess(false), 2000);

        const getRes = await fetch(`${API_BASE}/Symptom/${noRekamMedis}`);
        const getData = await getRes.json();
        if (getData.success) setExistingSymptoms(getData.data || []);
      } else {
        console.error("Simpan gagal:", result);
      }
    } catch (err) {
      console.error("Gagal simpan gejala:", err);
    }
  };

  return (
    <div className={styles.patientSymptoms}>
      <h1 className={styles.title}>📝 Gejala Pasien</h1>

      <div className={styles.dateSection}>
        <label>Tanggal:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className={styles.dropdownSection}>
        <label>Kategori Gejala:</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
          }}
        >
          <option value="">-- Pilih Kategori --</option>
          {Object.keys(symptomCategories).map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div className={styles.checkboxSection}>
          <label>Pilih Gejala:</label>
          <div className={styles.checkboxList}>
            {symptomCategories[selectedCategory].map((symptom, idx) => (
              <label key={idx}>
                <input
                  type="checkbox"
                  value={symptom}
                  checked={symptomsList.includes(symptom)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      setSymptomsList(prev => [...prev, symptom]);
                    } else {
                      setSymptomsList(prev => prev.filter(s => s !== symptom));
                    }
                  }}
                />
                {symptom}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className={styles.selectedSymptoms}>
        <h3>Pilih Gejala:</h3>
        <ul>
          {symptomsList.map((s, i) => (
            <li key={i}>
              {s} <button onClick={() => handleRemove(s)}>Hapus</button>
            </li>
          ))}
        </ul>
      </div>


      <button onClick={handleSave} className={styles.saveButton}>Simpan</button>
      {showSuccess && <p className={styles.successMessage}>Berhasil disimpan!</p>}

      <div className={styles.summarySection}>
        <h3>Gejala pada Tanggal {selectedDate}:</h3>
        {filteredSymptoms.length > 0 ? (
          <ul className={styles.summaryList}>
            {filteredSymptoms.map((item, idx) => {
              const gejalaArray = item.gejala.split(',').map(g => g.trim());
              return (
                <li key={idx} className={styles.summaryItem}>
                  <div className={styles.leftContent}>
                    <strong>
                      📅{" "}
                      {new Date(item.tanggal_gejala).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>
                    <ul className={styles.gejalaList}>
                      {gejalaArray.map((g, i) => (
                        <li key={i}>🩺 {g}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.rightAction}>
                    <button
                      className={styles.removeButton}
                      // onClick={() => handleDelete(item.id, item.no_rekam_medis)}
                      onClick={() => handleDelete(item.id)}

                    >
                      Hapus
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Tidak ada gejala untuk tanggal ini.</p>
        )}
      </div>

      <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>

    </div>
  );
};

export default PatientSymptoms;
