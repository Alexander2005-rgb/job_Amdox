import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs');
      if (response.ok) {
        const jobs = await response.json();
        // Extract unique companies from jobs
        const uniqueCompanies = [...new Set(jobs.map(job => job.company))];
        setCompanies(uniqueCompanies);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = (company) => {
    // Navigate to search with company filter
    navigate(`/search?search=${encodeURIComponent(company)}`);
  };

  return (
    <div className="companies-page">
      <header className="header">
        <div className="logo">👩‍💻JobPortal</div>
        <nav className="nav">
          <button className="nav-btn" onClick={() => navigate('/')}>Home</button>
          <button className="nav-btn" onClick={() => navigate('/search')}>Jobs</button>
          <button className="nav-btn" onClick={() => navigate('/companies')}>Companies</button>
        </nav>
      </header>

      <div className="page-content">
        <h1>Companies</h1>
        <p>Explore job opportunities from top companies worldwide.</p>

        {loading ? (
          <p>Loading companies...</p>
        ) : companies.length > 0 ? (
          <div className="companies-list">
            {companies.map(company => (
              <div key={company} className="company-card" onClick={() => handleCompanyClick(company)}>
                <h3>{company}</h3>
                <p>Click to view jobs at {company}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No companies available at the moment.</p>
        )}
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

export default Companies;
