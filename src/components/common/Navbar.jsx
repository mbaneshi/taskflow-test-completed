import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showNotification('Logged out successfully', 'success');
      navigate('/');
    } catch {
      showNotification('Error logging out', 'error');
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname.startsWith(path);
  };

  const userMenuItems = [
    { label: 'Dashboard', path: '/user/dashboard', icon: '📊' },
    { label: 'Custom Dashboard', path: '/user/custom-dashboard', icon: '🎨' },
    { label: 'Analytics', path: '/user/analytics', icon: '📈' },
    { label: 'Advanced Analytics', path: '/user/advanced-analytics', icon: '📊' },
    { label: 'Integrations', path: '/user/integrations', icon: '🔗' },
    { label: 'Calendar', path: '/user/calendar', icon: '📅' },
    { label: 'Notifications', path: '/user/notifications', icon: '🔔' },
    { label: 'Profile', path: '/user/profile', icon: '👤' },
    { label: '2FA Security', path: '/user/2fa', icon: '🔐' }
  ];

  const adminMenuItems = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: '⚡' },
    { label: 'Manage Tasks', path: '/admin/tasks', icon: '📋' },
    { label: 'Manage Users', path: '/admin/users', icon: '👥' },
    { label: 'User Logs', path: '/admin/logs', icon: '📝' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🚀</span>
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {user ? (
              <>
                {/* User Navigation */}
                <div className="flex items-center space-x-6">
                  <Link
                    to="/user/dashboard"
                    className={`text-sm font-medium transition-colors ${ isActiveRoute('/user/dashboard') 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    📊 Dashboard
                  </Link>
                  
                  <Link
                    to="/user/custom-dashboard"
                    className={`text-sm font-medium transition-colors ${ isActiveRoute('/user/custom-dashboard') 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    🎨 Custom Dashboard
                  </Link>
                  
                  <Link
                    to="/user/analytics"
                    className={`text-sm font-medium transition-colors ${ isActiveRoute('/user/analytics') 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    📈 Analytics
                  </Link>
                  
                  <Link
                    to="/user/integrations"
                    className={`text-sm font-medium transition-colors ${ isActiveRoute('/user/integrations') 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    🔗 Integrations
                  </Link>
                </div>

                {/* Admin Navigation */}
                {user.role === 'admin' && (
                  <div className="flex items-center pl-6 space-x-6 border-l border-gray-200">
                    <Link
                      to="/admin/dashboard"
                      className={`text-sm font-medium transition-colors ${ isActiveRoute('/admin') 
                          ? 'text-purple-600' 
                          : 'text-gray-700 hover:text-purple-600'
                      }`}
                    >
                      ⚡ Admin
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link to="/signup">
                  <Button className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Link
                to="/user/notifications"
                className="relative p-2 text-gray-600 transition-colors hover:text-blue-600"
              >
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Link>

              {/* User Avatar and Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 focus:outline-none"
                >
                  <div className="flex justify-center items-center w-8 h-8 font-bold text-white bg-blue-500 rounded-full">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:block">{user.username}</span>
                  <span className="text-gray-400">▼</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 z-50 py-2 mt-2 w-64 bg-white rounded-lg border border-gray-200 shadow-lg">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-500 capitalize">Role: {user.role}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 space-x-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>

                    {/* Admin Section */}
                    {user.role === 'admin' && (
                      <>
                        <div className="my-2 border-t border-gray-200"></div>
                        <div className="px-4 py-2">
                          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Admin</p>
                        </div>
                        <div className="py-2">
                          {adminMenuItems.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center px-4 py-2 space-x-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              <span className="text-lg">{item.icon}</span>
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Logout */}
                    <div className="my-2 border-t border-gray-200"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 space-x-3 w-full text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <span className="text-lg">🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 transition-colors hover:text-blue-600"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="py-4 border-t border-gray-200 md:hidden">
            {user ? (
              <div className="space-y-4">
                {/* User Mobile Navigation */}
                <div className="space-y-2">
                  <p className="px-4 text-xs font-medium tracking-wide text-gray-500 uppercase">User Menu</p>
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-2 space-x-3 text-sm text-gray-700 rounded-lg transition-colors hover:bg-gray-50"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Admin Mobile Navigation */}
                {user.role === 'admin' && (
                  <div className="space-y-2">
                    <div className="my-2 border-t border-gray-200"></div>
                    <p className="px-4 text-xs font-medium tracking-wide text-gray-500 uppercase">Admin Menu</p>
                    {adminMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-2 space-x-3 text-sm text-gray-700 rounded-lg transition-colors hover:bg-gray-50"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Logout */}
                <div className="my-2 border-t border-gray-200"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 space-x-3 w-full text-sm text-red-600 rounded-lg transition-colors hover:bg-red-50"
                >
                  <span className="text-lg">🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="px-4 py-2 w-full text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
