"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [isBlur, setIsBlur] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart, setIsOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsBlur(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileOpen(false);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  return (
    <nav className={`navbar ${isBlur ? "navbar-blur" : ""}`}>
      <div className="nav-container">

        {/* LOGO */}
        <div className="logo" onClick={scrollToTop} style={{ cursor: "pointer" }}>
          <img src="/logo.jpg" alt="Logo" className="logo-img" />
        </div>

        {/* DESKTOP LINKS */}
        <ul className="nav-links">
          <li><button onClick={() => scrollToSection("about")}>About</button></li>
          <li><button onClick={() => scrollToSection("gallery")}>Gallery</button></li>
          <li><button onClick={() => scrollToSection("footer")}>Contact</button></li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="nav-right">
          <a href="/login" className="menu-btn">Login</a>

          <div
            className="cart-icon"
            onClick={() => setIsOpen(true)}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="cart-count">{cart.length}</span>
          </div>

          {/* HAMBURGER (MOBILE ONLY) */}
          <div
            className="hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <button onClick={() => scrollToSection("about")}>About</button>
        <button onClick={() => scrollToSection("gallery")}>Gallery</button>
        <button onClick={() => scrollToSection("footer")}>Contact</button>

        <a href="/login" className="mobile-login-btn">Login</a>

        <button
          className="mobile-cart-btn"
          onClick={() => {
            setIsOpen(true);
            setMobileOpen(false);
          }}
        >
          Cart ({cart.length})
        </button>
      </div>
    </nav>
  );
}
