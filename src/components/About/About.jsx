import React, { useState } from 'react'; 
import { getImageUrl } from '../../utils';
import styles from "./About.module.css";

export const About = () => {
    const slides = [
        {
            image: "arimbi/Salinan 25.png",
            title: "Bagaimana keadaanmu hari ini?",
            text: "Aku akan membantumu mengenal aplikasi ini. Mulai perjalanan kesehatanmu melalui fitur-fitur pada aplikasi."
        },
        {
            image: "arimbi/Salinan 18.png",
            title: "Catatan Gejala",
            text: "Jika kamu merasa ada keluhan atau gejala tertentu, kamu bisa mencatatnya di sini. Dengan begitu, kamu tidak akan lupa saat berkonsultasi dengan dokter."
        },
        {
            image: "arimbi/Salinan 13.png",
            title: "Jadwal Perawatan",
            text: "Kapan jadwal perawatan dilakukan? Kamu bisa melihat jadwal perawatan kamu lewat aplikasi ini."
        },
        {
            image: "arimbi/Salinan 19.png",
            title: "Konsultasi Online",
            text: "Ada pertanyaan atau butuh konsultasi segera? Gunakan fitur konsultasi langsung untuk berbicara dengan tenaga kesehatan secara online."
        },
        {
            image: "arimbi/Salinan 23.png",
            title: "FAQ dan Edukasi",
            text: "Bingung atau punya pertanyaan? Jelajahi FAQ kami untuk mendapatkan jawaban. Kami juga menyediakan edukasi kesehatan agar kamu selalu mendapat informasi terpercaya."
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section className={styles.container} id="about">
            <h2 className={styles.title}>Tentang Aplikasi</h2>
            <div className={styles.content}>
                <img
                    src={getImageUrl(slides[currentSlide].image)}
                    alt={slides[currentSlide].title}
                    className={styles.aboutImage}
                />
                <div className={styles.aboutText}>
                    <h3>{slides[currentSlide].title}</h3>
                    <p>{slides[currentSlide].text}</p>
                </div>
                <div className={styles.navigation}>
                    {currentSlide > 0 && (
                        <button onClick={prevSlide}>Kembali</button>
                    )}
                    {currentSlide < slides.length - 1 && (
                        <button onClick={nextSlide}>Selanjutnya</button>
                    )}
                </div>
            </div>
        </section>
    );
};
