/* eslint-env jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../../src/components/common/Card';

describe('Card Component', () => {
  const defaultProps = {
    children: 'Card content',
  };

  test('renders card with content', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('applies default styling classes', () => {
    render(<Card {...defaultProps} />);
    const card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6');
  });

  test('applies variant classes correctly', () => {
    const { rerender } = render(<Card {...defaultProps} variant="outlined" />);
    let card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('border', 'border-gray-200');

    rerender(<Card {...defaultProps} variant="elevated" />);
    card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('shadow-lg');

    rerender(<Card {...defaultProps} variant="flat" />);
    card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('shadow-none');
  });

  test('applies size classes correctly', () => {
    const { rerender } = render(<Card {...defaultProps} size="sm" />);
    let card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('p-4');

    rerender(<Card {...defaultProps} size="lg" />);
    card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('p-8');
  });

  test('applies custom className', () => {
    render(<Card {...defaultProps} className="custom-card" />);
    const card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('custom-card');
  });

  test('renders header when provided', () => {
    render(<Card {...defaultProps} header="Card Header" />);
    expect(screen.getByText('Card Header')).toBeInTheDocument();
    expect(screen.getByText('Card Header')).toHaveClass('text-xl', 'font-semibold', 'mb-4');
  });

  test('renders footer when provided', () => {
    render(<Card {...defaultProps} footer="Card Footer" />);
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toHaveClass('text-sm', 'text-gray-500', 'mt-4');
  });

  test('applies hover effects when specified', () => {
    render(<Card {...defaultProps} hoverable />);
    const card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('hover:shadow-lg', 'transition-shadow');
  });

  test('applies clickable state when specified', () => {
    render(<Card {...defaultProps} clickable />);
    const card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('cursor-pointer', 'hover:bg-gray-50');
  });

  test('renders with icon when provided', () => {
    const Icon = () => <span data-testid="card-icon">📋</span>;
    render(<Card {...defaultProps} icon={<Icon />} />);
    expect(screen.getByTestId('card-icon')).toBeInTheDocument();
  });

  test('applies loading state correctly', () => {
    render(<Card {...defaultProps} loading />);
    expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
  });

  test('renders multiple children correctly', () => {
    render(
      <Card>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </Card>
    );
    
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
    expect(screen.getByTestId('child3')).toBeInTheDocument();
  });

  test('applies border radius variants correctly', () => {
    const { rerender } = render(<Card {...defaultProps} rounded="none" />);
    let card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('rounded-none');

    rerender(<Card {...defaultProps} rounded="full" />);
    card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('rounded-full');
  });

  test('applies background color variants', () => {
    const { rerender } = render(<Card {...defaultProps} bgColor="gray" />);
    let card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('bg-gray-50');

    rerender(<Card {...defaultProps} bgColor="blue" />);
    card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('bg-blue-50');
  });

  test('handles empty content gracefully', () => {
    const { container } = render(<Card />);
    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });

  test('applies custom padding when specified', () => {
    render(<Card {...defaultProps} padding="p-2" />);
    const card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('p-2');
  });

  test('renders with custom data attributes', () => {
    render(<Card {...defaultProps} data-testid="custom-card" />);
    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
  });

  test('applies responsive classes when specified', () => {
    render(<Card {...defaultProps} responsive />);
    const card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('sm:p-4', 'md:p-6', 'lg:p-8');
  });
});
