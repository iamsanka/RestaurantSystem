"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // ⭐ Handle form submission (Resend API)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Message sent successfully!");
      e.target.reset();
    } else {
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <footer id="footer" className="footer-section">

      <div className="footer-container">

        {/* LEFT SIDE — CONTACT INFO */}
        <div className="footer-box footer-left">
          <h2>Contact Us</h2>

          <div className="footer-item">
            <h4>Email:</h4>
            <a
              href="mailto:orders@restaurantapp.eu.org"
              className="footer-link"
            >
              orders@restaurantapp.eu.org
            </a>
          </div>

          <div className="footer-item">
            <h4>Phone:</h4>

            <a
              href="https://wa.me/358503699361?text=Hello%20I%20would%20like%20to%20inquire%20about%20your%20services"
              target="_blank"
              className="footer-link"
            >
              +358 503699361
            </a>
          </div>

          <div className="footer-item">
            <h4>Location:</h4>
            <a
              href="https://share.google/cpw2LyeNCdCaHFUEQ"
              target="_blank"
              className="footer-link"
            >
              Arkadiankatu 19c, 00100 Helsinki
            </a>
          </div>

          <div className="footer-item">
            <h4>Follow us:</h4>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — MESSAGE FORM */}
        <div className="footer-box footer-right">
          <h2>Send Us a Message</h2>

          <form className="footer-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <textarea name="message" placeholder="Your Message" rows="4" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        <p>
          Copyright © {currentYear} SanD. All Rights Reserved. 
          <a 
            href="https://iamsankadesilva.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ marginLeft: "6px", textDecoration: "underline" }}
          >
            Built by Sanka De Silva
          </a>
        </p>
      </div>


    </footer>
  );
}
