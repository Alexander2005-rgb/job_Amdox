# Job Portal

A full-stack web application that connects job seekers with employers, enabling job posting, searching, applications, and real-time notifications.

## Features

- **User Authentication**: Local registration/login and Google OAuth integration
- **Role-Based Access**: Separate dashboards for Job Seekers and Employers
- **Job Management**: Employers can post, update, and delete job listings
- **Job Search**: Advanced filtering by title, location, company, and job type
- **Applications**: Job seekers can apply for jobs and track application status
- **User Profiles**: Comprehensive profiles with resume and photo uploads
- **Notifications**: Database-driven notifications (real-time features removed for serverless compatibility)
- **Responsive Design**: Mobile-friendly React frontend

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **Socket.io** - Real-time communication
- **Multer** - File upload handling
- **JWT** - JSON Web Tokens for session management

### Frontend

- **React** - UI library
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time client
- **CSS** - Styling

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)
- Google OAuth credentials (for Google login functionality)

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd jobportal
   ```

2. **Install backend dependencies**:

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

## Environment Variables Setup

Create a `.env` file in the `backend` directory with the following environment variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
SESSION_SECRET=your-unique-session-secret-here
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen if prompted
6. Set the application type to "Web application"
7. Add authorized redirect URIs:
   - For local development: `http://localhost:5000/api/auth/google/callback`
   - For production (Vercel): `https://your-vercel-app.vercel.app/api/auth/google/callback`
8. Copy the Client ID and Client Secret to your `.env` file

## Running the Application

1. **Start MongoDB**:

   - If using local MongoDB, ensure it's running on the default port (27017)
   - For MongoDB Atlas, update the `MONGO_URI` in your `.env` file

2. **Start the backend server**:

   ```bash
   cd backend
   npm run dev
   ```

   The backend API will be available at `http://localhost:5000`

3. **Start the frontend application**:
   ```bash
   cd frontend
   npm start
   ```
   The React app will open at `http://localhost:3000`

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register a new user account
- `POST /api/auth/login` - Authenticate user login
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Handle Google OAuth callback

### Job Routes

- `GET /api/jobs` - Retrieve all jobs with optional filters (search, location, type)
- `GET /api/jobs/:id` - Get details of a specific job
- `POST /api/jobs` - Create a new job posting (employers only)
- `PUT /api/jobs/:id` - Update an existing job (employers only, own jobs)
- `DELETE /api/jobs/:id` - Delete a job posting (employers only, own jobs)

### Application Routes

- `GET /api/applications` - Get user's job applications
- `POST /api/applications` - Submit a job application
- `PUT /api/applications/:id` - Update application status

### Profile Routes

- `GET /api/profile` - Retrieve user profile information
- `PUT /api/profile` - Update user profile details

### Notification Routes

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## Project Structure

```
jobportal/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema and model
│   │   ├── Job.js               # Job posting schema
│   │   ├── Application.js       # Job application schema
│   │   └── Notification.js      # Notification schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── jobs.js              # Job-related routes
│   │   ├── applications.js      # Application management routes
│   │   ├── profile.js           # User profile routes
│   │   └── notifications.js     # Notification routes
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── uploads/                 # File upload directory
│   ├── package.json             # Backend dependencies
│   ├── server.js                # Main server file
│   └── .env                     # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js          # Landing page
│   │   │   ├── Login.js         # Login form
│   │   │   ├── Register.js      # Registration form
│   │   │   ├── EmployerPage.js  # Employer dashboard
│   │   │   ├── JobSeekerPage.js # Job seeker dashboard
│   │   │   ├── SearchResults.js # Job search results
│   │   │   ├── JobDetails.js    # Individual job details
│   │   │   ├── About.js         # About page
│   │   │   ├── Contact.js       # Contact page
│   │   │   ├── Privacy.js       # Privacy policy
│   │   │   └── Companies.js     # Companies page
│   │   ├── App.js               # Main React component
│   │   ├── App.css              # Global styles
│   │   └── index.js             # React entry point
│   ├── public/                  # Static assets
│   └── package.json             # Frontend dependencies
└── README.md                    # Project documentation
```

## Usage Guide

### For Job Seekers:

1. Register or login to your account
2. Complete your profile with resume and personal details
3. Search for jobs using filters
4. View job details and apply to positions
5. Track your applications in the dashboard
6. Receive real-time notifications

### For Employers:

1. Register as an employer account
2. Post new job openings with detailed requirements
3. Manage your job listings (edit/delete)
4. View applications received for your jobs
5. Update application statuses
6. Communicate with applicants

## Development

### Backend Development

- Use `npm run dev` for development with nodemon auto-restart
- API testing can be done using tools like Postman or Insomnia
- File uploads are handled in the `uploads/` directory

### Frontend Development

- Hot reloading is enabled during development
- Component structure follows React best practices
- Real-time features use Socket.io for instant updates

## Deployment

### Backend Deployment on Vercel

1. **Prepare the backend for deployment**:

   - Ensure all environment variables are set in Vercel dashboard
   - Update Google OAuth redirect URI to include your Vercel domain
   - Set `NODE_ENV=production` in environment variables

2. **Deploy to Vercel**:

   - Connect your GitHub repository to Vercel
   - Set the root directory to `backend`
   - Vercel will automatically detect the `vercel.json` configuration
   - Add environment variables in Vercel dashboard:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `SESSION_SECRET`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `BASE_URL` (your Vercel backend URL)
     - `FRONTEND_URL` (your frontend URL)
     - `NODE_ENV=production`

3. **Frontend Deployment**:
   - Deploy the frontend separately (e.g., to Vercel, Netlify, or another platform)
   - Update `FRONTEND_URL` in backend environment variables
   - Ensure CORS is configured correctly

### Environment Variables for Production

For Vercel deployment, set these environment variables in your Vercel project settings:

```env
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secure-jwt-secret
SESSION_SECRET=your-secure-session-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
BASE_URL=https://your-backend-app.vercel.app
FRONTEND_URL=https://your-frontend-app.vercel.app
NODE_ENV=production
```

**Note**: Real-time notifications via Socket.IO are not supported in Vercel's serverless environment. The application now uses database-driven notifications that can be polled by the frontend.

## Contributing

We welcome contributions to improve the Job Portal! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**:

   - Ensure MongoDB is running locally or check your Atlas connection string
   - Verify the `MONGO_URI` in your `.env` file

2. **Google OAuth Not Working**:

   - Double-check your Google OAuth credentials
   - Ensure redirect URI matches exactly: `http://localhost:5000/api/auth/google/callback`

3. **File Upload Issues**:

   - Ensure the `uploads/` directory exists and is writable
   - Check file size limits in multer configuration

4. **CORS Errors**:
   - Backend is configured to allow requests from `http://localhost:3000`
   - Ensure frontend is running on the correct port

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Contact

For questions or support, please contact the development team or create an issue in the repository.

---

**Note**: This documentation covers the complete setup and usage of the Job Portal application. Make sure to follow each step carefully for a smooth development experience.
