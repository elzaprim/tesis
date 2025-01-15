import React from "react";
import styles from "./AddUser.module.css"; // Pastikan impor CSS Modules benar

const AddUser = () => {
  return (
    <div className={styles.AddUser}>
      <form>
        <input type="text" placeholder="Username" name="username" />
        <button type="submit">Cari</button>
      </form>
      <div className={styles.user}>
        <div className={styles.detail}>
          <img src="/assets/chat/avatar.png" alt="" />
          <span>Jane Doe</span>
        </div>
        <button>Tambah User</button>
      </div>
    </div>
  );
};

export default AddUser;
