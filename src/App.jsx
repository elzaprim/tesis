// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Appdown } from './components/Appdown/Appdown';
import { Login } from './components/Login/Login';
import AdminDashboard from './components/Dashboard/AdminDashboard/AdminDashboard';
import DoctorDashboard from './components/Dashboard/DoctorDashboard/DoctorDashboard';
import GuardianDashboard from './components/Dashboard/GuardianDashboard/GuardianDashboard';
import PatientSymptoms from './components/PatientSymptoms/PatientSymptoms';
import PatientAppointment from './components/Appointment/PatientAppointment';
import DoctorAppointment from './components/Appointment/DoctorAppointment'; // Import DoctorAppointment
import ReschedulePage from './components/Reschedule/ReschedulePage'; // Import ReschedulePage
import { Footer } from './components/Footer/Footer';
import AdminAppointment from './components/Appointment/AdminAppointment';

import ChatPage from './components/ChatPage/ChatPage';
import Chat from './components/Chat/Chat';
import List from './components/list/List';
import Detail from './components/detail/Detail';

// Tambahkan import untuk UserInfo
import UserInfo from './components/list/userInfo/UserInfo';
import ChatList from './components/list/chatList/ChatList'; 

// Import ProfilePatient komponen
import ProfilePatient from './components/DataPatient/ProfilePatient'; // Tambahkan import untuk ProfilePatient
import ProfilePatientDetail from './components/DataPatient/ProfilePatientDetail'; // Import ProfilePatientDetail

// //chat
// import firebase from 'firebase/app';
// import 'firebase-firestore';
// import 'firebase/auth';

// import { useAuthState} from 'react-firebase-hooks/auth';
// import { useCollectionData} from 'react-firebase-hooks/firestore';

// firebase.initializeApp({
//   //your config
// })


// Import Education components
import AdminEducation from './components/Education/AdminEducation'; 
import AddContent from './components/Education/AddContent'; 
import GuardianEducation from './components/Education/GuardianEducation'; 

import styles from './App.module.css';



function App() {
  return (
    <Router>
      <div className={styles.App}>
        <Navbar />
        <Routes>
          {/* Homepage menampilkan semua komponen */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                <Appdown />
                <Footer />
                {/* <List /> */}
              </>
            }
          />

          {/* Halaman Login */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard berdasarkan role */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/guardian-dashboard" element={<GuardianDashboard />} />

          {/* Halaman untuk Gejala Pasien */}
          <Route path="/patient-symptoms" element={<PatientSymptoms />} />

          {/* Halaman untuk Janji Temu */}
          <Route path="/appointment" element={<PatientAppointment />} />
          <Route path="/doctor-appointments" element={<DoctorAppointment />} /> {/* Tambahkan rute ini */}
          <Route path="/admin-appointments" element={<AdminAppointment />} />

          {/* Rute untuk Reschedule Page */}
          <Route path="/reschedule/:patientName" element={<ReschedulePage />} /> {/* Rute baru */}

          {/* Rute untuk Konten Edukasi */}
          <Route path="/admin-education" element={<AdminEducation />} />
          <Route path="/admin-education/add-content" element={<AddContent />} />
          <Route path="/admin-education/view-and-edit" element={<GuardianEducation />} />
          

          {/* Rute untuk ChatPage */}
          <Route path="/admin-consultations" element={<ChatPage />} /> {/* Menambahkan rute ChatPage */}

          {/* Rute untuk Profile Pasien */}
          <Route path="/profile-patient-doctor" element={<ProfilePatient />} />
          <Route path="/patient-detail/:patientId" element={<ProfilePatientDetail />} />

          

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
