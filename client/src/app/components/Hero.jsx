"use client";
import { useEffect, useState } from "react";

export default function Hero() {
  const images = [
    "/hero/1.jpg",
    "/hero/2.jpg",
    "/hero/3.jpg",
    "/hero/4.jpg",
    "/hero/5.jpg",
    "/hero/6.jpg"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="hero hero-slider"
      style={{ backgroundImage: `url(${images[index]})` }}
    >
      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>Welcome to Our Restaurant</h1>
        <p>Delicious food, unforgettable moments.</p>
        <a href="/menu" className="hero-btn">View Menu</a>
      </div>
    </section>
  );
}
