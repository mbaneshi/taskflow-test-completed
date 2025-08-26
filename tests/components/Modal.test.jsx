/* eslint-env jest */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '../../src/components/common/Modal'

// Mock the portal functionality
vi.mock('react-dom', () => ({
  ...vi.importActual('react-dom'),
  createPortal: ({ children }) => children,
}))

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<Modal {...defaultProps} />);
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(<Modal {...defaultProps} />);
    const modalContent = screen.getByTestId('modal-content');
    fireEvent.click(modalContent);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const customClass = 'custom-modal';
    render(<Modal {...defaultProps} className={customClass} />);
    expect(screen.getByTestId('modal-content')).toHaveClass(customClass);
  });

  it('renders with custom title', () => {
    const customTitle = 'Custom Modal Title';
    render(<Modal {...defaultProps} title={customTitle} />);
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('renders without title when not provided', () => {
    const { title, ...propsWithoutTitle } = defaultProps;
    render(<Modal {...propsWithoutTitle} />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);
    expect(screen.getByTestId('modal-content')).toHaveClass('max-w-sm');

    rerender(<Modal {...defaultProps} size="lg" />);
    expect(screen.getByTestId('modal-content')).toHaveClass('max-w-4xl');

    rerender(<Modal {...defaultProps} size="xl" />);
    expect(screen.getByTestId('modal-content')).toHaveClass('max-w-6xl');
  });

  it('applies closeOnBackdropClick correctly', () => {
    render(<Modal {...defaultProps} closeOnBackdropClick={false} />);
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('applies closeOnEscape correctly', () => {
    render(<Modal {...defaultProps} closeOnEscape={false} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('handles escape key when enabled', () => {
    render(<Modal {...defaultProps} closeOnEscape={true} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('applies custom backdrop styles', () => {
    const customBackdropClass = 'custom-backdrop';
    render(<Modal {...defaultProps} backdropClassName={customBackdropClass} />);
    expect(screen.getByTestId('modal-backdrop')).toHaveClass(customBackdropClass);
  });

  it('renders with custom close button text', () => {
    const customCloseText = 'Close Modal';
    render(<Modal {...defaultProps} closeButtonText={customCloseText} />);
    expect(screen.getByRole('button', { name: customCloseText })).toBeInTheDocument();
  });

  it('applies animation classes when enabled', () => {
    render(<Modal {...defaultProps} animated={true} />);
    expect(screen.getByTestId('modal-content')).toHaveClass('animate-in');
  });

  it('applies custom z-index', () => {
    const customZIndex = 'z-50';
    render(<Modal {...defaultProps} zIndex={customZIndex} />);
    expect(screen.getByTestId('modal-content')).toHaveClass(customZIndex);
  });

  it('renders with custom header content', () => {
    const customHeader = <div data-testid="custom-header">Custom Header</div>;
    render(<Modal {...defaultProps} header={customHeader} />);
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });

  it('renders with custom footer content', () => {
    const customFooter = <div data-testid="custom-footer">Custom Footer</div>;
    render(<Modal {...defaultProps} footer={customFooter} />);
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
  });

  it('applies fullscreen mode correctly', () => {
    render(<Modal {...defaultProps} fullscreen={true} />);
    expect(screen.getByTestId('modal-content')).toHaveClass('w-full h-full max-w-none max-h-none');
  });

  it('handles multiple children correctly', () => {
    const multipleChildren = [
      <div key="1" data-testid="child-1">Child 1</div>,
      <div key="2" data-testid="child-2">Child 2</div>,
    ];
    render(<Modal {...defaultProps} children={multipleChildren} />);
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('applies custom close button styles', () => {
    const customCloseClass = 'custom-close-button';
    render(<Modal {...defaultProps} closeButtonClassName={customCloseClass} />);
    expect(screen.getByRole('button', { name: /close/i })).toHaveClass(customCloseClass);
  });

  it('renders with custom modal ID', () => {
    const customId = 'custom-modal-id';
    render(<Modal {...defaultProps} id={customId} />);
    expect(screen.getByTestId('modal-content')).toHaveAttribute('id', customId);
  });

  it('applies custom modal styles', () => {
    const customStyle = { backgroundColor: 'purple' };
    render(<Modal {...defaultProps} style={customStyle} />);
    expect(screen.getByTestId('modal-content')).toHaveStyle('background-color: purple');
  });
});
