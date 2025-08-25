import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

/**
 * Custom hook to use the authentication context
 * This is a re-export from the context for convenience
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
