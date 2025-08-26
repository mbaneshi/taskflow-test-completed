import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaBell, FaCog } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'

interface NavItem {
  label: string
  path: string
  icon?: React.ReactNode
}

interface NavbarProps {
  className?: string
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const { user, logout } = useAuth()
  const { notifications, markAsRead } = useNotifications()
  const location = useLocation()

  // Navigation items
  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tasks', path: '/tasks' },
    { label: 'Calendar', path: '/calendar' },
    { label: 'Analytics', path: '/analytics' }
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [location.pathname])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Element
      if (!target.closest('.navbar-menu') && !target.closest('.user-menu')) {
        setIsMobileMenuOpen(false)
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async (): Promise<void> => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read).length

  const baseClasses = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300'
  const scrolledClasses = isScrolled 
    ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200' 
    : 'bg-transparent'

  return (
    <nav className={`${baseClasses} ${scrolledClasses} ${className}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex justify-center items-center w-8 h-8 bg-blue-600 rounded-lg">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-baseline ml-10 space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - User menu and notifications */}
          <div className="hidden items-center space-x-4 md:flex">
            {/* Notifications */}
            <div className="relative">
              <button
                className="relative p-2 text-gray-600 rounded-lg transition-colors hover:text-blue-600 hover:bg-blue-50"
                title="Notifications"
                aria-label="Notifications"
              >
                <FaBell />
                {unreadNotifications > 0 && (
                  <span className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="relative user-menu">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center p-2 space-x-2 text-gray-700 rounded-lg transition-colors hover:text-blue-600 hover:bg-blue-50"
                aria-expanded={isUserMenuOpen ? 'true' : 'false'}
                aria-haspopup="true"
              >
                <div className="flex justify-center items-center w-8 h-8 bg-blue-600 rounded-full">
                  <FaUser className="text-sm text-white" />
                </div>
                <span className="text-sm font-medium">{user?.username || 'User'}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 z-50 py-1 mt-2 w-48 bg-white rounded-md border border-gray-200 shadow-lg">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaUser className="mr-3 text-gray-400" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaCog className="mr-3 text-gray-400" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-3 text-gray-400" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 rounded-lg transition-colors hover:text-blue-600 hover:bg-blue-50"
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="bg-white border-t border-gray-200 md:hidden navbar-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile user menu */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center px-3 py-2">
                <div className="flex justify-center items-center w-8 h-8 bg-blue-600 rounded-full">
                  <FaUser className="text-sm text-white" />
                </div>
                <span className="ml-3 text-base font-medium text-gray-700">
                  {user?.username || 'User'}
                </span>
              </div>
              
              <Link
                to="/profile"
                className="block px-3 py-2 text-base text-gray-700 rounded-md hover:text-blue-600 hover:bg-blue-50"
              >
                Profile
              </Link>
              
              <Link
                to="/settings"
                className="block px-3 py-2 text-base text-gray-700 rounded-md hover:text-blue-600 hover:bg-blue-50"
              >
                Settings
              </Link>
              
              <button
                onClick={handleLogout}
                className="block px-3 py-2 w-full text-base text-left text-gray-700 rounded-md hover:text-blue-600 hover:bg-blue-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
