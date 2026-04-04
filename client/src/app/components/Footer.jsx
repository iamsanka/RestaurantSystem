export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="footer-section">

      <div className="footer-container">

        {/* LEFT SIDE — CONTACT INFO */}
        <div className="footer-box footer-left">
          <h2>Contact Us</h2>

          <div className="footer-item">
            <h4>Email:</h4>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=info@taprobane.fi&su=Inquiry%20from%20Website&body=Hello%2C%20I%20would%20like%20to%20ask..."
              target="_blank"
              className="footer-link"
            >
              info@taprobane.fi
            </a>
          </div>

          <div className="footer-item">
            <h4>Phone:</h4>

            <a
              href="https://wa.me/358442363616?text=Hello%20I%20would%20like%20to%20inquire%20about%20your%20services"
              target="_blank"
              className="footer-link"
            >
              +358 442363616
            </a>
            <br />
            <a
              href="https://wa.me/358442363618?text=Hello%20I%20would%20like%20to%20inquire%20about%20your%20services"
              target="_blank"
              className="footer-link"
            >
              +358 442363618
            </a>
          </div>

          <div className="footer-item">
            <h4>Location:</h4>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Helsinki%2C%20Finland"
              target="_blank"
              className="footer-link"
            >
              Helsinki, Finland
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

          <form className="footer-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="4" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        <p>Copyright © {currentYear} SanD. All Rights Reserved.</p>
      </div>

    </footer>
  );
}
