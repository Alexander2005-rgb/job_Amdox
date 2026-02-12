import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <header className="header">
        <div className="logo">👩‍💻JobPortal</div>
        <nav className="nav">
          <button className="nav-btn" onClick={() => navigate('/')}>Home</button>
          <button className="nav-btn" onClick={() => navigate('/search')}>Jobs</button>
          <button className="nav-btn" onClick={() => navigate('/companies')}>Companies</button>
        </nav>
      </header>

      <div className="page-content">
        <h1>About Us</h1>
        <p>Welcome to JobPortal, your premier destination for connecting talented individuals with exciting career opportunities.</p>
        <p>Our mission is to simplify the job search process and empower employers to find the perfect candidates for their teams.</p>
        <h2>Our Story</h2>
        <p>Founded in 2023, JobPortal has been at the forefront of revolutionizing the way people find jobs and companies hire talent.</p>
        <h2>Our Values</h2>
        <ul>
          <li>Integrity</li>
          <li>Innovation</li>
          <li>Inclusivity</li>
          <li>Excellence</li>
        </ul>
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

export default About;
