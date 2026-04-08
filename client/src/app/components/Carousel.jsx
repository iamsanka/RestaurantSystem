"use client";
import { useState, useEffect, useRef } from "react";

export default function Carousel() {
  const images = [
    "/gallery/1.jpg",
    "/gallery/2.jpg",
    "/gallery/3.jpg",
    "/gallery/4.jpg",
    "/gallery/5.jpg",
    "/gallery/6.jpg",
    "/gallery/7.jpg",
    "/gallery/8.jpg"
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Clone slides based on mode
  const extended = isMobile
    ? [...images, images[0]] // clone 1
    : [...images, ...images.slice(0, 3)]; // clone 3

  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);

  const next = () => setIndex((prev) => prev + 1);
  const prev = () => setIndex((prev) => prev - 1);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, []);

  // Infinite loop logic
  useEffect(() => {
    const total = images.length;

    const lastMobileIndex = total - 1; // last real slide
    const lastDesktopIndex = total - 3; // last full desktop slide

    const resetPoint = isMobile ? lastMobileIndex : lastDesktopIndex;

    // Forward loop reset
    if (index === resetPoint + 1) {
      setTimeout(() => {
        trackRef.current.style.transition = "none";
        setIndex(0);

        requestAnimationFrame(() => {
          trackRef.current.style.transition = "transform 0.6s ease";
        });
      }, 600);
    }

    // Backward loop reset
    if (index === -1) {
      trackRef.current.style.transition = "none";
      setIndex(resetPoint);

      requestAnimationFrame(() => {
        trackRef.current.style.transition = "transform 0.6s ease";
      });
    }
  }, [index, images.length, isMobile]);

  return (
    <div className="carousel">
      <button className="carousel-btn left" onClick={prev}>‹</button>

      <div
        className="carousel-track"
        ref={trackRef}
        style={{
          transform: `translateX(-${index * (isMobile ? 100 : 100 / 3)}%)`,
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
