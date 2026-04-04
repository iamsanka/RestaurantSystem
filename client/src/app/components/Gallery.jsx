import Carousel from "./Carousel";

export default function Gallery() {
  return (
    <section id="gallery" className="gallery-section">
      <h2 className="gallery-title">Gallery</h2>
      <p className="gallery-subtitle">
        A glimpse into our authentic Sri Lankan flavors
      </p>

      <Carousel />
    </section>
  );
}
