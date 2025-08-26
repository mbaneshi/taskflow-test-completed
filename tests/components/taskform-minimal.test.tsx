import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// Create a minimal TaskForm component for testing
const MinimalTaskForm = ({ onSubmit, onCancel }: { onSubmit: () => void, onCancel: () => void }) => {
  return (
    <div>
      <h2>Create New Task</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <input type="text" placeholder="Title" />
        <button type="submit">Submit</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  )
}

describe('Minimal TaskForm Test', () => {
  it('renders minimal TaskForm component', () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()
    
    render(
      <MinimalTaskForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
      />
    )
    
    expect(screen.getByText('Create New Task')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })
})
