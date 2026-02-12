import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const loc = params.get('location') || '';
    fetchJobs(search, loc, typeFilter);
  }, [location.search, typeFilter]);

  const fetchJobs = async (search, loc, type) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (loc) queryParams.append('location', loc);
      if (type) queryParams.append('type', type);

      const response = await fetch(`http://localhost:5000/api/jobs?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handleFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  return (
    <div className="search-results">
      <header className="header">
        <div className="logo">👩‍💻JobPortal</div>
        <nav className="nav">
          <button className="nav-btn" onClick={() => navigate('/')}>Home</button>
        </nav>
      </header>

      <div className="search-container">
        <h1>Search Results</h1>
        <div className="filters">
          <select value={typeFilter} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length > 0 ? (
          <div className="job-list">
            {jobs.map(job => (
              <div key={job._id} className="job-card" onClick={() => handleJobClick(job._id)}>
                <h3>{job.title}</h3>
                <p className="company">{job.company}</p>
                <p className="location">{job.location}</p>
                <span className="job-type">{job.type}</span>
                <button className="apply-btn" onClick={(e) => { e.stopPropagation(); handleJobClick(job._id); }}>View Details</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No jobs found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
