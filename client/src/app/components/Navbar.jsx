"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [isBlur, setIsBlur] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsBlur(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to top when clicking the logo
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Smooth scroll to sections
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className={`navbar ${isBlur ? "navbar-blur" : ""}`}>
      <div className="nav-container">

        {/* LEFT — LOGO */}
        <div className="logo" onClick={scrollToTop} style={{ cursor: "pointer" }}>
          <img src="/logo.jpg" alt="Logo" className="logo-img" />
        </div>

        {/* CENTER — LINKS */}
        <ul className="nav-links">
          <li><button onClick={() => scrollToSection("about")}>About</button></li>
          <li><button onClick={() => scrollToSection("gallery")}>Gallery</button></li>
          <li><button onClick={() => scrollToSection("footer")}>Contact</button></li>
        </ul>

        {/* RIGHT — BUTTON + CART */}
        <div className="nav-right">
          <a href="/login" className="menu-btn">Login</a>

          <div className="cart-icon">
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="cart-count">0</span>
          </div>
        </div>

      </div>
    </nav>
  );
}
