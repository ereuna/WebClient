import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import { login, fetchCurrentUser } from '../api/auth.js'
import { useAuth } from '../context/AuthContext.jsx'

const ACCENT = '#c2410c'

export default function LoginPage() {
  const { onLoginSuccess } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await login(email, password, remember)
      if (result.mfa_required) {
        // TODO: route to MFA challenge page when implemented
        setError('MFA is required. MFA flow is not yet supported in this client.')
        return
      }
      const user = await fetchCurrentUser()
      if (!user) {
        setError('Signed in but could not load your profile. Please try again.')
        return
      }
      onLoginSuccess(user)
      navigate(-1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const input = {
    fontFamily: 'inherit', fontSize: 14, width: '100%', boxSizing: 'border-box',
    padding: '11px 14px', borderRadius: 9, border: '1.4px solid #c9c4b8',
    background: '#fff', outline: 'none', marginTop: 6,
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f5f2eb', padding: '0 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Logo size={48} />
          </Link>
          <div style={{ marginTop: 10, fontSize: 14, color: '#545b66' }}>Sign in to your account</div>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', border: '1px solid #ddd8cc', borderRadius: 16,
          padding: '36px 32px', boxShadow: '0 2px 16px rgba(0,0,0,.06)',
        }}>
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#17202e' }}>
              Email
              <input
                style={input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </label>

            <label style={{ fontSize: 13, fontWeight: 500, color: '#17202e', display: 'block', marginTop: 18 }}>
              Password
              <input
                style={input}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 13, color: '#545b66', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                disabled={loading}
              />
              Remember me
            </label>

            {error && (
              <div style={{
                marginTop: 16, padding: '10px 14px', borderRadius: 9,
                background: '#fdf2ee', border: `1px solid ${ACCENT}40`,
                color: '#17202e', fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 24, width: '100%', padding: '12px 0',
                background: loading ? '#8a8f98' : '#17202e',
                color: '#f5f2eb', border: 'none', borderRadius: 9,
                fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'background .15s',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#5f6670' }}>
          New to Ereuna?{' '}
          <Link to="/register" style={{ color: '#17202e', textDecoration: 'none', fontWeight: 500 }}>
            Create an account →
          </Link>
        </div>
      </div>
    </div>
  )
}
