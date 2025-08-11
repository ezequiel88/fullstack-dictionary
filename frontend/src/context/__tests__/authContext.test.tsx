import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../authContext'
import { loginAction } from '@/actions/login'
import { registerAction } from '@/actions/register'
import { logoutAction } from '@/actions/logout'
import { getUserProfile } from '@/actions/user'
import { isAuthenticated } from '@/lib/auth'
import { User, AuthSignIn, AuthSignUp } from '@/types'

// Mock das actions e auth
jest.mock('@/actions/login')
jest.mock('@/actions/register')
jest.mock('@/actions/logout')
jest.mock('@/actions/user')
jest.mock('@/lib/auth')

const mockedLoginAction = loginAction as jest.MockedFunction<typeof loginAction>
const mockedRegisterAction = registerAction as jest.MockedFunction<typeof registerAction>
const mockedLogoutAction = logoutAction as jest.MockedFunction<typeof logoutAction>
const mockedGetUserProfile = getUserProfile as jest.MockedFunction<typeof getUserProfile>
const mockedIsAuthenticated = isAuthenticated as jest.MockedFunction<typeof isAuthenticated>

// Componente de teste para usar o hook
const TestComponent = () => {
  const { user, isLoading, signIn, signUp, signOut, refreshUser } = useAuth()
  const [error, setError] = React.useState<string | null>(null)

  const handleSignIn = async () => {
    try {
      setError(null)
      await signIn({ email: 'test@example.com', password: 'password' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const handleSignUp = async () => {
    try {
      setError(null)
      await signUp({ name: 'Test', email: 'test@example.com', password: 'password' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? user.name : 'no-user'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={signOut}>Sign Out</button>
      <button onClick={refreshUser}>Refresh User</button>
    </div>
  )
}

const TestComponentWithoutProvider = () => {
  const { user } = useAuth()
  return <div>{user?.name}</div>
}

describe('AuthContext', () => {
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: '2023-01-01T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suprimir console.error para este teste
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponentWithoutProvider />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleSpy.mockRestore()
  })

  it('should initialize with loading state', async () => {
    mockedIsAuthenticated.mockResolvedValue(false)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('loading')
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })
  })

  it('should load user when authenticated', async () => {
    mockedIsAuthenticated.mockResolvedValue(true)
    mockedGetUserProfile.mockResolvedValue({
      success: true,
      data: mockUser,
      message: 'Success',
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User')
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })
  })

  it('should handle sign in successfully', async () => {
    const user = userEvent.setup()
    
    // Initial state - not authenticated
    mockedIsAuthenticated.mockResolvedValueOnce(false)
    
    // After successful login - authenticated
    mockedIsAuthenticated.mockResolvedValueOnce(true)
    
    mockedLoginAction.mockResolvedValue({
      success: true,
      data: mockUser,
      message: 'Login successful',
    })
    
    mockedGetUserProfile.mockResolvedValue({
      success: true,
      data: mockUser,
      message: 'Success',
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    await user.click(screen.getByText('Sign In'))

    await waitFor(() => {
      expect(mockedLoginAction).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      })
      expect(screen.getByTestId('user')).toHaveTextContent('Test User')
    })
  })

  it('should handle sign in failure', async () => {
    const user = userEvent.setup()
    mockedIsAuthenticated.mockResolvedValue(false)
    mockedLoginAction.mockResolvedValue({
      success: false,
      data: null,
      message: 'Invalid credentials',
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    await user.click(screen.getByText('Sign In'))

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials')
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    })
  })

  it('should handle sign up successfully', async () => {
    const user = userEvent.setup()
    
    // Initial state - not authenticated
    mockedIsAuthenticated.mockResolvedValueOnce(false)
    
    // After successful registration - authenticated
    mockedIsAuthenticated.mockResolvedValueOnce(true)
    
    mockedRegisterAction.mockResolvedValue({
      success: true,
      data: mockUser,
      message: 'Registration successful',
    })
    
    mockedGetUserProfile.mockResolvedValue({
      success: true,
      data: mockUser,
      message: 'Success',
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    await user.click(screen.getByText('Sign Up'))

    await waitFor(() => {
      expect(mockedRegisterAction).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
      })
      expect(screen.getByTestId('user')).toHaveTextContent('Test User')
    })
  })

  it('should handle sign out', async () => {
    const user = userEvent.setup()
    mockedIsAuthenticated.mockResolvedValue(true)
    mockedGetUserProfile.mockResolvedValue({
      success: true,
      data: mockUser,
      message: 'Success',
    })
    mockedLogoutAction.mockResolvedValue({
      success: true,
      message: 'Logout successful',
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User')
    })

    await user.click(screen.getByText('Sign Out'))

    await waitFor(() => {
      expect(mockedLogoutAction).toHaveBeenCalled()
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    })
  })

  it('should handle sign up failure', async () => {
    const user = userEvent.setup()
    mockedIsAuthenticated.mockResolvedValue(false)
    mockedRegisterAction.mockResolvedValue({
      success: false,
      data: null,
      message: 'Email already exists',
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    await user.click(screen.getByText('Sign Up'))

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Email already exists')
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    })
  })

  it('should refresh user successfully', async () => {
    const user = userEvent.setup()
    mockedIsAuthenticated.mockResolvedValue(true)
    mockedGetUserProfile
      .mockResolvedValueOnce({
        success: true,
        data: mockUser,
        message: 'Success',
      })
      .mockResolvedValueOnce({
        success: true,
        data: { ...mockUser, name: 'Updated User' },
        message: 'Success',
      })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User')
    })

    await user.click(screen.getByText('Refresh User'))

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Updated User')
    })
  })

  it('should handle refresh user failure', async () => {
    const user = userEvent.setup()
    mockedIsAuthenticated.mockResolvedValue(true)
    mockedGetUserProfile
      .mockResolvedValueOnce({
        success: true,
        data: mockUser,
        message: 'Success',
      })
      .mockResolvedValueOnce({
        success: false,
        data: null,
        message: 'Failed to refresh',
      })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User')
    })

    await user.click(screen.getByText('Refresh User'))

    // O usuário deve permanecer o mesmo em caso de falha
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User')
    })
  })
})