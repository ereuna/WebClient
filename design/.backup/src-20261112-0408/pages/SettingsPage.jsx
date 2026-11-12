import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  updateProfile,
  listSessions,
  revokeSession,
  listApiKeys,
  createApiKey,
  revokeApiKey,
  getNotificationPreferences,
  updateNotificationPreferences,
} from '../api/settings.js'
import { fetchAllOrganizations } from '../api/organizations.js'

const ACCENT = '#cf5a2a'
const DARK = '#1b1a17'
const MEDIUM = '#56524a'
const MUTED = '#8a857a'
const BG = '#f1ede4'
const CARD_BORDER = '1px solid #e7e0d2'
const MONO = "'Space Mono',monospace"
const INPUT_STYLE = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 9,
  border: '1.4px solid #ddd6c8',
  fontSize: 14,
  color: DARK,
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const NAV_SECTIONS = ['Profile', 'Security', 'API Keys', 'Notifications', 'Billing', 'Organizations']

function formatRelativeTime(iso) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 2) return 'Just now'
  if (mins < 60) return `${mins} minutes ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  return `${days} days ago`
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: MONO,
      fontSize: 10,
      letterSpacing: '0.08em',
      color: ACCENT,
      marginBottom: 18,
      textTransform: 'uppercase',
    }}>
      {children}
    </div>
  )
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6 }}>
      {children}
    </div>
  )
}

function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: on ? '#2db88a' : '#d0c9be',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background .2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: 3,
        left: on ? 23 : 3,
        transition: 'left .2s',
        boxShadow: '0 1px 4px rgba(0,0,0,.2)',
      }} />
    </div>
  )
}

function ProfileSection() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    website: '',
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    setForm({
      fullName: user.full_name || '',
      username: user.username || '',
      email: user.email || '',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
    })
  }, [user])

  function handleChange(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setSaved(false)
    setError(null)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await updateProfile({
        full_name: form.fullName || null,
        bio: form.bio || null,
        website: form.website || null,
        location: form.location || null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const initials = getInitials(form.fullName || form.username)

  if (!user) {
    return (
      <div>
        <SectionLabel>Profile</SectionLabel>
        <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28, color: MUTED, fontSize: 14 }}>
          Sign in to manage your profile.
        </div>
      </div>
    )
  }

  return (
    <div>
      <SectionLabel>Profile</SectionLabel>

      <div style={{
        background: '#fff',
        border: CARD_BORDER,
        borderRadius: 14,
        padding: 28,
        marginBottom: 20,
      }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 20 }}>Avatar</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: ACCENT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 38,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
            letterSpacing: '-0.02em',
          }}>
            {initials}
          </div>
          <div>
            <button
              style={{
                padding: '9px 18px',
                borderRadius: 9,
                border: CARD_BORDER,
                background: '#fff',
                fontSize: 13.5,
                fontWeight: 600,
                color: DARK,
                cursor: 'pointer',
                marginBottom: 8,
                display: 'block',
              }}
            >
              Upload photo
            </button>
            <div style={{ fontSize: 12, color: MUTED }}>JPG, PNG or GIF · Max 5 MB</div>
          </div>
        </div>
      </div>

      <div style={{
        background: '#fff',
        border: CARD_BORDER,
        borderRadius: 14,
        padding: 28,
      }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 22 }}>Personal Information</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 20px', marginBottom: 18 }}>
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <input
              style={INPUT_STYLE}
              value={form.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Username</FieldLabel>
            <input
              style={{ ...INPUT_STYLE, fontFamily: MONO, fontSize: 12.5, background: '#faf7f0', color: MEDIUM, cursor: 'not-allowed' }}
              value={form.username}
              disabled
            />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <input
              style={{ ...INPUT_STYLE, background: '#faf7f0', color: MEDIUM, cursor: 'not-allowed' }}
              type="email"
              value={form.email}
              disabled
            />
          </div>
          <div>
            <FieldLabel>Location</FieldLabel>
            <input
              style={INPUT_STYLE}
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <FieldLabel>Bio</FieldLabel>
          <textarea
            style={{
              ...INPUT_STYLE,
              minHeight: 90,
              resize: 'vertical',
              lineHeight: 1.55,
            }}
            value={form.bio}
            onChange={e => handleChange('bio', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 26 }}>
          <FieldLabel>Website</FieldLabel>
          <input
            style={INPUT_STYLE}
            type="url"
            value={form.website}
            onChange={e => handleChange('website', e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 22px',
              borderRadius: 9,
              border: 'none',
              background: ACCENT,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? 'wait' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {saved && (
            <span style={{ fontSize: 13, color: '#2db88a', fontWeight: 500 }}>
              Changes saved
            </span>
          )}
          {error && (
            <span style={{ fontSize: 13, color: '#c0392b', fontWeight: 500 }}>
              {error}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function SecuritySection() {
  const { user } = useAuth()
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(true)

  useEffect(() => {
    listSessions()
      .then(rows => {
        setSessions((rows || []).map(s => ({
          id: s.id,
          device: s.user_agent || 'Unknown device',
          location: s.ip_address || '—',
          last: formatRelativeTime(s.issued_at),
          current: false,
        })))
      })
      .catch(() => setSessions([]))
      .finally(() => setSessionsLoading(false))
  }, [])

  async function handleRevokeSession(id) {
    try {
      await revokeSession(id)
      setSessions(s => s.filter(x => x.id !== id))
    } catch { /* ignore */ }
  }

  const twoFa = Boolean(user?.mfa_enabled)

  return (
    <div>
      <SectionLabel>Security</SectionLabel>

      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28, marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 22 }}>Change Password</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 440 }}>
          <div>
            <FieldLabel>Current password</FieldLabel>
            <input
              type="password"
              style={INPUT_STYLE}
              value={pwForm.current}
              onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
            />
          </div>
          <div>
            <FieldLabel>New password</FieldLabel>
            <input
              type="password"
              style={INPUT_STYLE}
              value={pwForm.next}
              onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))}
            />
          </div>
          <div>
            <FieldLabel>Confirm new password</FieldLabel>
            <input
              type="password"
              style={INPUT_STYLE}
              value={pwForm.confirm}
              onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
            />
          </div>
          <div>
            <button style={{
              padding: '10px 22px',
              borderRadius: 9,
              border: 'none',
              background: ACCENT,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 4,
            }}>
              Update password
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 4 }}>Two-Factor Authentication</div>
            <div style={{ fontSize: 13, color: MUTED }}>
              {twoFa ? 'Two-factor authentication is currently enabled.' : 'Two-factor authentication is disabled.'}
            </div>
          </div>
          <Toggle on={twoFa} onChange={() => {}} />
        </div>
        {twoFa && (
          <div style={{
            marginTop: 16,
            padding: '10px 14px',
            background: '#f0faf5',
            border: '1px solid #b8e8d2',
            borderRadius: 9,
            fontSize: 13,
            color: '#1a7a52',
          }}>
            Your account is protected with 2FA via authenticator app.
          </div>
        )}
      </div>

      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 20 }}>Active Sessions</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e7e0d2' }}>
                {['Device', 'Location', 'Last Active', ''].map(h => (
                  <th key={h} style={{
                    textAlign: 'left',
                    padding: '8px 12px 12px 0',
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: MUTED,
                    fontWeight: 500,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessionsLoading && (
                <tr>
                  <td colSpan={4} style={{ padding: '20px 0', color: MUTED, fontSize: 13 }}>Loading sessions…</td>
                </tr>
              )}
              {!sessionsLoading && sessions.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '20px 0', color: MUTED, fontSize: 13 }}>No active sessions.</td>
                </tr>
              )}
              {sessions.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < sessions.length - 1 ? '1px solid #f0ebe0' : 'none' }}>
                  <td style={{ padding: '13px 12px 13px 0', color: DARK, fontWeight: 500 }}>
                    {s.device}
                    {s.current && (
                      <span style={{
                        marginLeft: 8,
                        fontSize: 10,
                        fontFamily: MONO,
                        background: '#e8f5ee',
                        color: '#2db88a',
                        borderRadius: 5,
                        padding: '2px 7px',
                        letterSpacing: '0.04em',
                      }}>
                        CURRENT
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '13px 12px 13px 0', color: MEDIUM }}>{s.location}</td>
                  <td style={{ padding: '13px 12px 13px 0', color: MUTED, fontFamily: MONO, fontSize: 12 }}>{s.last}</td>
                  <td style={{ padding: '13px 0' }}>
                    {!s.current && (
                      <button
                        onClick={() => handleRevokeSession(s.id)}
                        style={{
                          padding: '5px 13px',
                          borderRadius: 7,
                          border: '1.4px solid #f0c4b4',
                          background: '#fff',
                          color: ACCENT,
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ApiKeysSection() {
  const [keys, setKeys] = useState([])
  const [keysLoading, setKeysLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState(null)
  const [copied, setCopied] = useState(false)
  const [creating, setCreating] = useState(false)

  function loadKeys() {
    setKeysLoading(true)
    listApiKeys()
      .then(rows => {
        setKeys((rows || []).map(k => ({
          id: k.id,
          name: k.name,
          prefix: k.prefix,
          created: new Date(k.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          lastUsed: k.last_used_at ? formatRelativeTime(k.last_used_at) : 'Never',
        })))
      })
      .catch(() => setKeys([]))
      .finally(() => setKeysLoading(false))
  }

  useEffect(() => { loadKeys() }, [])

  async function handleRevokeKey(id) {
    try {
      await revokeApiKey(id)
      setKeys(k => k.filter(x => x.id !== id))
    } catch { /* ignore */ }
  }

  async function generateKey() {
    if (!newKeyName.trim() || creating) return
    setCreating(true)
    try {
      const res = await createApiKey({ name: newKeyName.trim() })
      setGeneratedKey(res.key)
      loadKeys()
    } catch { /* ignore */ }
    finally { setCreating(false) }
  }

  function copyKey() {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div>
      <SectionLabel>API Keys</SectionLabel>

      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: DARK }}>Your API Keys</div>
          <button
            onClick={() => { setShowForm(s => !s); setGeneratedKey(null); setNewKeyName('') }}
            style={{
              padding: '8px 18px',
              borderRadius: 9,
              border: 'none',
              background: ACCENT,
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Generate new API key
          </button>
        </div>

        {showForm && (
          <div style={{
            background: '#faf7f0',
            border: CARD_BORDER,
            borderRadius: 11,
            padding: 20,
            marginBottom: 22,
          }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: DARK, marginBottom: 14 }}>New API Key</div>
            {!generatedKey ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <FieldLabel>Key name</FieldLabel>
                  <input
                    style={INPUT_STYLE}
                    placeholder="e.g. Staging Key"
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                  />
                </div>
                <button
                  onClick={generateKey}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 9,
                    border: 'none',
                    background: DARK,
                    color: '#fff',
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Generate
                </button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 13, color: MUTED, marginBottom: 10 }}>
                  Copy this key now — it won't be shown again.
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: '#fff',
                  border: CARD_BORDER,
                  borderRadius: 9,
                  padding: '10px 14px',
                }}>
                  <code style={{
                    fontFamily: MONO,
                    fontSize: 12.5,
                    color: DARK,
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {generatedKey}
                  </code>
                  <button
                    onClick={copyKey}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 7,
                      border: CARD_BORDER,
                      background: copied ? '#e8f5ee' : '#fff',
                      color: copied ? '#2db88a' : MEDIUM,
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all .15s',
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e7e0d2' }}>
                {['Name', 'Prefix', 'Created', 'Last Used', ''].map(h => (
                  <th key={h} style={{
                    textAlign: 'left',
                    padding: '8px 12px 12px 0',
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: MUTED,
                    fontWeight: 500,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keysLoading && (
                <tr>
                  <td colSpan={5} style={{ padding: '20px 0', color: MUTED, fontSize: 13 }}>Loading API keys…</td>
                </tr>
              )}
              {!keysLoading && keys.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '20px 0', color: MUTED, fontSize: 13 }}>No API keys yet.</td>
                </tr>
              )}
              {keys.map((k, i) => (
                <tr key={k.id} style={{ borderBottom: i < keys.length - 1 ? '1px solid #f0ebe0' : 'none' }}>
                  <td style={{ padding: '13px 12px 13px 0', color: DARK, fontWeight: 500 }}>{k.name}</td>
                  <td style={{ padding: '13px 12px 13px 0' }}>
                    <code style={{ fontFamily: MONO, fontSize: 12, color: MEDIUM, background: '#f5f0e8', padding: '3px 8px', borderRadius: 5 }}>
                      {k.prefix}
                    </code>
                  </td>
                  <td style={{ padding: '13px 12px 13px 0', color: MUTED, fontSize: 13 }}>{k.created}</td>
                  <td style={{ padding: '13px 12px 13px 0', color: MUTED, fontSize: 13 }}>{k.lastUsed}</td>
                  <td style={{ padding: '13px 0' }}>
                    <button
                      onClick={() => handleRevokeKey(k.id)}
                      style={{
                        padding: '5px 13px',
                        borderRadius: 7,
                        border: '1.4px solid #f0c4b4',
                        background: '#fff',
                        color: ACCENT,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {keys.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: MUTED, fontSize: 14 }}>
              No API keys. Generate one above.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NotificationsSection() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [prefs, setPrefs] = useState({
    email_enabled: true,
    push_enabled: true,
    digest_enabled: false,
    type_preferences: {},
  })

  useEffect(() => {
    getNotificationPreferences()
      .then(p => setPrefs({
        email_enabled: p.email_enabled ?? true,
        push_enabled: p.push_enabled ?? true,
        digest_enabled: p.digest_enabled ?? false,
        type_preferences: p.type_preferences || {},
      }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function patchPrefs(updates) {
    const next = { ...prefs, ...updates }
    setPrefs(next)
    try {
      await updateNotificationPreferences(updates)
    } catch {
      setPrefs(prefs)
    }
  }

  function toggleType(key) {
    const type_preferences = {
      ...prefs.type_preferences,
      [key]: !(prefs.type_preferences[key] ?? true),
    }
    patchPrefs({ type_preferences })
  }

  const notifs = [
    { key: 'training', label: 'Training completed' },
    { key: 'deployment_failed', label: 'Deployment failed' },
    { key: 'pipeline_failed', label: 'Pipeline failed' },
    { key: 'dataset', label: 'Dataset updated' },
    { key: 'mention', label: 'Repository mentioned' },
  ]

  if (loading) {
    return (
      <div>
        <SectionLabel>Notifications</SectionLabel>
        <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28, color: MUTED, fontSize: 14 }}>
          Loading preferences…
        </div>
      </div>
    )
  }

  return (
    <div>
      <SectionLabel>Notifications</SectionLabel>

      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28, marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 22 }}>Notification Types</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {notifs.map((n, i) => (
            <div
              key={n.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: i < notifs.length - 1 ? '1px solid #f0ebe0' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: DARK }}>{n.label}</div>
              </div>
              <Toggle
                on={prefs.type_preferences[n.key] !== false}
                onChange={() => toggleType(n.key)}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 22 }}>Delivery Channels</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { key: 'push', label: 'In-App', desc: 'Notifications inside the platform', enabled: prefs.push_enabled, onToggle: () => patchPrefs({ push_enabled: !prefs.push_enabled }) },
            { key: 'email', label: 'Email', desc: user?.email ? `Send to ${user.email}` : 'Email notifications', enabled: prefs.email_enabled, onToggle: () => patchPrefs({ email_enabled: !prefs.email_enabled }) },
            { key: 'slack', label: 'Slack', desc: 'Not available yet', enabled: false, disabled: true },
            { key: 'webhook', label: 'Webhook', desc: 'Not available yet', enabled: false, disabled: true },
          ].map(ch => (
            <div
              key={ch.key}
              style={{
                background: '#faf7f0',
                border: ch.enabled ? `1.4px solid ${ACCENT}` : CARD_BORDER,
                borderRadius: 11,
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                opacity: ch.disabled ? 0.55 : 1,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 3 }}>{ch.label}</div>
                <div style={{ fontSize: 12, color: MUTED }}>{ch.desc}</div>
              </div>
              <Toggle on={ch.enabled} onChange={ch.onToggle || (() => {})} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BillingSection() {
  return (
    <div>
      <SectionLabel>Billing</SectionLabel>
      <div style={{
        background: '#fff',
        border: CARD_BORDER,
        borderRadius: 14,
        padding: '48px 28px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 10 }}>
          Billing not available yet
        </div>
        <p style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.6, maxWidth: 420, marginInline: 'auto' }}>
          Plan management, payment methods, and usage billing will appear here when the billing service is connected.
        </p>
      </div>
    </div>
  )
}

const ORG_COLORS = ['#7c6af7', '#2db88a', '#3498db', '#cf5a2a', '#e67e22']

function OrganizationsSection() {
  const [orgs, setOrgs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllOrganizations()
      .then(setOrgs)
      .catch(() => setOrgs([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <SectionLabel>Organizations</SectionLabel>

      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: DARK }}>Your Organizations</div>
          <Link
            to="/organizations"
            style={{
              padding: '8px 18px',
              borderRadius: 9,
              border: 'none',
              background: ACCENT,
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            View all
          </Link>
        </div>
        {loading && (
          <div style={{ padding: '24px 0', color: MUTED, fontSize: 14 }}>Loading organizations…</div>
        )}
        {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {orgs.map((org, i) => {
            const planLabel = (org.plan || 'free').charAt(0).toUpperCase() + (org.plan || 'free').slice(1)
            const color = ORG_COLORS[i % ORG_COLORS.length]
            return (
            <Link
              key={org.id}
              to={`/organizations/${org.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '16px 0',
                borderBottom: i < orgs.length - 1 ? '1px solid #f0ebe0' : 'none',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
                color: '#fff',
                flexShrink: 0,
                letterSpacing: '0.02em',
              }}>
                {getInitials(org.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: DARK, marginBottom: 3 }}>{org.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 11,
                    fontFamily: MONO,
                    background: planLabel === 'Enterprise' ? '#f0edff' : planLabel === 'Pro' ? '#fff5f0' : '#f5f5f5',
                    color: planLabel === 'Enterprise' ? '#7c6af7' : planLabel === 'Pro' ? ACCENT : MUTED,
                    padding: '2px 8px',
                    borderRadius: 5,
                    letterSpacing: '0.04em',
                  }}>
                    {planLabel.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 12, color: MUTED }}>
                    {org.memberCount} members
                  </span>
                </div>
              </div>
            </Link>
            )
          })}
          {orgs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: MUTED, fontSize: 14 }}>
              You're not a member of any organizations yet.
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  )
}

const SECTION_COMPONENTS = {
  Profile: ProfileSection,
  Security: SecuritySection,
  'API Keys': ApiKeysSection,
  Notifications: NotificationsSection,
  Billing: BillingSection,
  Organizations: OrganizationsSection,
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('Profile')
  const ActiveComponent = SECTION_COMPONENTS[activeSection]

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <div style={{
        background: 'linear-gradient(180deg,#efe8da 0%,#f1ede4 100%)',
        borderBottom: '1px solid #e3dccd',
        padding: '40px 28px 36px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.08em',
            color: MUTED,
            marginBottom: 10,
            textTransform: 'uppercase',
          }}>
            Account
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', color: DARK, margin: 0, lineHeight: 1.1 }}>
            Settings
          </h1>
          <div style={{ fontSize: 15, color: MEDIUM, marginTop: 6 }}>
            Manage your account preferences and configuration
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 80px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>

        <div style={{
          width: 220,
          flexShrink: 0,
          background: '#fff',
          border: CARD_BORDER,
          borderRadius: 14,
          padding: '24px 16px',
          position: 'sticky',
          top: 28,
        }}>
          <div style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.08em',
            color: MUTED,
            textTransform: 'uppercase',
            marginBottom: 10,
            padding: '0 8px',
          }}>
            Settings
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_SECTIONS.map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: activeSection === section ? 600 : 400,
                  color: activeSection === section ? ACCENT : MEDIUM,
                  background: activeSection === section ? '#f5f0e8' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all .12s',
                }}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <ActiveComponent />
        </div>

      </div>
    </div>
  )
}
