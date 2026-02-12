import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs');
      if (response.ok) {
        const jobs = await response.json();
        // Get first 3 jobs as featured
        setFeaturedJobs(jobs.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchInternships = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5000/api/jobs?type=Internship');
  //     if (response.ok) {
  //       const internships = await response.json();
  //       // Get first 3 internships
  //       setInternships(internships.slice(0, 3));
  //     }
  //   } catch (error) {
  //     console.error('Error fetching internships:', error);
  //   }
  // };

  const handleLoginClick = () => {
    navigate('/login');
  };

  // const handleRegisterClick = () => {
  //   navigate('/register');
  // };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results with query params
    navigate(`/search?search=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}`);
  };

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  // Dummy data for categories
  const categories = [
    'Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Engineering','science'
  ];

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="logo">👩‍💻JobPortal</div>
        <nav className="nav">
          <button className="nav-btn" onClick={() => navigate('/')}>Home</button>
          <button className="nav-btn" onClick={() => navigate('/search')}>Jobs</button>
          <button className="nav-btn" onClick={() => navigate('/companies')}>Companies</button>
          {isLoggedIn ? (
            <div className="nav-user">
              {/* <span>{userRole === 'jobseeker' ? 'Job Seeker' : 'Employer'}!</span> */}
              <button className="nav-btn" onClick={() => navigate(userRole === 'jobseeker' ? '/jobseeker' : '/employer')}>Profile</button>
              <button className="nav-btn" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); setIsLoggedIn(false); setUserRole(null); }}>Logout</button>
            </div>
          ) : (
            <button className="nav-btn" onClick={handleLoginClick}>Sign In</button>
          )}
          {/* <button className="nav-btn register-btn" onClick={handleRegisterClick}>Register</button> */}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        {/* <img className='hero-image' src="/images/heropage.jpeg" alt="background" /> */}
        <div className="hero-content">
          <h1>Find Your Dream Job</h1>
          <p>Discover thousands of job opportunities from top companies worldwide.</p>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Search Jobs</button>
          </form>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-jobs">
        <h2>Featured Jobs</h2>
        <div className="job-list">
          {loading ? (
            <p>Loading jobs...</p>
          ) : featuredJobs.length > 0 ? (
            featuredJobs.map(job => (
              <div key={job._id} className="job-card" onClick={() => handleJobClick(job._id)}>
                <div className="job-image-container">
                  {job.image ? (
                    <img src={`http://localhost:5000/uploads/${job.image}`} alt={job.title} className="job-image" />
                  ) : (
                    <div className="job-image-placeholder">No Image</div>
                  )}
                </div>
                <div className="job-details-container">
                  <h3>{job.title}</h3>
                  <p className="company">Company: {job.company}</p>
                  <p className="location">Location: {job.location}</p>
                  <span className="job-type">{job.type}</span>
                  <button className="apply-btn" onClick={(e) => { e.stopPropagation(); handleJobClick(job._id); }}>View Details</button>
                </div>
              </div>
            ))
          ) : (
            <p>No jobs available at the moment.</p>
          )}
        </div>
      </section>



      {/* Categories Section */}
      <section className="categories">
        <h2>Explore Job Categories</h2>
        <div className="category-list">
          {categories.map(category => (
            <div key={category} className="category-card">
              <h3>{category}</h3>
              <p>Find jobs in {category.toLowerCase()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
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

export default Home;
