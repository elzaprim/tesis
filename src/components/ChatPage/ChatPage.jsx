import React from 'react';
import List from '../list/List'; // Mengimpor List dari path yang benar
import Chat from '../Chat/Chat'; // Mengimpor Chat.jsx
import Detail from '../detail/Detail'; // Mengimpor Detail.jsx
import styles from './ChatPage.module.css'; // Import styling khusus untuk komponen ini

const ChatPage = () => {
    return (
      <div className={styles.chatPageContainer}>
        <div className={styles.list}>
          <List /> {/* Menampilkan UserInfo dan ChatList */}
        </div>
        <div className={styles.chat}>
          <Chat /> {/* Komponen ruang obrolan */}
        </div>
        <div className={styles.detail}>
          <Detail /> {/* Komponen Detail */}
        </div>
      </div>
    );
}

export default ChatPage;
