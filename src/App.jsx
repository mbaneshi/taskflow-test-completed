/**
 * Main Application Component
 * 
 * Serves as the root component for the TaskFlow application, handling routing,
 * authentication protection, and layout structure. Implements a comprehensive
 * routing system with protected routes and role-based access control.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import NotificationProvider from './contexts/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Landing from './pages/Landing';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './pages/UserPages/Dashboard';
import ProfilePage from './pages/UserPages/ProfilePage';
import CalendarPage from './pages/UserPages/CalendarPage';
import NotificationsPage from './pages/UserPages/NotificationsPage';
import AdminDashboard from './pages/AdminPages/Dashboard';
import ManageTasks from './pages/AdminPages/ManageTasks';
import ManageUsers from './pages/AdminPages/ManageUsers';
import UserLogPage from './pages/AdminPages/UserLogPage';
import Settings from './pages/AdminPages/Settings';
import Users from './pages/AdminPages/Users';
import PWAInstaller from './components/common/PWAInstaller';
import RealTimeCollaboration from './components/collaboration/RealTimeCollaboration';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import TwoFactorAuth from './components/auth/TwoFactorAuth';
import CustomizableDashboard from './components/dashboard/CustomizableDashboard';
import AdvancedAnalytics from './components/analytics/AdvancedAnalytics';
import IntegrationHub from './components/integrations/IntegrationHub';
import KeyboardShortcuts from './components/common/KeyboardShortcuts';
import FeatureShowcase from './components/demo/FeatureShowcase';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/showcase" element={<FeatureShowcase />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected User Routes */}
                <Route path="/user" element={<ProtectedRoute />}>
                  <Route index element={<Navigate to="/user/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="analytics" element={<AnalyticsDashboard />} />
                  <Route path="2fa" element={<TwoFactorAuth />} />
                  <Route path="custom-dashboard" element={<CustomizableDashboard />} />
                  <Route path="advanced-analytics" element={<AdvancedAnalytics />} />
                  <Route path="integrations" element={<IntegrationHub />} />
                </Route>

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute requireAdmin />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="tasks" element={<ManageTasks />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="logs" element={<UserLogPage />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="user-management" element={<Users />} />
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            
            {/* Global Components */}
            <PWAInstaller />
            <RealTimeCollaboration />
            <KeyboardShortcuts onShortcut={(action) => {
              // Handle different shortcut actions here
              // TODO: Implement proper action handling
            }} />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
