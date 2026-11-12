import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

const cols = [
  {
    heading: 'PLATFORM',
    links: [
      { label: 'Research', to: '/research' },
      { label: 'Domains', to: '/domains' },
      { label: 'Fields', to: '/fields' },
      { label: 'Workbench', to: '/workbench' },
      { label: 'Benchmarks', to: '/benchmarks' },
    ],
  },
  {
    heading: 'DEVELOP',
    links: [
      { label: 'How Ereuna works', to: '/docs#organized' },
      { label: 'Workbench overview', to: '/docs#workbench-overview' },
      { label: 'EnergyGraph', to: '/docs#eg-spec' },
      { label: 'Physics constraint checker', to: '/docs#physics-check' },
    ],
  },
  {
    heading: 'RESEARCH',
    links: [
      { label: 'Olkaria studies', to: '/fields/olkaria' },
      { label: 'Constraint checker', to: '/workbench/validate' },
      { label: 'Inverse PINN k(x)', to: '/workbench/train' },
      { label: 'Held-out benchmarks', to: '/benchmarks' },
    ],
  },
  {
    heading: 'COMMUNITY',
    links: [
      { label: 'Documentation', to: '/docs' },
      { label: 'GitHub', href: 'https://github.com' },
      { label: 'Discord', href: 'https://discord.com' },
      { label: 'Contact', to: '/docs#contact' },
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
              <Logo size={36} tone="dark" />
            </Link>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#8a857a', margin: '14px 0 0', maxWidth: 280 }}>
              Ereuna is the computational engine for Kenya's geothermal energy.
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
          <span>Thomas Amogolla Tsuma</span>
        </div>
      </div>
    </div>
  )
}
