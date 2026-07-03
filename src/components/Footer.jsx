import { Link } from 'react-router-dom'

const ACCENT = '#cf5a2a'

const cols = [
  {
    heading: 'PLATFORM',
    links: [
      { label: 'Models', to: '/models' },
      { label: 'Datasets', to: '/datasets' },
      { label: 'Benchmarks', to: '/benchmarks' },
      { label: 'Flagship apps', to: '/apps' },
    ],
  },
  {
    heading: 'DEVELOP',
    links: [
      { label: 'Python SDK', to: '/docs' },
      { label: 'REST API', to: '/docs' },
      { label: 'EnergyGraph', to: '/docs' },
      { label: 'Model cards', to: '/docs' },
    ],
  },
  {
    heading: 'RESEARCH',
    links: [
      { label: 'Transfer learning', to: '/docs' },
      { label: 'Constraint checker', to: '/docs' },
      { label: 'Foundation model', to: '/models' },
      { label: 'Citing Ereuna', to: '/docs' },
    ],
  },
  {
    heading: 'COMMUNITY',
    links: [
      { label: 'Upload a model', to: '/docs' },
      { label: 'GitHub', href: 'https://github.com' },
      { label: 'Discord', href: 'https://discord.com' },
      { label: 'Contact', to: '/docs' },
    ],
  },
]

const linkStyle = {
  cursor: 'pointer',
  color: '#cdc6b8',
  textDecoration: 'none',
  transition: 'color .15s',
}

export default function Footer() {
  return (
    <div style={{ background: '#1b1a17', color: '#cdc6b8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '54px 28px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', gap: 30 }}>
          <div>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 19, fontWeight: 600, color: '#f1ede4' }}>
                <span style={{ display: 'inline-flex', width: 24, height: 24, alignItems: 'center', justifyContent: 'center', border: '1.6px solid #f1ede4', borderRadius: 7, fontSize: 13 }}>⬡</span>
                Ereuna
              </div>
            </Link>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#8a857a', margin: '14px 0 0', maxWidth: 280 }}>
              The Hugging Face of energy ML. Physics-informed models, one representation, built by and for
              the people who run energy systems.
            </p>
          </div>
          {cols.map(({ heading, links }) => (
            <div key={heading}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: '#6f6a60', letterSpacing: '0.05em', marginBottom: 12 }}>{heading}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13.5 }}>
                {links.map(({ label, to, href }) =>
                  href ? (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>{label}</a>
                  ) : (
                    <Link key={label} to={to} style={linkStyle}>{label}</Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          borderTop: '1px solid #2e2c28', marginTop: 40, paddingTop: 22,
          display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap',
          fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#6f6a60',
        }}>
          <span>Built on TorchPharma · Thomas Amogolla Tsuma · INTI International University Malaysia</span>
          <span>© 2026 Ereuna · Apache-2.0</span>
        </div>
      </div>
    </div>
  )
}
