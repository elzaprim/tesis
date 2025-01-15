import React, { useState, useEffect, useRef } from "react"; // Import useRef here
import styles from "./Chat.module.css";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");

    // Create ref for scrolling to the bottom
    const endRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom every time the text changes
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [text]); // Dependency array ensures it scrolls when the text changes

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    return (
        <div className={styles.chat}>
            <div className={styles.top}>
                <div className={styles.user}>
                    <img src="/assets/chat/avatar.png" alt="" />
                    <div className={styles.texts}>
                        <span>Jane Doe</span>
                        <p>Bagian Ini Teks Random Dulu</p>
                    </div>
                </div>
                <div className={styles.icons}>
                    <img src="/assets/chat/phone.png" alt="" />
                    <img src="/assets/chat/video.png" alt="" />
                    <img src="/assets/chat/info.png" alt="" />
                </div>
            </div>

            <div className={styles.center}>
                <div className={styles.message}>
                    <img src="/assets/chat/avatar.png" alt="" />
                    <div className={styles.texts}>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                        <span>1 menit lalu</span>
                    </div>
                </div>

                <div className={`${styles.message} ${styles.messageown}`}>
                    <div className={styles.texts}>
                        <img src="/assets/hero/hokkaido.jpeg" alt="" />
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                        <span>1 menit lalu</span>
                    </div>
                </div>

                <div className={styles.message}>
                    <img src="/assets/chat/avatar.png" alt="" />
                    <div className={styles.texts}>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                        <span>1 menit lalu</span>
                    </div>
                </div>

                <div className={`${styles.message} ${styles.messageown}`}>
                    <div className={styles.texts}>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                        <span>1 menit lalu</span>
                    </div>
                </div>

                {/* Apply ref to the last element to scroll it into view */}
                <div ref={endRef}></div> 
            </div>

            <div className={styles.bottom}>
                <div className={styles.icons}>
                    <img src="/assets/chat/img.png" alt="" />
                    <img src="/assets/chat/camera.png" alt="" />
                    <img src="/assets/chat/mic.png" alt="" />
                </div>
                <input
                    type="text"
                    placeholder="Tulis sebuah pesan..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <div className={styles.emoji}>
                    <img
                        src="/assets/chat/emoji.png"
                        alt=""
                        onClick={() => setOpen(prev => !prev)}
                    />
                    {open && (
                        <div className={styles.picker}>
                            <EmojiPicker onEmojiClick={handleEmoji} />
                        </div>
                    )}
                </div>
                <button className={styles.sendButton}>Kirim</button>
            </div>
        </div>
    );
};

export default Chat;
