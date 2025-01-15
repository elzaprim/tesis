import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Untuk navigasi
import styles from './ChatList.module.css'; // Menggunakan CSS Modules
import AddUser from './AddUser/AddUser';

const ChatList = () => {
  const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi jika diperlukan
  const [addMode, setAddMode] = useState(false);

  return (
    <div className={styles.chatList}> {/* Gunakan styles dari CSS Modules */}
      <div className={styles.search}>
        <div className={styles.searchBar}>
          <img src="/assets/chat/search.png" alt="Search" />
          <input type="text" placeholder="Cari" />
        </div>
        <img 
          src={addMode ? "/assets/chat/minus.png" : "/assets/chat/plus.png"}
          alt="Add"
          className={styles.add}  // Gunakan CSS Modules untuk class "add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {/* Daftar chat item */}
      <div className={styles.itemsContainer}>
        {[...Array(7)].map((_, idx) => (
          <div key={idx} className={styles.item}>
            <img src="/assets/chat/avatar.png" alt="" />
            <div className={styles.texts}>
              <span>Jane Doe</span>
              <p>Hello</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tampilkan AddUser jika addMode aktif */}
      {addMode && (
        <div className={styles.addUserWrapper}>
          <AddUser />
        </div>
      )}
    </div>
  );
};

export default ChatList;
