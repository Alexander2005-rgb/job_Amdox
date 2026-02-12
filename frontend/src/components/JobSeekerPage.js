import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

function JobSeekerPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    resume: null,
    photo: null,
    phone: '',
    address: '',
    linkedin: ''
  });
  const [message, setMessage] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'jobseeker') {
        navigate('/login');
        return;
      }
      setUser(payload);
      fetchProfile();
      fetchAppliedJobs();
      fetchNotifications();

      // Initialize Socket.IO connection
      const socket = io('http://localhost:5000');

      // Join user room for notifications
      socket.emit('join', payload.userId);

      // Listen for application status updates
      socket.on('applicationStatusUpdate', (data) => {
        // Refresh notifications from API to include the new persistent notification
        fetchNotifications();
      });

      // Cleanup on unmount
      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.error('Invalid token');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

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
          resume: data.resume || '',
          phone: data.phone || '',
          address: data.address || '',
          linkedin: data.linkedin || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAppliedJobs = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/applications/my-applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const applications = await response.json();
        // Filter out applications where jobId is null (job deleted)
        setAppliedJobs(applications.filter(app => app.jobId));
      }
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
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
      formData.append('phone', profileFormData.phone);
      formData.append('address', profileFormData.address);
      formData.append('linkedin', profileFormData.linkedin);
      if (profileFormData.resume) {
        formData.append('resume', profileFormData.resume);
      }
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="jobseeker-page">
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
        <h1>Job Seeker Dashboard</h1>
        <p>Hello, {profile.name || user.email}!</p>

        <div className="dashboard-section">
          <h2>My Profile</h2>
          <button className="edit-btn" onClick={() => setShowProfileForm(true)}>Edit Profile</button>
          <div className="profile-info">
            <p><strong>Name:</strong> {profile.name || 'Not set'}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {profile.phone || 'Not set'}</p>
            <p><strong>Address:</strong> {profile.address || 'Not set'}</p>
            <p><strong>LinkedIn:</strong> {profile.linkedin || 'Not set'}</p>
            <p><strong>Resume:</strong> {profile.resume ? 'Uploaded' : 'Not uploaded'}</p>
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
          <h2>My Applications ({appliedJobs.length})</h2>
          {appliedJobs.length > 0 ? (
            <div className="application-list">
              {appliedJobs.map(application => (
                <div key={application._id} className="job-card">
                  <h3>{application.jobId.title}</h3>
                  <p>{application.jobId.company} - {application.jobId.location}</p>
                  <p><strong>Status:</strong> <span className={`status-${application.status}`}>{application.status}</span></p>
                  <p><strong>Applied:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                  <span className="job-type">{application.jobId.type}</span>
                  <button className='view-job-button'  onClick={() => navigate(`/job/${application.jobId._id}`)}>View </button>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't applied to any jobs yet. <a href="/">Browse jobs</a></p>
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
                  name="resume"
                  placeholder='Resume'
                  accept=".pdf,.doc,.docx,image/*"
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

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default JobSeekerPage;
