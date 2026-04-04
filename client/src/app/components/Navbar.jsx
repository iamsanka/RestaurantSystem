"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [blurActive, setBlurActive] = useState(false);
  const { cart, setIsOpen } = useCart();
  const pathname = usePathname();

  // ⭐ Hide navbar on staff + admin screens
  const hideNavbar =
    pathname.startsWith("/staff") ||
    pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setBlurActive(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (hideNavbar) return null; // ⭐ Hide completely

  return (
    <nav className={`navbar ${blurActive ? "navbar-blur" : ""}`}>
      <div className="nav-container">
        <div className="logo">Restaurant Logo</div>

        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#footer">Contact</a></li>
        </ul>

        <div className="nav-right">
          <a href="/menu" className="menu-btn">Open Menu</a>

          <div className="cart-icon" onClick={() => setIsOpen(true)}>
            <i className="fas fa-shopping-cart"></i>
            {cart.length > 0 && (
              <span className="cart-count">{cart.length}</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
