/**
 * Live star button — calls the RepositoryService to star/unstar.
 * Falls back gracefully when the user is not authenticated.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ACCENT = '#c2410c'

export default function StarButton({ repoId, initialCount = 0, onToggle }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [starred, setStarred]   = useState(false)
  const [count, setCount]       = useState(Number(initialCount) || 0)
  const [loading, setLoading]   = useState(false)

  async function handleClick() {
    if (!user) {
      navigate('/login')
      return
    }
    if (!repoId || loading) return
    setLoading(true)
    try {
      const { starRepository, unstarRepository } = await import('../api/repositories.js')
      const res = starred
        ? await unstarRepository(repoId)
        : await starRepository(repoId)
      setStarred(s => !s)
      setCount(res.star_count)
      onToggle?.(res.star_count)
    } catch (err) {
      console.warn('Star toggle failed:', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={user ? (starred ? 'Unstar' : 'Star this repository') : 'Sign in to star'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '8px 16px', borderRadius: 9, cursor: loading ? 'wait' : 'pointer',
        border: `1.4px solid ${starred ? ACCENT : '#c9c4b8'}`,
        background: starred ? ACCENT + '12' : '#fff',
        color: starred ? ACCENT : '#545b66',
        fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
        transition: 'all .15s',
      }}
    >
      <span style={{ fontSize: 15 }}>{starred ? '★' : '☆'}</span>
      <span>Star</span>
      <span style={{
        fontFamily: "'IBM Plex Mono',monospace", fontSize: 11,
        padding: '1px 6px', borderRadius: 6,
        background: starred ? ACCENT + '20' : '#efebe2',
        color: starred ? ACCENT : '#5f6670',
      }}>
        {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
      </span>
    </button>
  )
}
