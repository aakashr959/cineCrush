import React from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";
import { FaYoutube, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section - Logo and Description */}
        <div className="footer-left">
          <h2 className="footer-logo">cineCrush</h2>
          <p className="footer-desc">
            Discover and stream your favorite movies and shows with cineCrush.
          </p>
        </div>

        {/* Middle Section - Navigation */}
        <div className="footer-middle">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
            <li><Link to="/socialMedia" className="footer-link">Social Media</Link></li>
          </ul>
        </div>

        {/* Right Section - Socials and Contact */}
        <div className="footer-right">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <FaYoutube />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
            <a href="mailto:support@cinecrush.com">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>&copy; 2024 cineCrush. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
