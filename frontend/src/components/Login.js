import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      // Redirect based on role
      if (role === 'employer') {
        navigate('/employer');
      } else if (role === 'jobseeker') {
        navigate('/jobseeker');
      }
    }
  }, [navigate]);

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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        // Redirect based on role
        if (data.user.role === 'employer') {
          navigate('/employer');
        } else if (data.user.role === 'jobseeker') {
          navigate('/jobseeker');
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Network error');
    }
  };

  return (
    <div className="login">

      <form onSubmit={handleSubmit}>
        <div className="logo" style={{ alignSelf: 'center', marginBottom:'20px' }}>👩‍💻JobPortal</div>
        <h2>Login in it your account</h2>

        <p>Don't have an account? <a href="/register">Sign UP</a></p>
        <button className='googleButton' style={{backgroundColor:'white'}} onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}>Google</button>
        <br/>
        <h2 style={{color:'gray',fontSize:'20px'}}>---------OR----------</h2>
        {/* <h2>Login</h2> */}
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
        <button type="submit">Login</button>
        {message && <p>{message}</p>}
        
      </form>
    </div>
  );
}

export default Login;
