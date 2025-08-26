import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TaskForm from '../../src/components/TaskForm'

describe('TaskForm Render Test', () => {
  it('renders TaskForm component directly', () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()
    
    render(
      <TaskForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel}
      />
    )
    
    expect(screen.getByText(/create task/i)).toBeInTheDocument()
  })
})
