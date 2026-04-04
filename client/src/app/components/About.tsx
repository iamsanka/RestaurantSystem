export default function About() {
  return (
    <section id="about" className="about-section">
      {/* Block 1 */}
      <div className="about-block">
        <div className="about-image">
          <img src="/about/1.jpg" alt="Our Story" />
        </div>

        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            Founded on January 2nd, 2023, in Jyväskylä, Finland, our catering
            journey began with a simple but heartfelt goal — to bring the
            authentic taste of Sri Lanka to those living far from home. Inspired
            by the longing for familiar flavors, we set out to serve the Sri
            Lankan community in Finland with the comforting dishes they grew up
            with.
          </p>
          <p>
            Whether it’s a spicy curry, a warm roti, or a traditional sweet, our
            mission is to recreate the essence of home through food rich in
            culture, made with love, and always full of flavor.
          </p>
        </div>
      </div>

      {/* Block 2 */}
      <div className="about-block reverse">
        <div className="about-text">
          <h2>Authentic Sri Lankan Cuisine</h2>
          <p>
            At the heart of our catering service is a deep commitment to
            delivering truly authentic Sri Lankan cuisine. Every dish we prepare
            reflects the vibrant flavors, bold spices, and rich culinary
            traditions of Sri Lanka.
          </p>
          <p>
            From fragrant rice and curry to savory street food favorites, our
            menu is crafted to evoke the tastes and aromas that remind you of
            home. Whether you're craving a comforting bowl of dhal or a spicy
            chicken curry, we use traditional recipes and fresh ingredients to
            bring you an unforgettable dining experience.
          </p>
        </div>

        <div className="about-image">
          <img src="/about/2.jpg" alt="Sri Lankan Cuisine" />
        </div>
      </div>
    </section>
  );
}
