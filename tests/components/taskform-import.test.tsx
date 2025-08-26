import { describe, it, expect } from 'vitest'
import TaskForm from '../../src/components/TaskForm'

describe('TaskForm Import Test', () => {
  it('can import TaskForm component', () => {
    expect(TaskForm).toBeDefined()
    expect(typeof TaskForm).toBe('function')
  })
})
