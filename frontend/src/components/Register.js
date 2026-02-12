import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'jobseeker'
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Redirect to login after successful registration
        navigate('/login');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Network error');
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="logo" style={{ alignSelf: 'center', marginBottom:'20px' }}>👩‍💻JobPortal</div>
        <p>Already have an account? <a href="/login">Login here</a></p>
        <h2>Sign UP</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleInputChange}>
          <option value="jobseeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <button type="submit">Sign Up</button>
        {message && <p>{message}</p>}
        
      </form>
    </div>
  );
}

export default Register;
