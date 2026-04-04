"use client";
import { useState, useEffect } from "react";

export default function Carousel() {
  const images = [
    "/gallery/1.jpg",
    "/gallery/2.jpg",
    "/gallery/3.jpg",
    "/gallery/4.jpg",
    "/gallery/5.jpg",
    "/gallery/6.jpg"
  ];

  const [index, setIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const next = () => setIndex((index + 1) % images.length);
  const prev = () => setIndex((index - 1 + images.length) % images.length);

  return (
    <div className="carousel">
      <button className="carousel-btn left" onClick={prev}>‹</button>

      <img
        src={images[index]}
        alt="Gallery"
        className="carousel-img"
      />

      <button className="carousel-btn right" onClick={next}>›</button>
    </div>
  );
}
