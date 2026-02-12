import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

function EmployerPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    company: '',
    companyDescription: '',
    photo: null,
    phone: '',
    address: '',
    linkedin: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    qualifications: '',
    responsibilities: '',
    location: '',
    salary: '',
    company: '',
    type: 'Full-time'
  });
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const navigate = useNavigate();

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Filter jobs created by this employer
        const employerJobs = data.filter(job => job.employerId && job.employerId._id === user.userId);
        setJobs(employerJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'employer') {
        navigate('/login');
        return;
      }
      setUser(payload);

      // Initialize Socket.IO connection
      const newSocket = io('http://localhost:5000');

      // Join user room for notifications
      newSocket.emit('join', payload.userId);

      // Listen for new applications
      newSocket.on('newApplication', (data) => {
        // Refresh notifications from API to include the new persistent notification
        fetchNotifications();
        // Refresh applications list
        fetchApplications();
      });

      // Listen for application status updates (for employers, maybe when they update and want to see changes)
      newSocket.on('applicationStatusUpdate', (data) => {
        // Refresh applications list to reflect changes
        fetchApplications();
      });

      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
      };
    } catch (error) {
      console.error('Invalid token');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchJobs();
      fetchApplications();
      fetchNotifications();
    }
  }, [user, fetchJobs]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setProfileFormData({
          name: data.name || '',
          company: data.company || '',
          companyDescription: data.companyDescription || '',
          phone: data.phone || '',
          address: data.address || '',
          linkedin: data.linkedin || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchApplications = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoadingNotifications(true);
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Transform the data to match the expected format
        const formattedNotifications = data.map(notification => ({
          id: notification._id,
          type: notification.type,
          message: notification.message,
          timestamp: new Date(notification.createdAt),
          read: notification.read
        }));
        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleProfileInputChange = (e) => {
    if (e.target.type === 'file') {
      setProfileFormData({
        ...profileFormData,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setProfileFormData({
        ...profileFormData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (isUpdatingProfile) return;
    setIsUpdatingProfile(true);
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const formData = new FormData();
      formData.append('name', profileFormData.name);
      formData.append('company', profileFormData.company);
      formData.append('companyDescription', profileFormData.companyDescription);
      formData.append('phone', profileFormData.phone);
      formData.append('address', profileFormData.address);
      formData.append('linkedin', profileFormData.linkedin);
      if (profileFormData.photo) {
        formData.append('photo', profileFormData.photo);
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Profile updated successfully!');
        setProfile(data);
        setShowProfileForm(false);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Network error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Job created successfully!');
        setShowCreateForm(false);
        setFormData({
          title: '',
          description: '',
          qualifications: '',
          responsibilities: '',
          location: '',
          salary: '',
          company: '',
          type: 'Full-time',
          image: null
        });
        fetchJobs();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Network error');
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      qualifications: job.qualifications,
      responsibilities: job.responsibilities,
      location: job.location,
      salary: job.salary,
      company: job.company,
      type: job.type
    });
    setShowCreateForm(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${editingJob._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Job updated successfully!');
        setShowCreateForm(false);
        setEditingJob(null);
        setFormData({
          title: '',
          description: '',
          qualifications: '',
          responsibilities: '',
          location: '',
          salary: '',
          company: '',
          type: 'Full-time'
        });
        fetchJobs();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Network error');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage('Job deleted successfully!');
        fetchJobs();
      } else {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Network error');
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setMessage('Application status updated!');
        fetchApplications();
      } else {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="employer-page">
      <header className="header">
        <div className="logo">👩‍💻JobPortal</div>
        <nav className="nav">
          {profile.photo && (
            <img
              src={`http://localhost:5000/uploads/${profile.photo}`}
              alt="Profile"
              className="profile-photo"
              style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
            />
          )}
          <button className="nav-btn" onClick={() => navigate('/')}>Home</button>
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <div className="dashboard">
        <h1>Employer Dashboard</h1>
        <p>Hello, {user.email}!</p>

        <div className="dashboard-section">
          <h2>My Profile</h2>
          <button className="edit-btn" onClick={() => setShowProfileForm(true)}>Edit Profile</button>
          <div className="profile-info">
            <p><strong>Name:</strong> {profile.name || 'Not set'}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Company:</strong> {profile.company || 'Not set'}</p>
            <p><strong>Company Description:</strong> {profile.companyDescription || 'Not set'}</p>
            <p><strong>Phone:</strong> {profile.phone || 'Not set'}</p>
            <p><strong>Address:</strong> {profile.address || 'Not set'}</p>
            <p><strong>LinkedIn:</strong> {profile.linkedin || 'Not set'}</p>
            {profile.photo ? <img src={`http://localhost:5000/uploads/${profile.photo}`} alt="Profile" className="profile-photo-large" /> : <p><strong>Photo:</strong> Not uploaded</p>}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Notifications</h2>
          {loadingNotifications ? (
            <p>Loading notifications...</p>
          ) : notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification-card ${notification.read ? 'read' : 'unread'}`}>
                  <p>{notification.message}</p>
                  <small>{notification.timestamp.toLocaleString()}</small>
                </div>
              ))}
            </div>
          ) : (
            <p>No new notifications.</p>
          )}
        </div>

        <div className="dashboard-section">
          <h2>My Jobs</h2>
          <button className="create-btn" onClick={() => setShowCreateForm(true)}>Create New Job</button>
          {jobs.length > 0 ? (
            <div className="job-list">
              {jobs.map(job => (
                <div key={job._id} className="job-card">
                  <h3>{job.title}</h3>
                  <p>{job.company} - {job.location}</p>
                  <div className="job-actions">
                    <button onClick={() => handleEditJob(job)}>Edit</button>
                    <button onClick={() => handleDeleteJob(job._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No jobs posted yet.</p>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Applications</h2>
          {applications.length > 0 ? (
            <div className="application-list">
              {applications.map(app => (
                <div key={app._id} className="application-card">
                  <h3>{app.jobId ? app.jobId.title : 'Job Title'}</h3>
                  <div className="applicant-details">
                    <p><strong>Applicant:</strong> {app.userId ? (app.userId.name || app.userId.email) : 'Unknown'}</p>
                    <p><strong>Email:</strong> {app.userId ? app.userId.email : 'N/A'}</p>
                    <p><strong>Phone:</strong> {app.userId ? app.userId.phone : 'N/A'}</p>
                    <p><strong>Address:</strong> {app.userId ? app.userId.address : 'N/A'}</p>
                    <p><strong>LinkedIn:</strong> {app.userId && app.userId.linkedin ? <a href={app.userId.linkedin} target="_blank" rel="noopener noreferrer">{app.userId.linkedin}</a> : 'N/A'}</p>
                    <p><strong>Resume:</strong> {app.userId && app.userId.resume ? <a href={`http://localhost:5000/uploads/${app.userId.resume}`} target="_blank" rel="noopener noreferrer">View Resume</a> : 'Not uploaded'}</p>
                  </div>
                  <p><strong>Status:</strong> {app.status}</p>
                  <p><strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                  <div className="application-actions">
                    <button onClick={() => handleUpdateApplicationStatus(app._id, 'accepted')}>Accept</button>
                    <button onClick={() => handleUpdateApplicationStatus(app._id, 'rejected')}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No applications received yet.</p>
          )}
        </div>

        {showProfileForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Profile</h2>
              <form onSubmit={handleUpdateProfile}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={profileFormData.name}
                  onChange={handleProfileInputChange}
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={profileFormData.company}
                  onChange={handleProfileInputChange}
                />
                <textarea
                  name="companyDescription"
                  placeholder="Company Description"
                  value={profileFormData.companyDescription}
                  onChange={handleProfileInputChange}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={profileFormData.phone}
                  onChange={handleProfileInputChange}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={profileFormData.address}
                  onChange={handleProfileInputChange}
                />
                <input
                  type="url"
                  name="linkedin"
                  placeholder="LinkedIn Profile URL"
                  value={profileFormData.linkedin}
                  onChange={handleProfileInputChange}
                />
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleProfileInputChange}
                />
                <button type="submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                </button>
                <button type="button" onClick={() => setShowProfileForm(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {showCreateForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingJob ? 'Edit Job' : 'Create New Job'}</h2>
              <form onSubmit={editingJob ? handleUpdateJob : handleCreateJob}>
                <input
                  type="text"
                  name="title"
                  placeholder="Job Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
                <textarea
                  name="description"
                  placeholder="Job Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="qualifications"
                  placeholder="Qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="responsibilities"
                  placeholder="Responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  required
                />
                
                <input
                  type="text"
                  name="salary"
                  placeholder="Salary (optional)"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                <button type="submit">{editingJob ? 'Update Job' : 'Create Job'}</button>
                <button type="button" onClick={() => { setShowCreateForm(false); setEditingJob(null); }}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default EmployerPage;
