import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'

// Define interfaces locally for now
interface IUser {
  email: string
  username?: string
  role?: string
}

interface AuthContextType {
  user: IUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<IUser>
  logout: () => void
  register: (userData: RegisterData) => Promise<IUser>
  isAuthenticated: boolean
}

interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Export the context for use in tests
export { AuthContext }

/**
 * Custom hook to use the authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Authentication Provider Component
 */
interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    
    return token && email ? { email } : null
  })
  
  const [loading, setLoading] = useState<boolean>(true)

  /**
   * Effect to check token validity on mount
   */
  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        const token = localStorage.getItem("token")
        
        if (token) {
          const email = localStorage.getItem("email")
          
          if (email) {
            setUser({ email })
          } else {
            handleLogout()
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        handleLogout()
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  /**
   * Handles user login
   */
  const login = async (email: string, password: string): Promise<IUser> => {
    setUser({ email })
    return { email }
  }

  /**
   * Handles user logout
   */
  const handleLogout = (): void => {
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    setUser(null)
  }

  /**
   * Handles user registration
   */
  const register = async (userData: RegisterData): Promise<IUser> => {
    const newUser = { email: userData.email }
    setUser(newUser)
    return newUser
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout: handleLogout,
    register,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
