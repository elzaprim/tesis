import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Detail.module.css";

const Detail = () => {
    return(
        <div className={styles.detail}>
            <div className={styles.user}>
               <img src="/assets/chat/avatar.png" alt="" /> 
                <h2>Jane Doe</h2>
                <p>Lorem ipsum dolor sit, amet consectetur.</p>
            </div>
            <div className={styles.info}>
                <div className={styles.option}>
                    <div className={styles.title}>
                        <span>Pengaturan Chat</span>
                        <img src="/assets/chat/arrowUp.png" alt="" />
                    </div>                
                </div>

                <div className={styles.option}>
                    <div className={styles.title}>
                        <span>Privasi % Bantuan</span>
                        <img src="/assets/chat/arrowUp.png" alt="" />
                    </div>                
                </div>

                <div className={styles.option}>
                    <div className={styles.title}>
                        <span>Foto Dibagikan</span>
                        <img src="/assets/chat/arrowDown.png" alt="" />
                    </div>
                    <div className={styles.photos}>
                        <div className={styles.photoItem}>
                            <div className={styles.photoDetail}>
                                <img src="/assets/hero/hokkaido.jpeg" alt="" 
                                />  
                                <span>photo_2025_1.png</span>
                            </div>
                            <img src="/assets/chat/download.png" alt="" className={styles.icon}/>
                        </div>                
                    </div>

                    <div className={styles.photos}>
                        <div className={styles.photoItem}>
                            <div className={styles.photoDetail}>
                                <img src="/assets/hero/hokkaido.jpeg" alt="" 
                                />  
                                <span>photo_2025_1.png</span>
                            </div>
                            <img src="/assets/chat/download.png" alt="" className={styles.icon}/>
                        </div>                
                    </div>

                    <div className={styles.photos}>
                        <div className={styles.photoItem}>
                            <div className={styles.photoDetail}>
                                <img src="/assets/hero/hokkaido.jpeg" alt="" 
                                />  
                                <span>photo_2025_1.png</span>
                            </div>
                            <img src="/assets/chat/download.png" alt="" className={styles.icon}/>
                        </div>                
                    </div>

                    <div className={styles.photos}>
                        <div className={styles.photoItem}>
                            <div className={styles.photoDetail}>
                                <img src="/assets/hero/hokkaido.jpeg" alt="" 
                                />  
                                <span>photo_2025_1.png</span>
                            </div>
                                <img src="/assets/chat/download.png" alt="" className={styles.icon}/>
                        </div>                
                    </div>

                </div>

                <div className={styles.option}>
                    <div className={styles.title}>
                        <span>File Dibagikan</span>
                        <img src="/assets/chat/arrowUp.png" alt="" />
                    </div>                
                </div>
                <button>Blokir Pengguna</button>
                <button className={styles.logout}>Keluar</button>

            </div>
        </div>
    )
}

export default Detail