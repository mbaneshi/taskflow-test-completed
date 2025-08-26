import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../../src/components/common/Button'

describe('Button Component', () => {
  const defaultProps = {
    children: 'Click me',
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with children', () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<Button {...defaultProps} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const customClass = 'custom-button';
    render(<Button {...defaultProps} className={customClass} />);
    expect(screen.getByText('Click me')).toHaveClass(customClass);
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button {...defaultProps} variant="primary" />);
    expect(screen.getByText('Click me')).toHaveClass('bg-blue-600');

    rerender(<Button {...defaultProps} variant="secondary" />);
    expect(screen.getByText('Click me')).toHaveClass('bg-gray-600');

    rerender(<Button {...defaultProps} variant="danger" />);
    expect(screen.getByText('Click me')).toHaveClass('bg-red-600');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button {...defaultProps} size="sm" />);
    expect(screen.getByText('Click me')).toHaveClass('px-3 py-1.5 text-sm');

    rerender(<Button {...defaultProps} size="lg" />);
    expect(screen.getByText('Click me')).toHaveClass('px-6 py-3 text-lg');
  });

  it('can be disabled', () => {
    render(<Button {...defaultProps} disabled />);
    const button = screen.getByText('Click me');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50 cursor-not-allowed');
  });

  it('shows loading state', () => {
    render(<Button {...defaultProps} loading />);
    expect(screen.getByText('Click me')).toHaveClass('opacity-75 cursor-not-allowed');
  });

  it('renders with icon when provided', () => {
    const Icon = () => <span data-testid="icon">🚀</span>;
    render(<Button {...defaultProps} icon={<Icon />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies full width when specified', () => {
    render(<Button {...defaultProps} fullWidth />);
    expect(screen.getByText('Click me')).toHaveClass('w-full');
  });

  it('applies rounded corners when specified', () => {
    render(<Button {...defaultProps} rounded />);
    expect(screen.getByText('Click me')).toHaveClass('rounded-full');
  });

  it('applies outline variant correctly', () => {
    render(<Button {...defaultProps} variant="outline" />);
    expect(screen.getByText('Click me')).toHaveClass('border-2 border-blue-600 text-blue-600');
  });

  it('applies ghost variant correctly', () => {
    render(<Button {...defaultProps} variant="ghost" />);
    expect(screen.getByText('Click me')).toHaveClass('bg-transparent hover:bg-gray-100');
  });

  it('handles different button types', () => {
    const { rerender } = render(<Button {...defaultProps} type="submit" />);
    expect(screen.getByText('Click me')).toHaveAttribute('type', 'submit');

    rerender(<Button {...defaultProps} type="reset" />);
    expect(screen.getByText('Click me')).toHaveAttribute('type', 'reset');

    rerender(<Button {...defaultProps} type="button" />);
    expect(screen.getByText('Click me')).toHaveAttribute('type', 'button');
  });

  it('applies custom styles when provided', () => {
    const customStyle = { backgroundColor: 'purple' };
    render(<Button {...defaultProps} style={customStyle} />);
    expect(screen.getByText('Click me')).toHaveStyle('background-color: purple');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Button {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('applies focus styles correctly', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByText('Click me');
    fireEvent.focus(button);
    expect(button).toHaveClass('focus:outline-none focus:ring-2 focus:ring-blue-500');
  });

  it('applies hover styles correctly', () => {
    render(<Button {...defaultProps} variant="primary" />);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('hover:bg-blue-700');
  });

  it('applies active styles correctly', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByText('Click me');
    fireEvent.mouseDown(button);
    expect(button).toHaveClass('active:scale-95');
  });
});
