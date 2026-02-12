import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import EmployerPage from './components/EmployerPage';
import JobSeekerPage from './components/JobSeekerPage';
import SearchResults from './components/SearchResults';
import JobDetails from './components/JobDetails';
import About from './components/About';
import Contact from './components/Contact';
import Privacy from './components/Privacy';
import Companies from './components/Companies';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <OAuthHandler />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employer" element={<EmployerPage />} />
          <Route path="/jobseeker" element={<JobSeekerPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/companies" element={<Companies />} />
        </Routes>
      </div>
    </Router>
  );
}

// Component to handle OAuth callback
function OAuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const role = urlParams.get('role');
    const error = urlParams.get('error');

    if (token && role) {
      // Store token and role, then navigate based on role
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      if (role === 'jobseeker') {
        navigate('/jobseeker');
      } else if (role === 'employer') {
        navigate('/employer');
      }
      // Clean up URL
      window.history.replaceState({}, document.title, location.pathname);
    } else if (error) {
      // Handle error, e.g., show message
      console.error('OAuth error:', error);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location, navigate]);

  return null;
}

export default App;
