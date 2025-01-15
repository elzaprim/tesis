// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import styles from "./ProfilePatient.module.css";

// function ProfilePatient() {
//   const [data, setData] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('https://jsonplaceholder.typicode.com/users')
//       .then(res => setData(res.data))
//       .catch(err => console.log(err));
//   }, []);

//   const handleDetailClick = (id) => {
//     navigate(`/patient-detail/${id}`);
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.mt3}>
//         <h1>Fetch Data from API</h1>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>City</th>
//               <th>Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             {
//               data.map((user, index) => (
//                 <tr key={index}>
//                   <td>{user.id}</td>
//                   <td>{user.name}</td>
//                   <td>{user.email}</td>
//                   <td>{user.address.city}</td>
//                   <td>
//                     <button className={styles.viewDetailsButton} onClick={() => handleDetailClick(user.id)}>
//                       Lihat Detail
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             }
//           </tbody>
//         </table>
//       </div>

//       <div className={styles.footerButtons}>
//         <button className={styles.backButton} onClick={() => window.history.back()}>
//           Kembali
//         </button>
//         <button className={styles.logoutButton}>Keluar</button>
//       </div>
//     </div>
//   );
// }

// export default ProfilePatient;

//Test 2 Cancer Registry

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import styles from "./ProfilePatient.module.css";

// function ProfilePatient() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('https://1df4-182-253-124-181.ngrok-free.app/profile')
//       .then(res => {
//         console.log("Respons API:", res);

//         // Cek status respons
//         if (res.status !== 200) {
//           setError(`API error: Status code ${res.status}`);
//           console.error(`API error: Status code ${res.status}`);
//           setLoading(false);
//           return;
//         }

//         // Cek apakah respons berisi data yang sesuai dengan struktur yang diinginkan
//         // Cek apakah konten yang diterima adalah JSON atau HTML
//         if (res.headers['content-type'] && res.headers['content-type'].includes('application/json')) {
//           if (res.data && res.data.data && Array.isArray(res.data.data)) {
//             setData(res.data.data.slice(0, 3)); // Ambil 3 ID pertama untuk pengujian
//             setLoading(false);
//           } else {
//             setError("Data tidak ditemukan atau struktur tidak sesuai");
//             console.error("Struktur data tidak sesuai:", res.data);
//             setLoading(false);
//           }
//         } else {
//           setError("Server mengirimkan HTML, bukan JSON");
//           console.error("Server mengirimkan HTML, bukan JSON:", res);
//           setLoading(false);
//         }
//       })
//       .catch(err => {
//         // Cek kesalahan pada permintaan
//         if (err.response) {
//           // Jika respons dari server ada (misalnya status 4xx atau 5xx)
//           setError(`Error saat memanggil API: ${err.response.status} - ${err.response.data}`);
//           console.error(`Error saat memanggil API: ${err.response.status} - ${err.response.data}`);
//         } else if (err.request) {
//           // Jika tidak ada respons dari server (misalnya masalah jaringan)
//           setError("Tidak ada respons dari server. Periksa koneksi internet.");
//           console.error("Tidak ada respons dari server:", err.request);
//         } else {
//           // Kesalahan lain (misalnya pengaturan request)
//           setError(`Kesalahan lainnya: ${err.message}`);
//           console.error(`Kesalahan lainnya: ${err.message}`);
//         }
//         setLoading(false);
//       });
//   }, []);

//   const handleDetailClick = (id) => {
//     navigate(`/patient-detail/${id}`);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.mt3}>
//         <h1>Fetch Data from API</h1>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             {
//               data.map((user) => (
//                 <tr key={user.id}>
//                   <td>{user.id}</td>
//                   <td>{user.nama_lengkap}</td>
//                   <td>
//                     <button className={styles.viewDetailsButton} onClick={() => handleDetailClick(user.id)}>
//                       Lihat Detail
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             }
//           </tbody>
//         </table>
//       </div>

//       <div className={styles.footerButtons}>
//         <button className={styles.backButton} onClick={() => window.history.back()}>
//           Kembali
//         </button>
//         <button className={styles.logoutButton}>Keluar</button>
//       </div>
//     </div>
//   );
// }


//Final Test
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import styles from "./ProfilePatient.module.css";

// function ProfilePatient() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('https://jsonplaceholder.typicode.com/users', {
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       }
//     })
//     .then(res => {
//       console.log("Respons API:", res); // Menampilkan seluruh respons API
//       console.log("Status Respons:", res.status); // Menampilkan status code respons
//       console.log("Headers Respons:", res.headers); // Menampilkan headers respons
//       console.log("Tipe Konten Respons:", res.headers['content-type']); // Menampilkan tipe konten respons
//       console.log("Data Respons:", res.data); // Menampilkan data respons

//       if (res.status !== 200) {
//         setError(`API error: Status code ${res.status}`);
//         console.error(`API error: Status code ${res.status}`);
//         setLoading(false);
//         return;
//       }

//       // Memastikan respons JSON
//       if (res.headers['content-type'].includes('application/json')) {
//         if (res.data && res.data.data && Array.isArray(res.data.data)) {
//           const validData = res.data.data.filter(item => item.id && item.nama_lengkap);
//           if (validData.length > 0) {
//             setData(validData.slice(0, 3)); 
//             setLoading(false);
//           } else {
//             setError("Data pasien tidak ditemukan atau tidak valid.");
//             console.error("Data pasien tidak ditemukan atau tidak valid:", res.data);
//             setLoading(false);
//           }
//         } else {
//           setError("Data tidak ditemukan atau struktur tidak sesuai.");
//           console.error("Struktur data tidak sesuai:", res.data);
//           setLoading(false);
//         }
//       } else {
//         setError("Respons bukan JSON.");
//         console.error("Respons bukan JSON:", res);
//         setLoading(false);
//       }
//     })
//     .catch(err => {
//       if (err.response) {
//         setError(`Error saat memanggil API: ${err.response.status} - ${err.response.data}`);
//         console.error(`Error saat memanggil API: ${err.response.status} - ${err.response.data}`);
//       } else if (err.request) {
//         setError("Tidak ada respons dari server. Periksa koneksi internet.");
//         console.error("Tidak ada respons dari server:", err.request);
//       } else {
//         setError(`Kesalahan lainnya: ${err.message}`);
//         console.error(`Kesalahan lainnya: ${err.message}`);
//       }
//       setLoading(false);
//     });
//   }, []);

//   const handleDetailClick = (id) => {
//     navigate(`/patient-detail/${id}`);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.mt3}>
//         <h1>Fetch Data from API</h1>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             {
//               data.map((user) => (
//                 <tr key={user.id}>
//                   <td>{user.id}</td>
//                   <td>{user.name}</td>
//                   <td>
//                     <button className={styles.viewDetailsButton} onClick={() => handleDetailClick(user.id)}>
//                       Lihat Detail
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             }
//           </tbody>
//         </table>
//       </div>

//       <div className={styles.footerButtons}>
//         <button className={styles.backButton} onClick={() => window.history.back()}>
//           Kembali
//         </button>
//         <button className={styles.logoutButton}>Keluar</button>
//       </div>
//     </div>
//   );
// }

// export default ProfilePatient;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import styles from "./ProfilePatient.module.css";

// function ProfilePatient() {
//   const [data, setData] = useState([]); // Menyimpan data pengguna
//   const [loading, setLoading] = useState(true); // Status loading
//   const [error, setError] = useState(null); // Menyimpan pesan error
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Mengambil data dari API
//     axios.get('https://pokeapi.co/api/v2/pokemon', {
//       headers: {
//         'Accept': 'application/json', // Mengatur header agar menerima JSON
//         'Content-Type': 'application/json' // Mengatur content type untuk menerima JSON
//       }
//     })
//     .then(res => {
//       console.log("Respons API:", res); // Menampilkan seluruh respons API

//       // Cek status respons
//       if (res.status !== 200) {
//         setError(`API error: Status code ${res.status}`);
//         console.error(`API error: Status code ${res.status}`);
//         setLoading(false);
//         return;
//       }

//       // Memastikan respons JSON
//       if (res.headers['content-type'].includes('application/json')) {
//         if (res.data && Array.isArray(res.data)) {
//           // Mengatur data sesuai dengan struktur respons
//           setData(res.data.slice(0, 3)); // Ambil 3 pengguna pertama untuk pengujian

//         // if (res.data && res.data.data) {
//         //   setData(res.data.data); // Menyimpan data pengguna          
//            setLoading(false);

//         } else {
//           setError("Data tidak ditemukan atau struktur tidak sesuai.");
//           console.error("Struktur data tidak sesuai:", res.data);
//           setLoading(false);
//         }
//       } else {
//         setError("Respons bukan JSON.");
//         console.error("Respons bukan JSON:", res);
//         setLoading(false);
//       }
//     })
//     .catch(err => {
//       // Menangani kesalahan saat pemanggilan API
//       if (err.response) {
//         setError(`Error saat memanggil API: ${err.response.status} - ${err.response.data}`);
//         console.error(`Error saat memanggil API: ${err.response.status} - ${err.response.data}`);
//       } else if (err.request) {
//         setError("Tidak ada respons dari server. Periksa koneksi internet.");
//         console.error("Tidak ada respons dari server:", err.request);
//       } else {
//         setError(`Kesalahan lainnya: ${err.message}`);
//         console.error(`Kesalahan lainnya: ${err.message}`);
//       }
//       setLoading(false);
//     });
//   }, []);

//   const handleDetailClick = (id) => {
//     navigate(`/patient-detail/${id}`);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.mt3}>
//         <h1>Fetch Data from API</h1>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             {
//               data.map((user) => (
//                 <tr key={user.name}>
//                   <td>{user.name}</td>
//                   <td>{user.url}</td>
//                   <td>
//                     <button className={styles.viewDetailsButton} onClick={() => handleDetailClick(user.id)}>
//                       Lihat Detail
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             }
//           </tbody>
//         </table>
//       </div>

//       <div className={styles.footerButtons}>
//         <button className={styles.backButton} onClick={() => window.history.back()}>
//           Kembali
//         </button>
//         <button className={styles.logoutButton}>Keluar</button>
//       </div>
//     </div>
//   );
// }

// export default ProfilePatient;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import styles from "./ProfilePatient.module.css";

// function ProfilePatient() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('https://pokeapi.co/api/v2/type') // Ganti dengan URL API yang sesuai
//     .then(res => {
//       console.log("Respons API:", res); // Menampilkan seluruh respons API
//       console.log("Status Respons:", res.status); // Menampilkan status code respons
//       console.log("Headers Respons:", res.headers); // Menampilkan headers respons
//       console.log("Tipe Konten Respons:", res.headers['content-type']); // Menampilkan tipe konten respons
//       console.log("Data Respons:", res.data); // Menampilkan data respons

//       if (res.status !== 200) {
//         setError(`API error: Status code ${res.status}`);
//         console.error(`API error: Status code ${res.status}`);
//         setLoading(false);
//         return;
//       }

//       // Memastikan respons JSON dan data valid
//       if (res.headers['content-type'].includes('application/json')) {
//         if (res.data.results && Array.isArray(res.data.results)) {
//           setData(res.data.results); // Menyimpan data Pokémon
//           setLoading(false);
//         } else {
//           setError("Data tidak ditemukan atau struktur tidak sesuai.");
//           console.error("Struktur data tidak sesuai:", res.data);
//           setLoading(false);
//         }
//       } else {
//         setError("Respons bukan JSON.");
//         console.error("Respons bukan JSON:", res);
//         setLoading(false);
//       }
//     })
//     .catch(err => {
//       if (err.response) {
//         setError(`Error saat memanggil API: ${err.response.status} - ${err.response.data}`);
//         console.error(`Error saat memanggil API: ${err.response.status} - ${err.response.data}`);
//       } else if (err.request) {
//         setError("Tidak ada respons dari server. Periksa koneksi internet.");
//         console.error("Tidak ada respons dari server:", err.request);
//       } else {
//         setError(`Kesalahan lainnya: ${err.message}`);
//         console.error(`Kesalahan lainnya: ${err.message}`);
//       }
//       setLoading(false);
//     });
//   }, []);

//   const handleDetailClick = (url) => {
//     navigate(`/pokemon-detail`, { state: { url } });
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.mt3}>
//         <h1>List Pokémon</h1>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             {
//               data.map((pokemon) => (
//                 <tr key={pokemon.name}>
//                   <td>{pokemon.name}</td>
//                   <td>
//                     <button className={styles.viewDetailsButton} onClick={() => handleDetailClick(pokemon.url)}>
//                       Lihat Detail
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             }
//           </tbody>
//         </table>
//       </div>

//       <div className={styles.footerButtons}>
//         <button className={styles.backButton} onClick={() => window.history.back()}>
//           Kembali
//         </button>
//         <button className={styles.logoutButton}>Keluar</button>
//       </div>
//     </div>
//   );
// }

// export default ProfilePatient;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import styles from "./ProfilePatient.module.css";

// function ProfilePatient() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('https://1df4-182-253-124-181.ngrok-free.app/jadwal')
//       .then(res => {
//         console.log("Respons API:", res);

//         // Validasi jika respons API tidak sesuai
//         if (res.status !== 200) {
//           setError(`API error: Status code ${res.status}`);
//           console.error("API error:", res);
//           setLoading(false);
//           return;
//         }

//         const { data: responseData } = res;

//         // Validasi properti 'success' dan data array
//         if (!responseData.success) {
//           setError(`API error: ${responseData.message || "Unknown error."}`);
//           console.error("API success flag false:", responseData);
//           setLoading(false);
//           return;
//         }

//         if (responseData.data && Array.isArray(responseData.data)) {
//           setData(responseData.data); // Menyimpan data jadwal
//         } else {
//           setError("Data tidak ditemukan atau struktur tidak sesuai.");
//           console.error("Struktur data tidak valid:", responseData);
//         }
//       })
//       .catch(err => {
//         if (err.response) {
//           setError(`Error saat memanggil API: ${err.response.status} - ${err.response.data}`);
//           console.error(`Error saat memanggil API: ${err.response.status} - ${err.response.data}`);
//         } else if (err.request) {
//           setError("Tidak ada respons dari server. Periksa koneksi internet.");
//           console.error("Tidak ada respons dari server:", err.request);
//         } else {
//           setError(`Kesalahan lainnya: ${err.message}`);
//           console.error(`Kesalahan lainnya: ${err.message}`);
//         }
//       })
//       .finally(() => setLoading(false)); // Set loading ke false setelah selesai
//   }, []);

//   const handleDetailClick = (id) => {
//     navigate(`/jadwal-detail`, { state: { id } });
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.mt3}>
//         <h1>List Jadwal</h1>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>No Rekam Medis</th>
//               <th>ID Dokter</th>
//               <th>Tanggal</th>
//               <th>Status</th>
//               <th>Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             {
//               data.map((jadwal) => (
//                 <tr key={jadwal.id}>
//                   <td>{jadwal.id}</td>
//                   <td>{jadwal.no_rekam_medis}</td>
//                   <td>{jadwal.id_dokter}</td>
//                   <td>{jadwal.tanggal}</td>
//                   <td>{jadwal.status}</td>
//                   <td>
//                     <button
//                       className={styles.viewDetailsButton}
//                       onClick={() => handleDetailClick(jadwal.id)}
//                     >
//                       Lihat Detail
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             }
//           </tbody>
//         </table>
//       </div>

//       <div className={styles.footerButtons}>
//         <button className={styles.backButton} onClick={() => window.history.back()}>
//           Kembali
//         </button>
//         <button className={styles.logoutButton}>Keluar</button>
//       </div>
//     </div>
//   );
// }

// export default ProfilePatient;



import React, { useEffect, useState } from "react"; 
import axios from "axios";
import styles from "./ProfilePatient.module.css";

const ProfilePatient = () => {
  const [data, setData] = useState([]); // To store the schedule data
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To store error message (if any)

  useEffect(() => {
    axios
      // .get("https://77de-114-10-149-218.ngrok-free.app/jadwal") // Directly use the full URL
      .get('/jadwal')
      .then((response) => {
        console.log("API Response:", response.data); // Log the full response to inspect the structure
        if (response.data && Array.isArray(response.data.data)) {
          setData(response.data.data); // Extract and set data from the API response
        } else {
          setError("Unexpected response structure.");
        }
        setLoading(false); // Turn off the loading state
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch schedule data. Please try again later."); // Set error message
        setLoading(false); // Turn off the loading state
      });
  }, []);

  // Render loading state while fetching data
  if (loading) return <div className={styles.loading}>Loading...</div>;

  // Render error message if there is any error
  if (error) return <div className={styles.error}>{error}</div>;

  // Render the table with the schedule data
  return (
    <div className={styles.container}>
      <h1>Schedule List</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Medical Record No</th>
            <th>Doctor ID</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.no_rekam_medis}</td>
                <td>{item.id_dokter}</td>
                <td>{item.tanggal}</td>
                <td>{item.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProfilePatient;
