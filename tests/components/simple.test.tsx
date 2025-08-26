import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

const SimpleComponent = () => <div>Hello World</div>

describe('Simple Component Test', () => {
  it('renders a simple component', () => {
    render(<SimpleComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
