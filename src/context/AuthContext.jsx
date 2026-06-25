import { createContext, useContext, useEffect, useState } from 'react'
import { fetchCurrentUser, isAuthenticated, logout as doLogout } from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)   // { id, username, email, full_name, avatar_url, ... }
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  // Restore session on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      setAuthenticated(false)
      setLoading(false)
      return
    }

    setAuthenticated(true)
    fetchCurrentUser()
      .then(u => {
        setUser(u)
        setAuthenticated(Boolean(u))
      })
      .finally(() => setLoading(false))
  }, [])

  async function logout() {
    await doLogout()   // revokes refresh token on AuthService, then clears storage
    setUser(null)
    setAuthenticated(false)
  }

  function onLoginSuccess(userData) {
    setUser(userData)
    setAuthenticated(Boolean(userData))
  }

  return (
    <AuthContext.Provider value={{ user, loading, authenticated, logout, onLoginSuccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
