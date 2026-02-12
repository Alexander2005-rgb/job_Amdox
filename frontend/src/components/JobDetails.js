import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  const fetchJobDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data);
      } else {
        setMessage('Job not found');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      setMessage('Error loading job details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId: id })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Application submitted successfully!');
      } else {
        setMessage(data.message || 'Error applying for job');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      setMessage('Network error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="job-details"><p>Loading job details...</p></div>;
  }

  if (!job) {
    return <div className="job-details"><p>{message}</p></div>;
  }

  return (
    <div className="job-details">
      <header className="header">
        <div className="logo">👩‍💻JobPortal</div>
        <nav className="nav">
          <button className="nav-btn" onClick={() => navigate('/')}>Home</button>
        </nav>
      </header>

      <div className="job-content" style={{ backgroundImage: `url(${job.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="job-overlay"></div>
        <h1>{job.title}</h1>
        <p className="company">{job.company}</p>
        <p className="location">{job.location}</p>
        <span className="job-type">{job.type}</span>

        <div className="job-section">
          <h2>Description</h2>
          <p>{job.description}</p>
        </div>
       

        <div className="job-section">
          <h2>Qualifications</h2>
          <p>{job.qualifications}</p>
        </div>

        <div className="job-section">
          <h2>Responsibilities</h2>
          <p>{job.responsibilities}</p>
        </div>

        {job.salary && (
          <div className="job-section">
            <h2>Salary</h2>
            <p>{job.salary}</p>
          </div>

        )}

        <button
          className="apply-btn"
          onClick={handleApply}
          disabled={applying}
        >
          {applying ? 'Applying...' : 'Apply Now'}
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default JobDetails;
