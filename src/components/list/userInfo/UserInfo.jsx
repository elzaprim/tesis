import React from 'react';
import { useNavigate } from 'react-router-dom'; // Jika `useNavigate` memang diperlukan
import styles from './UserInfo.module.css'; // Menggunakan styles dari CSS Modules

const UserInfo = () => {
  const navigate = useNavigate(); // Jika `useNavigate` akan digunakan untuk navigasi
  
  return (
    <div className={styles.userInfo}> {/* Gunakan styles dari CSS Modules */}
      <div className={styles.user}>
        <img src="/assets/chat/avatar.png" alt="User Avatar" />
        <h2>John Doe</h2>
      </div>
      <div className={styles.icon}>
        <img src="/assets/chat/more.png" alt="More Options" />
        <img src="/assets/chat/video.png" alt="Video Call" />
        <img src="/assets/chat/edit.png" alt="Edit Profile" />
      </div>
    </div>
  );
};

export default UserInfo;
