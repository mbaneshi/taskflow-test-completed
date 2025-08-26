import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../../src/components/common/Navbar'

// Mock the notification context
vi.mock('../../src/contexts/NotificationContext', () => ({
  useNotification: () => ({
    showNotification: vi.fn(),
    hideNotification: vi.fn(),
    notifications: []
  })
}))

// Mock the auth context
vi.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    logout: vi.fn(),
    login: vi.fn()
  })
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links', () => {
    renderWithRouter(<Navbar />);
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/projects/i)).toBeInTheDocument();
    expect(screen.getByText(/team/i)).toBeInTheDocument();
  });

  it('renders logo/brand', () => {
    renderWithRouter(<Navbar />);
    
    expect(screen.getByText(/taskflow/i)).toBeInTheDocument();
  });

  it('shows login button when user is not authenticated', () => {
    renderWithRouter(<Navbar />);
    
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  it('shows user menu when user is authenticated', () => {
    const mockUseAuth = vi.fn().mockReturnValue({
      user: { name: 'John Doe', email: 'john@example.com' },
      isAuthenticated: true,
      logout: vi.fn()
    });

    vi.doMock('../../src/contexts/AuthContext', () => ({
      useAuth: mockUseAuth
    }));

    renderWithRouter(<Navbar />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', () => {
    const mockLogout = vi.fn();
    const mockUseAuth = vi.fn().mockReturnValue({
      user: { name: 'John Doe', email: 'john@example.com' },
      isAuthenticated: true,
      logout: mockLogout
    });

    vi.doMock('../../src/contexts/AuthContext', () => ({
      useAuth: mockUseAuth
    }));

    renderWithRouter(<Navbar />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    renderWithRouter(<Navbar />);
    
    const hamburgerButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(hamburgerButton);
    
    // Check if mobile menu is now visible
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
  });

  it('closes mobile menu when close button is clicked', () => {
    renderWithRouter(<Navbar />);
    
    // Open mobile menu first
    const hamburgerButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(hamburgerButton);
    
    // Then close it
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Check if mobile menu is hidden
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('applies active state to current route', () => {
    renderWithRouter(<Navbar />);
    
    // Simulate being on the dashboard route
    const dashboardLink = screen.getByText(/dashboard/i);
    expect(dashboardLink).toHaveClass('text-blue-600');
  });

  it('shows notification badge when notifications exist', () => {
    const mockUseNotification = vi.fn().mockReturnValue({
      showNotification: vi.fn(),
      hideNotification: vi.fn(),
      notifications: [
        { id: '1', message: 'Test notification', type: 'info' }
      ]
    });

    vi.doMock('../../src/contexts/NotificationContext', () => ({
      useNotification: mockUseNotification
    }));

    renderWithRouter(<Navbar />);
    
    expect(screen.getByTestId('notification-badge')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('hides notification badge when no notifications', () => {
    renderWithRouter(<Navbar />);
    
    expect(screen.queryByTestId('notification-badge')).not.toBeInTheDocument();
  });

  it('applies responsive design classes', () => {
    renderWithRouter(<Navbar />);
    
    const navbar = screen.getByTestId('navbar');
    expect(navbar).toHaveClass('px-4 sm:px-6 lg:px-8');
  });

  it('shows search bar when enabled', () => {
    renderWithRouter(<Navbar showSearch={true} />);
    
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('hides search bar when disabled', () => {
    renderWithRouter(<Navbar showSearch={false} />);
    
    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
  });

  it('handles search input correctly', () => {
    renderWithRouter(<Navbar showSearch={true} />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(searchInput.value).toBe('test search');
  });

  it('shows user avatar when available', () => {
    const mockUseAuth = vi.fn().mockReturnValue({
      user: { 
        name: 'John Doe', 
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg'
      },
      isAuthenticated: true,
      logout: vi.fn()
    });

    vi.doMock('../../src/contexts/AuthContext', () => ({
      useAuth: mockUseAuth
    }));

    renderWithRouter(<Navbar />);
    
    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('shows user initials when no avatar', () => {
    const mockUseAuth = vi.fn().mockReturnValue({
      user: { 
        name: 'John Doe', 
        email: 'john@example.com'
      },
      isAuthenticated: true,
      logout: vi.fn()
    });

    vi.doMock('../../src/contexts/AuthContext', () => ({
      useAuth: mockUseAuth
    }));

    renderWithRouter(<Navbar />);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-navbar';
    renderWithRouter(<Navbar className={customClass} />);
    
    expect(screen.getByTestId('navbar')).toHaveClass(customClass);
  });

  it('handles keyboard navigation correctly', () => {
    renderWithRouter(<Navbar />);
    
    const navbar = screen.getByTestId('navbar');
    navbar.focus();
    
    // Test tab navigation
    const firstLink = screen.getByText(/dashboard/i);
    expect(firstLink).toHaveFocus();
  });

  it('shows loading state when authenticating', () => {
    const mockUseAuth = vi.fn().mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      logout: vi.fn()
    });

    vi.doMock('../../src/contexts/AuthContext', () => ({
      useAuth: mockUseAuth
    }));

    renderWithRouter(<Navbar />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles theme toggle correctly', () => {
    renderWithRouter(<Navbar showThemeToggle={true} />);
    
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(themeToggle);
    
    // Check if theme toggle was clicked
    expect(themeToggle).toBeInTheDocument();
  });

  it('shows language selector when enabled', () => {
    renderWithRouter(<Navbar showLanguageSelector={true} />);
    
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });

  it('handles language change correctly', () => {
    renderWithRouter(<Navbar showLanguageSelector={true} />);
    
    const languageSelect = screen.getByTestId('language-selector');
    fireEvent.change(languageSelect, { target: { value: 'es' } });
    
    expect(languageSelect.value).toBe('es');
  });

  it('applies sticky positioning when specified', () => {
    renderWithRouter(<Navbar sticky={true} />);
    
    expect(screen.getByTestId('navbar')).toHaveClass('sticky top-0 z-50');
  });

  it('applies transparent background when specified', () => {
    renderWithRouter(<Navbar transparent={true} />);
    
    expect(screen.getByTestId('navbar')).toHaveClass('bg-transparent');
  });

  it('shows breadcrumbs when enabled', () => {
    renderWithRouter(<Navbar showBreadcrumbs={true} />);
    
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('handles mobile menu backdrop click', () => {
    renderWithRouter(<Navbar />);
    
    // Open mobile menu
    const hamburgerButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(hamburgerButton);
    
    // Click backdrop
    const backdrop = screen.getByTestId('mobile-menu-backdrop');
    fireEvent.click(backdrop);
    
    // Check if mobile menu is closed
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });
});



