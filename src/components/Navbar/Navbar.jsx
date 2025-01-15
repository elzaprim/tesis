import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { getImageUrl } from "../../utils";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Fungsi untuk scroll ke bagian tertentu
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 70,
        behavior: "smooth",
      });
    }
    setMenuOpen(false); // Tutup menu setelah klik
  };

  return (
    <nav className={styles.navbar}>
      <a className={styles.title} href="/">
        Portofolio
      </a>
      <div className={styles.menu}>
        {/* Tombol Menu */}
        <img
          className={styles.menuBtn}
          src={
            menuOpen
              ? getImageUrl("nav/closeIcon.svg")
              : getImageUrl("nav/menuIcon.svg")
          }
          alt="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        />
        <ul
          className={`${styles.menuItems} ${menuOpen ? styles.menuOpen : ""}`}
        >
          {/* Scroll ke Tentang Aplikasi */}
          <li onClick={() => scrollToSection("about")}>
            <a href="#about">Tentang Aplikasi</a>
          </li>

          {/* Navigasi ke halaman Login */}
          <li>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          </li>

          {/* Scroll ke Download Aplikasi */}
          <li onClick={() => scrollToSection("appdown")}>
            <a href="#appdown">Download Aplikasi</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
