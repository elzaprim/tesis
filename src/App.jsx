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
// import ProfilePatient from './components/DataPatient/ProfilePatient'; // Tambahkan import untuk ProfilePatient
import ProfilePatientDokter from './components/DataPatient/ProfilePatientDokter';
import ProfilePatientDetail from './components/DataPatient/ProfilePatientDetail'; // Import ProfilePatientDetail
import ProfilePatientAdmin from './components/DataPatient/ProfilePatientAdmin';

import PatientAdd from './components/DataPatient/PatientAdd';

import ProfilPasien from './components/ProfilePatient/ProfilePatient';
import MedicalRecord from './components/MedicalRecord/MedicalRecord';

import FaqEducation from './components/Education/FaqEducation';
import PatientContentList from './components/Education/PatientContentList'; 

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AbandonPage from './components/Abandon/AbandonPage';

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

import ContentList from './components/Education/ContentList';
import EditContent from './components/Education/EditContent';

import styles from './App.module.css';

// Import Overview Dokter
import Overview from './components/Overview/Overview';

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
          {/* <Route path="/admin-education" element={<AdminEducation />} />
          <Route path="/admin-education/add-content" element={<AddContent />} />
          <Route path="/admin-education/view-and-edit" element={<GuardianEducation />} /> */}
          <Route path="/admin-education" element={<AdminEducation />} />
          <Route path="/admin-education/add-content" element={<AddContent />} />
          <Route path="/admin-education/content-list" element={<ContentList />} />
          <Route path="/admin-education/edit-content" element={<EditContent />} />
                

          {/* Rute untuk ChatPage */}
          <Route path="/admin-consultations" element={<ChatPage />} /> {/* Menambahkan rute ChatPage */}

          {/* Rute untuk Profile Pasien */}
        
          <Route path="/profile-patient-admin" element={<ProfilePatientAdmin />} />
          <Route path="/patient-detail/:no_rekam_medis" element={<ProfilePatientDetail />} />
          <Route path="/patient-add" element={<PatientAdd />} />
          <Route path="/profil-pasien" element={<ProfilPasien />} />

          <Route path="/medical-history" element={<MedicalRecord />} />

          <Route path="/guardian-education" element={<GuardianEducation />} />
          <Route path="/education/faq" element={<FaqEducation />} />
          <Route path="/education/content" element={<PatientContentList />} />

         
          {/* Rute untuk Overview Dokter*/}
          <Route path="/overview" element={<Overview />} />
          <Route path="/profile-patient-doctor" element={<ProfilePatientDokter />} />

          <Route path="/abandon" element={<AbandonPage />} />
 
        </Routes>
                {/*Tambahkan ini agar toast muncul di semua halaman */}
          `<ToastContainer position="top-right" autoClose={4000} />
      </div>
    </Router>
  );
}

export default App;
