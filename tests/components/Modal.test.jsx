/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../src/components/common/Modal';

// Mock the portal functionality
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: ({ children }) => children,
}));

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: 'Modal content',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock body scroll lock
    Object.defineProperty(document.body, 'style', {
      value: {},
      writable: true,
    });
  });

  test('renders modal when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  test('does not render modal when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when backdrop is clicked', () => {
    render(<Modal {...defaultProps} />);
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when modal content is clicked', () => {
    render(<Modal {...defaultProps} />);
    const modalContent = screen.getByTestId('modal-content');
    fireEvent.click(modalContent);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  test('calls onClose when Escape key is pressed', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose for other keys', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  test('renders title correctly', () => {
    render(<Modal {...defaultProps} title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  test('renders without title when not provided', () => {
    render(<Modal {...defaultProps} title={undefined} />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  test('applies size classes correctly', () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);
    let modal = screen.getByTestId('modal-content');
    expect(modal).toHaveClass('max-w-sm');

    rerender(<Modal {...defaultProps} size="lg" />);
    modal = screen.getByTestId('modal-content');
    expect(modal).toHaveClass('max-w-4xl');

    rerender(<Modal {...defaultProps} size="full" />);
    modal = screen.getByTestId('modal-content');
    expect(modal).toHaveClass('max-w-full');
  });

  test('applies custom className', () => {
    render(<Modal {...defaultProps} className="custom-modal" />);
    const modal = screen.getByTestId('modal-content');
    expect(modal).toHaveClass('custom-modal');
  });

  test('renders close button with correct aria-label', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
  });

  test('applies backdrop blur when specified', () => {
    render(<Modal {...defaultProps} backdropBlur />);
    const backdrop = screen.getByTestId('modal-backdrop');
    expect(backdrop).toHaveClass('backdrop-blur-sm');
  });

  test('applies custom backdrop color', () => {
    render(<Modal {...defaultProps} backdropColor="bg-red-500" />);
    const backdrop = screen.getByTestId('modal-backdrop');
    expect(backdrop).toHaveClass('bg-red-500');
  });

  test('renders footer when provided', () => {
    render(<Modal {...defaultProps} footer={<div>Footer content</div>} />);
    expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
  });

  test('applies animation classes when specified', () => {
    render(<Modal {...defaultProps} animated />);
    const modal = screen.getByTestId('modal-content');
    expect(modal).toHaveClass('animate-in', 'fade-in');
  });

  test('handles multiple children correctly', () => {
    render(
      <Modal {...defaultProps}>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </Modal>
    );
    
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });

  test('prevents body scroll when modal is open', () => {
    render(<Modal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('restores body scroll when modal is closed', () => {
    const { rerender } = render(<Modal {...defaultProps} />);
    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('');
  });

  test('applies z-index correctly', () => {
    render(<Modal {...defaultProps} zIndex={9999} />);
    const modal = screen.getByTestId('modal-content');
    expect(modal).toHaveStyle({ zIndex: 9999 });
  });

  test('renders with custom data attributes', () => {
    render(<Modal {...defaultProps} data-testid="custom-modal" />);
    expect(screen.getByTestId('custom-modal')).toBeInTheDocument();
  });

  test('handles long content gracefully', () => {
    const longContent = 'A'.repeat(1000);
    render(<Modal {...defaultProps} children={longContent} />);
    expect(screen.getByText(longContent)).toBeInTheDocument();
  });

  test('applies responsive sizing', () => {
    render(<Modal {...defaultProps} responsive />);
    const modal = screen.getByTestId('modal-content');
    expect(modal).toHaveClass('sm:max-w-md', 'md:max-w-lg', 'lg:max-w-2xl');
  });

  test('calls onClose only once for multiple rapid clicks', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    
    fireEvent.click(closeButton);
    fireEvent.click(closeButton);
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
