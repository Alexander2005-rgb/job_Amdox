import React from 'react';
import { useNavigate } from 'react-router-dom';

function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="privacy-page">
      <header className="header">
        <div className="logo">👩‍💻JobPortal</div>
        <nav className="nav">
          <button className="nav-btn" onClick={() => navigate('/')}>Home</button>
          <button className="nav-btn" onClick={() => navigate('/search')}>Jobs</button>
          <button className="nav-btn" onClick={() => navigate('/companies')}>Companies</button>
        </nav>
      </header>

      <div className="page-content">
        <h1>Privacy Policy</h1>
        <p><strong>Effective Date:</strong> January 1, 2024</p>

        <p>Welcome to JobPortal. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our job portal services.</p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following types of information from you:</p>
        <ul>
          <li><strong>Personal Information:</strong> This includes your name, email address, phone number, resume, cover letter, work experience, education details, and other information you provide when registering an account, applying for jobs, or contacting us.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our website, such as pages visited, time spent on the site, search queries, and other usage statistics.</li>
          <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to enhance your experience, analyze site traffic, and personalize content.</li>
          <li><strong>Device Information:</strong> Information about your device, including IP address, browser type, operating system, and device identifiers.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li>To provide, maintain, and improve our job portal services.</li>
          <li>To match job seekers with relevant job opportunities and employers with qualified candidates.</li>
          <li>To communicate with you about your account, job applications, and updates.</li>
          <li>To process job applications and facilitate connections between job seekers and employers.</li>
          <li>To analyze usage patterns and improve our platform's functionality and user experience.</li>
          <li>To comply with legal obligations and enforce our terms of service.</li>
        </ul>

        <h2>3. Sharing Your Information</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:</p>
        <ul>
          <li><strong>With Employers:</strong> When you apply for a job, we may share your resume and application details with the relevant employer.</li>
          <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you.</li>
          <li><strong>Legal Requirements:</strong> We may disclose your information if required by law, court order, or government request.</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, and regular security assessments. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

        <h2>5. Your Rights</h2>
        <p>You have certain rights regarding your personal information:</p>
        <ul>
          <li><strong>Access:</strong> You can request access to the personal information we hold about you.</li>
          <li><strong>Correction:</strong> You can request correction of inaccurate or incomplete information.</li>
          <li><strong>Deletion:</strong> You can request deletion of your personal information, subject to certain legal exceptions.</li>
          <li><strong>Portability:</strong> You can request a copy of your data in a structured, machine-readable format.</li>
          <li><strong>Opt-out:</strong> You can opt out of marketing communications at any time.</li>
        </ul>
        <p>To exercise these rights, please contact us using the information provided below.</p>

        <h2>6. Cookies</h2>
        <p>We use cookies to improve your browsing experience. You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our website.</p>

        <h2>7. Third-Party Links</h2>
        <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>

        <h2>8. Children's Privacy</h2>
        <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.</p>

        <h2>9. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on this page and updating the "Effective Date" at the top. We encourage you to review this policy periodically.</p>

        <h2>10. Contact Us</h2>
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
        <ul>
          <li>Email: privacy@jobportal.com</li>
          <li>Phone: [Insert Phone Number]</li>
          <li>Address: [Insert Company Address]</li>
        </ul>
        <p>You can also reach us through our Contact page on the website.</p>
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

export default Privacy;
