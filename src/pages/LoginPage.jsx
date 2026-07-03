import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, fetchCurrentUser } from '../api/auth.js'
import { useAuth } from '../context/AuthContext.jsx'

const ACCENT = '#cf5a2a'

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
    padding: '11px 14px', borderRadius: 9, border: '1.4px solid #ddd6c8',
    background: '#fff', outline: 'none', marginTop: 6,
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f1ede4', padding: '0 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 22, fontWeight: 600 }}>
              <span style={{
                display: 'inline-flex', width: 28, height: 28, alignItems: 'center', justifyContent: 'center',
                border: '1.8px solid #1b1a17', borderRadius: 8, fontSize: 15,
              }}>⬡</span>
              Ereuna
            </div>
          </Link>
          <div style={{ marginTop: 10, fontSize: 14, color: '#56524a' }}>Sign in to your account</div>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', border: '1px solid #e7e0d2', borderRadius: 16,
          padding: '36px 32px', boxShadow: '0 2px 16px rgba(0,0,0,.06)',
        }}>
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#1b1a17' }}>
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

            <label style={{ fontSize: 13, fontWeight: 500, color: '#1b1a17', display: 'block', marginTop: 18 }}>
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

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 13, color: '#56524a', cursor: 'pointer' }}>
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
                color: ACCENT, fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 24, width: '100%', padding: '12px 0',
                background: loading ? '#9e9890' : '#1b1a17',
                color: '#f1ede4', border: 'none', borderRadius: 9,
                fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'background .15s',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8a857a' }}>
          New to Ereuna?{' '}
          <Link to="/register" style={{ color: ACCENT, textDecoration: 'none', fontWeight: 500 }}>
            Create an account →
          </Link>
        </div>
      </div>
    </div>
  )
}
