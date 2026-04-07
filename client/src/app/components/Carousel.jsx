"use client";
import { useState, useEffect, useRef } from "react";

export default function Carousel() {
  const images = [
    "/gallery/1.jpg",
    "/gallery/2.jpg",
    "/gallery/3.jpg",
    "/gallery/4.jpg",
    "/gallery/5.jpg",
    "/gallery/6.jpg"
  ];

  // Clone first 3 images at the end
  const extended = [...images, ...images.slice(0, 3)];

  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);

  const next = () => setIndex((prev) => prev + 1);
  const prev = () => setIndex((prev) => prev - 1);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, []);

  // Smooth infinite loop logic
  useEffect(() => {
    const total = images.length;

    // When reaching the cloned images, reset instantly to real index 0
    if (index === total) {
      setTimeout(() => {
        trackRef.current.style.transition = "none";
        setIndex(0);

        // Re-enable animation
        requestAnimationFrame(() => {
          trackRef.current.style.transition = "transform 0.6s ease";
        });
      }, 600); // wait for slide animation to finish
    }

    // When going backwards from index 0 → jump to last real slide
    if (index === -1) {
      trackRef.current.style.transition = "none";
      setIndex(images.length - 1);

      requestAnimationFrame(() => {
        trackRef.current.style.transition = "transform 0.6s ease";
      });
    }
  }, [index, images.length]);

  return (
    <div className="carousel">
      <button className="carousel-btn left" onClick={prev}>‹</button>

      <div
        className="carousel-track"
        ref={trackRef}
        style={{
          transform: `translateX(-${index * (100 / 3)}%)`,
          transition: "transform 0.6s ease"
        }}
      >
        {extended.map((src, i) => (
          <img key={i} src={src} alt="Gallery" className="carousel-img" />
        ))}
      </div>

      <button className="carousel-btn right" onClick={next}>›</button>
    </div>
  );
}
