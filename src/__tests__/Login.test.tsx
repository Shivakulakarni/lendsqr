import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'

describe('Login Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Welcome!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('shows error when email is invalid', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: 'LOG IN' })

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('shows error when password is too short', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: 'LOG IN' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'pass' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('shows error when fields are empty', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const submitButton = screen.getByRole('button', { name: 'LOG IN' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email and password are required/i)).toBeInTheDocument()
    })
  })
})
