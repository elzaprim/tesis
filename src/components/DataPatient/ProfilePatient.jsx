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
