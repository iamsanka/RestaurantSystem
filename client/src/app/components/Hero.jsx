"use client";
import { useEffect, useState } from "react";

export default function Hero() {
  const images = [
    "/hero/1.png",
    "/hero/2.jpg"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero hero-slider">

      <div className="hero-image-container">
        <img src={images[index]} alt="Hero" className="hero-image" />

        <div className="hero-text-overlay">
          <h1>Wrap Master</h1>
          <p>“We don’t sell wraps. We wrap satisfaction.”</p>
          <a href="/menu" className="hero-btn">View Menu & Order</a>
        </div>
      </div>

    </section>
  );
}
