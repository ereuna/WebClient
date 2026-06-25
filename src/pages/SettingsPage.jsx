import { useState } from 'react'

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
  const [form, setForm] = useState({
    fullName: 'Tomi Tsuma',
    username: 'tomi-tsuma',
    email: 'tommytsuma7@gmail.com',
    bio: 'ML engineer working on multilingual NLP and computer vision systems.',
    location: 'Nairobi, Kenya',
    website: 'https://tomi.dev',
  })
  const [saved, setSaved] = useState(false)

  function handleChange(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
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
            TT
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
              style={INPUT_STYLE}
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
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
            style={{
              padding: '10px 22px',
              borderRadius: 9,
              border: 'none',
              background: ACCENT,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save changes
          </button>
          {saved && (
            <span style={{ fontSize: 13, color: '#2db88a', fontWeight: 500 }}>
              Changes saved
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function SecuritySection() {
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [twoFa, setTwoFa] = useState(true)
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome · macOS', location: 'Nairobi, KE', last: '2 minutes ago', current: true },
    { id: 2, device: 'Firefox · Ubuntu', location: 'Nairobi, KE', last: '3 hours ago', current: false },
    { id: 3, device: 'Safari · iPhone 15', location: 'Mombasa, KE', last: '2 days ago', current: false },
  ])

  function revokeSession(id) {
    setSessions(s => s.filter(x => x.id !== id))
  }

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
          <Toggle on={twoFa} onChange={setTwoFa} />
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
                        onClick={() => revokeSession(s.id)}
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
  const [keys, setKeys] = useState([
    { id: 1, name: 'Production Key', prefix: 'sk-...x9f2', created: 'Jan 12, 2025', lastUsed: '2 hours ago' },
    { id: 2, name: 'Dev Key', prefix: 'sk-...m4k7', created: 'Mar 3, 2025', lastUsed: 'Yesterday' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState(null)
  const [copied, setCopied] = useState(false)

  function revokeKey(id) {
    setKeys(k => k.filter(x => x.id !== id))
  }

  function generateKey() {
    if (!newKeyName.trim()) return
    const fake = 'sk-aether-' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)
    setGeneratedKey(fake)
    setKeys(k => [...k, {
      id: Date.now(),
      name: newKeyName,
      prefix: 'sk-...' + fake.slice(-4),
      created: 'Just now',
      lastUsed: 'Never',
    }])
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
                      onClick={() => revokeKey(k.id)}
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
  const [notifs, setNotifs] = useState([
    { key: 'training', label: 'Training completed', on: true },
    { key: 'depFailed', label: 'Deployment failed', on: true },
    { key: 'pipeFailed', label: 'Pipeline failed', on: true },
    { key: 'dataset', label: 'Dataset updated', on: false },
    { key: 'mention', label: 'Repository mentioned', on: true },
  ])
  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    slack: false,
    webhook: false,
  })

  function toggleNotif(key) {
    setNotifs(n => n.map(x => x.key === key ? { ...x, on: !x.on } : x))
  }

  function toggleChannel(key) {
    setChannels(c => ({ ...c, [key]: !c[key] }))
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
              <Toggle on={n.on} onChange={() => toggleNotif(n.key)} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 22 }}>Delivery Channels</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { key: 'inApp', label: 'In-App', desc: 'Notifications inside the platform' },
            { key: 'email', label: 'Email', desc: 'Send to tommytsuma7@gmail.com' },
            { key: 'slack', label: 'Slack', desc: 'Connect a Slack workspace' },
            { key: 'webhook', label: 'Webhook', desc: 'POST to a custom URL' },
          ].map(ch => (
            <div
              key={ch.key}
              style={{
                background: '#faf7f0',
                border: channels[ch.key] ? `1.4px solid ${ACCENT}` : CARD_BORDER,
                borderRadius: 11,
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 3 }}>{ch.label}</div>
                <div style={{ fontSize: 12, color: MUTED }}>{ch.desc}</div>
              </div>
              <Toggle on={channels[ch.key]} onChange={() => toggleChannel(ch.key)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BillingSection() {
  const usageBars = [
    { label: 'Compute', used: 78, unit: '78 / 100 GPU-hrs', color: ACCENT },
    { label: 'Storage', used: 47, unit: '234 / 500 GB', color: '#7c6af7' },
    { label: 'Inference', used: 62, unit: '48.2K / 80K calls', color: '#3498db' },
  ]

  return (
    <div>
      <SectionLabel>Billing</SectionLabel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28 }}>
          <div style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.08em',
            color: MUTED,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            Current Plan
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: DARK, letterSpacing: '-0.03em', lineHeight: 1 }}>
            Pro
          </div>
          <div style={{ fontSize: 14, color: MEDIUM, marginTop: 6, marginBottom: 20 }}>
            $49 <span style={{ color: MUTED, fontSize: 12 }}>/ month</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {['100 GPU hours / mo', '500 GB storage', '80K inference calls', 'Priority support'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: MEDIUM }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2db88a', flexShrink: 0 }} />
                {f}
              </div>
            ))}
          </div>
          <button style={{
            padding: '9px 18px',
            borderRadius: 9,
            border: CARD_BORDER,
            background: '#fff',
            fontSize: 13.5,
            fontWeight: 600,
            color: MEDIUM,
            cursor: 'pointer',
          }}>
            Manage plan
          </button>
        </div>

        <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28 }}>
          <div style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.08em',
            color: MUTED,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            Payment Method
          </div>
          <div style={{
            background: 'linear-gradient(135deg,#1b1a17 0%,#3a3530 100%)',
            borderRadius: 12,
            padding: '18px 20px',
            marginBottom: 16,
            color: '#fff',
          }}>
            <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.12em', marginBottom: 16, opacity: 0.6 }}>
              VISA
            </div>
            <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: '0.12em', marginBottom: 14 }}>
              •••• •••• •••• 4242
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Tomi Tsuma</div>
              <div style={{ fontFamily: MONO, fontSize: 11, opacity: 0.7 }}>12/27</div>
            </div>
          </div>
          <button style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: CARD_BORDER,
            background: '#fff',
            fontSize: 13,
            fontWeight: 600,
            color: MEDIUM,
            cursor: 'pointer',
          }}>
            Update card
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28, marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 22 }}>Usage This Month</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {usageBars.map(b => (
            <div key={b.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: DARK }}>{b.label}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>{b.unit}</span>
              </div>
              <div style={{
                height: 8,
                background: '#f0ebe0',
                borderRadius: 4,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${b.used}%`,
                  background: b.color,
                  borderRadius: 4,
                  transition: 'width .5s',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg,#1b1a17 0%,#2e2a24 100%)',
        border: 'none',
        borderRadius: 14,
        padding: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}>
        <div>
          <div style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.1em',
            color: '#a09880',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Enterprise
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Upgrade to Enterprise
          </div>
          <div style={{ fontSize: 13.5, color: '#a09880', lineHeight: 1.55 }}>
            Unlimited compute, SSO, private model registry, SLA guarantees, and dedicated support.
          </div>
        </div>
        <button style={{
          padding: '12px 24px',
          borderRadius: 10,
          border: 'none',
          background: ACCENT,
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          Contact Sales
        </button>
      </div>
    </div>
  )
}

function OrganizationsSection() {
  const [orgs, setOrgs] = useState([
    { id: 1, name: 'AfroML Labs', role: 'Owner', plan: 'Enterprise', avatar: 'AL', color: '#7c6af7' },
    { id: 2, name: 'Nairobi AI Research', role: 'Member', plan: 'Pro', avatar: 'NA', color: '#2db88a' },
    { id: 3, name: 'OpenSafari Foundation', role: 'Contributor', plan: 'Free', avatar: 'OS', color: '#3498db' },
  ])

  function leaveOrg(id) {
    setOrgs(o => o.filter(x => x.id !== id))
  }

  return (
    <div>
      <SectionLabel>Organizations</SectionLabel>

      <div style={{ background: '#fff', border: CARD_BORDER, borderRadius: 14, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: DARK }}>Your Organizations</div>
          <button style={{
            padding: '8px 18px',
            borderRadius: 9,
            border: 'none',
            background: ACCENT,
            color: '#fff',
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            + New organization
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {orgs.map((org, i) => (
            <div
              key={org.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '16px 0',
                borderBottom: i < orgs.length - 1 ? '1px solid #f0ebe0' : 'none',
              }}
            >
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: org.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
                color: '#fff',
                flexShrink: 0,
                letterSpacing: '0.02em',
              }}>
                {org.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: DARK, marginBottom: 3 }}>{org.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 11,
                    fontFamily: MONO,
                    background: '#f5f0e8',
                    color: MEDIUM,
                    padding: '2px 8px',
                    borderRadius: 5,
                    letterSpacing: '0.04em',
                  }}>
                    {org.role.toUpperCase()}
                  </span>
                  <span style={{
                    fontSize: 11,
                    fontFamily: MONO,
                    background: org.plan === 'Enterprise' ? '#f0edff' : org.plan === 'Pro' ? '#fff5f0' : '#f5f5f5',
                    color: org.plan === 'Enterprise' ? '#7c6af7' : org.plan === 'Pro' ? ACCENT : MUTED,
                    padding: '2px 8px',
                    borderRadius: 5,
                    letterSpacing: '0.04em',
                  }}>
                    {org.plan.toUpperCase()}
                  </span>
                </div>
              </div>
              {org.role !== 'Owner' && (
                <button
                  onClick={() => leaveOrg(org.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 7,
                    border: '1.4px solid #e0d8ce',
                    background: '#fff',
                    color: MUTED,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Leave
                </button>
              )}
            </div>
          ))}
          {orgs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: MUTED, fontSize: 14 }}>
              You're not a member of any organizations.
            </div>
          )}
        </div>
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
