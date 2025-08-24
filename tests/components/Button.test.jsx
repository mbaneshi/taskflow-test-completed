/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../src/components/common/Button';

describe('Button Component', () => {
  const defaultProps = {
    children: 'Click me',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders button with correct text', () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  test('applies variant classes correctly', () => {
    const { rerender } = render(<Button {...defaultProps} variant="primary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

    rerender(<Button {...defaultProps} variant="secondary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-600');

    rerender(<Button {...defaultProps} variant="danger" />);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });

  test('applies size classes correctly', () => {
    const { rerender } = render(<Button {...defaultProps} size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Button {...defaultProps} size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  test('applies disabled state correctly', () => {
    render(<Button {...defaultProps} disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  test('applies loading state correctly', () => {
    render(<Button {...defaultProps} loading />);
    expect(screen.getByRole('button')).toHaveClass('opacity-75');
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<Button {...defaultProps} className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  test('renders icon when provided', () => {
    const Icon = () => <span data-testid="icon">🚀</span>;
    render(<Button {...defaultProps} icon={<Icon />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  test('applies full width when specified', () => {
    render(<Button {...defaultProps} fullWidth />);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  test('applies rounded corners when specified', () => {
    render(<Button {...defaultProps} rounded />);
    expect(screen.getByRole('button')).toHaveClass('rounded-full');
  });

  test('handles keyboard events correctly', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    
    fireEvent.keyDown(button, { key: ' ' });
    expect(defaultProps.onClick).toHaveBeenCalledTimes(2);
  });

  test('applies focus styles correctly', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    fireEvent.focus(button);
    expect(button).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
  });

  test('applies hover styles correctly', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    expect(button).toHaveClass('hover:bg-blue-700');
  });

  test('renders with default props correctly', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600', 'px-4', 'py-2');
  });

  test('handles multiple clicks correctly', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(3);
  });

  test('applies aria-label when provided', () => {
    render(<Button {...defaultProps} aria-label="Submit form" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Submit form');
  });

  test('applies data attributes when provided', () => {
    render(<Button {...defaultProps} data-testid="submit-button" />);
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });
});
