# TaskFlow Backend Server

## Overview
This is the backend server for the TaskFlow application, implementing a complete MERN stack with Node.js, Express, and MongoDB. The server provides RESTful APIs for authentication, task management, user management, and comprehensive user activity logging.

## Features Implemented

### ✅ Task 1: Authentication System
- **JWT-based authentication** with secure token management
- **User registration and login** with password hashing
- **Role-based access control** (admin/user)
- **Protected routes** with middleware authentication
- **Password management** (change password, reset)

### ✅ Task 2: Task Management & Filtering
- **Complete CRUD operations** for tasks
- **Advanced filtering** by completion status (complete/incomplete)
- **Search functionality** by title, description, and tags
- **Priority and due date filtering**
- **Pagination and sorting** capabilities
- **Task assignment and progress tracking**

### ✅ Task 3: User Activity Logging
- **Comprehensive user activity tracking** (login, logout, actions)
- **All required fields**: login time, logout time, JWT token, username, role, IP address
- **Admin-only access** to user logs
- **DELETE functionality** for log entries (individual and bulk)
- **Advanced filtering and search** for logs
- **Analytics and reporting** capabilities

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User authentication
- `POST /logout` - User logout
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password
- `POST /refresh-token` - Refresh JWT token

### Tasks (`/api/tasks`)
- `GET /` - Get tasks with filtering and search
- `GET /:id` - Get specific task
- `POST /` - Create new task
- `PUT /:id` - Update task
- `DELETE /:id` - Delete task
- `POST /:id/complete` - Mark task as complete
- `POST /:id/progress` - Update task progress
- `POST /:id/comments` - Add comment to task

### Users (`/api/users`) - Admin Only
- `GET /` - Get all users with filtering
- `GET /:id` - Get specific user
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user
- `POST /:id/activate` - Activate user account
- `POST /:id/deactivate` - Deactivate user account
- `POST /:id/change-role` - Change user role
- `GET /:id/activity` - Get user activity summary

### Logs (`/api/logs`) - Admin Only
- `GET /` - Get user activity logs with filtering
- `GET /:id` - Get specific log entry
- `DELETE /:id` - Delete log entry
- `DELETE /bulk` - Bulk delete log entries
- `GET /user/:userId` - Get logs for specific user
- `GET /analytics/summary` - Get log analytics

## Database Models

### User Model
- Username, email, password (hashed)
- Role (admin/user), active status
- Login/logout tracking
- Timestamps and audit fields

### Task Model
- Title, description, status, priority
- Due dates, progress tracking
- User assignments and comments
- Tags and attachments support

### UserLog Model
- Complete activity tracking
- JWT token information
- IP address and device details
- Session duration and metadata

## Security Features

- **Password hashing** with bcrypt (12 salt rounds)
- **JWT token validation** with expiration
- **Role-based access control** (RBAC)
- **Input validation** and sanitization
- **Rate limiting** protection
- **CORS configuration** for frontend integration
- **Error handling** without information leakage

## Middleware

### Authentication Middleware
- `authenticateToken` - JWT verification
- `requireRole` - Role-based access control
- `requireAdmin` - Admin-only access
- `requireOwnershipOrAdmin` - Resource ownership validation

### Logging Middleware
- `logUserActivity` - Automatic activity logging
- `logLogin/logout` - Specific authentication logging
- **IP address detection** and logging
- **User agent parsing** and device information

## Getting Started

### Prerequisites
- Node.js v20.14.0+
- MongoDB 6.0+
- NPM v10.7.0+

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start MongoDB service

4. Run the server:
   ```bash
   npm run server
   # or for development with frontend:
   npm run dev
   ```

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Development

### Project Structure
```
server/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route definitions
│   ├── utils/           # Utility functions
│   └── index.js         # Main server file
├── README.md            # This file
└── package.json         # Dependencies
```

### Testing
- API endpoints can be tested with Postman or similar tools
- Use the health check endpoint: `GET /api/health`
- Test authentication flow: register → login → access protected routes

### Database Operations
- All models include proper indexing for performance
- Aggregation pipelines for complex queries
- Virtual fields for computed properties
- Pre/post hooks for data validation

## Production Considerations

- **Environment variables** for sensitive data
- **MongoDB Atlas** for cloud database
- **PM2** or similar for process management
- **Nginx** for reverse proxy and load balancing
- **SSL/TLS** certificates for HTTPS
- **Monitoring and logging** solutions
- **Backup strategies** for database

## API Documentation

### Authentication Flow
1. User registers with username, email, password
2. Server creates user with hashed password
3. User logs in with email/password
4. Server validates credentials and returns JWT token
5. Frontend includes token in Authorization header
6. Protected routes validate token and provide access

### Task Filtering (Task 2)
- **Status filtering**: `?status=complete` or `?status=incomplete`
- **Search filtering**: `?search=project`
- **Combined filtering**: `?status=incomplete&search=urgent`
- **Pagination**: `?page=1&limit=20`
- **Sorting**: `?sortBy=dueDate&sortOrder=asc`

### User Logs (Task 3)
- **Display logs**: `GET /api/logs` with filtering options
- **Delete logs**: `DELETE /api/logs/:id` for individual deletion
- **Bulk operations**: `DELETE /api/logs/bulk` for multiple deletions
- **User-specific logs**: `GET /api/logs/user/:userId`
- **Analytics**: `GET /api/logs/analytics/summary`

## Performance Features

- **Database indexing** on frequently queried fields
- **Pagination** for large datasets
- **Aggregation pipelines** for complex statistics
- **Connection pooling** for MongoDB
- **Efficient queries** with proper field selection
- **Caching strategies** for frequently accessed data

## Error Handling

- **Consistent error format** across all endpoints
- **HTTP status codes** following REST conventions
- **Detailed error messages** in development
- **Generic error messages** in production
- **Validation errors** with field-specific details
- **Database error handling** with graceful fallbacks

## Contributing

1. Follow the existing code structure and patterns
2. Add proper JSDoc comments for new functions
3. Include error handling for all new endpoints
4. Test thoroughly before submitting changes
5. Update this README for new features

## License

This project is part of the TaskFlow test implementation.
