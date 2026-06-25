import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/auth.js'

const ACCENT = '#cf5a2a'
const USERNAME_RE = /^[a-zA-Z0-9_-]+$/

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState(null)
  const [success, setSuccess]   = useState(false)
  const [loading, setLoading]   = useState(false)

  function validate() {
    if (!USERNAME_RE.test(username))
      return 'Username may only contain letters, numbers, underscores, and hyphens.'
    if (username.length < 2 || username.length > 64)
      return 'Username must be between 2 and 64 characters.'
    if (password.length < 10)
      return 'Password must be at least 10 characters.'
    if (password !== confirm)
      return 'Passwords do not match.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setError(null)
    setLoading(true)
    try {
      await register(email, username, password)
      setSuccess(true)
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
              Aether
            </div>
          </Link>
          <div style={{ marginTop: 10, fontSize: 14, color: '#56524a' }}>Create your account</div>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', border: '1px solid #e7e0d2', borderRadius: 16,
          padding: '36px 32px', boxShadow: '0 2px 16px rgba(0,0,0,.06)',
        }}>
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: '#edf7ed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: 22,
              }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1b1a17', marginBottom: 8 }}>
                Check your inbox
              </div>
              <div style={{ fontSize: 13, color: '#56524a', lineHeight: 1.6 }}>
                We sent a verification link to <strong>{email}</strong>.
                Click the link to activate your account, then sign in.
              </div>
              <button
                onClick={() => navigate('/login')}
                style={{
                  marginTop: 24, width: '100%', padding: '12px 0',
                  background: '#1b1a17', color: '#f1ede4', border: 'none', borderRadius: 9,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Go to sign in
              </button>
            </div>
          ) : (
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
                Username
                <input
                  style={input}
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={loading}
                  placeholder="letters, numbers, _ or -"
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 500, color: '#1b1a17', display: 'block', marginTop: 18 }}>
                Password
                <input
                  style={input}
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  placeholder="at least 10 characters"
                />
              </label>

              <label style={{ fontSize: 13, fontWeight: 500, color: '#1b1a17', display: 'block', marginTop: 18 }}>
                Confirm password
                <input
                  style={input}
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />
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
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          )}
        </div>

        {!success && (
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8a857a' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: ACCENT, textDecoration: 'none', fontWeight: 500 }}>
              Sign in →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
