import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./List.module.css";
import UserInfo from "./userInfo/UserInfo";
import ChatList from "./chatList/ChatList";

const List = () => {
    return (
        <div className={styles.list}>
            <div className={styles.userInfo}>
                <UserInfo /> {/* UserInfo remains static */}
            </div>
            <ChatList className={styles.chatList} /> {/* Directly apply the chatList class to ChatList */}
        </div>
    );
}

export default List;
