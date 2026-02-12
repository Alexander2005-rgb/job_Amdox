import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setMessage('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <header className="header">
        <div className="logo">👩‍💻JobPortal</div>
        <nav className="nav">
          <button className="nav-btn" onClick={() => navigate('/')}>Home</button>
          <button className="nav-btn" onClick={() => navigate('/search')}>Jobs</button>
          <button className="nav-btn" onClick={() => navigate('/companies')}>Companies</button>
        </nav>
      </header>

      <div className="page-content">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>

        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p><strong>Email:</strong> support@jobportal.com</p>
          <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          <p><strong>Address:</strong> 123 Job Street, Career City, CC 12345</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleInputChange}
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>

        {message && <p className="success-message">{message}</p>}
      </div>

      <footer className="footer">
        <p>&copy; 2023 JobPortal. All rights reserved.</p>
        <div className="footer-links">
          <button className="footer-link" onClick={() => navigate('/about')}>About</button>
          <button className="footer-link" onClick={() => navigate('/contact')}>Contact</button>
          <button className="footer-link" onClick={() => navigate('/privacy')}>Privacy Policy</button>
        </div>
      </footer>
    </div>
  );
}

export default Contact;
