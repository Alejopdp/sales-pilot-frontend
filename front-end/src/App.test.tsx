import React from 'react'
import { render, screen } from '@testing-library/react'
import DevelopmentApp from './App'

test('renders learn react link', () => {
    render(<DevelopmentApp />)
    const linkElement = screen.getByText(/learn react/i)
    expect(linkElement).toBeInTheDocument()
})
