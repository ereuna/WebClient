import React from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { DOMAINS } from '../data/domains'

const ACCENT = '#cf5a2a'
const MONO = "'Space Mono', monospace"

export default function DomainsPage() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #ede7d8 0%, #f1ede4 100%)',
        borderBottom: '1px solid #e3dccd',
        padding: '56px 28px 48px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.08em', color: ACCENT, marginBottom: 14 }}>
            GEOTHERMAL RESOURCE LIFECYCLE
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.025em', fontWeight: 600, margin: 0 }}>
            Domains
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            lineHeight: 1.55,
            color: '#56524a',
            maxWidth: 680,
            margin: '18px 0 0',
          }}>
            Organized around the geothermal resource lifecycle, from finding a prospect to managing production.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 28px 0' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: '#8a857a', letterSpacing: '0.05em' }}>
            7 LIFECYCLE RESEARCH AREAS
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#8a857a', fontFamily: MONO }}>STATUS:</span>
            <StatusBadge status="Drafted" />
            <StatusBadge status="Coming soon" />
          </div>
        </div>

        {/* 7 Domain Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 24,
        }}>
          {DOMAINS.map(item => (
            <div
              key={item.id}
              style={{
                background: '#fff',
                border: '1px solid #e7e0d2',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 22px rgba(0,0,0,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Card Image banner */}
              <div style={{
                background: '#faf7f0',
                borderBottom: '1px solid #ede5d6',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 16px',
                height: 190,
              }}>
                <img
                  src={item.image}
                  alt={item.alt}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 170,
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #e7e0d2',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontFamily: MONO,
                  fontSize: 10.5,
                  color: ACCENT,
                  fontWeight: 600,
                }}>
                  DOMAIN {item.n}
                </div>
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <StatusBadge status={item.status} />
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: '#1b1a17' }}>
                    {item.label}
                  </h2>
                  <div style={{ fontSize: 13, color: '#8a857a', fontWeight: 500, margin: '4px 0 10px' }}>
                    {item.subtitle}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: '#56524a', margin: 0 }}>
                    {item.desc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                    {item.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 10.5,
                          fontFamily: MONO,
                          background: '#f8f5ee',
                          border: '1px solid #e7e0d2',
                          padding: '3px 7px',
                          borderRadius: 5,
                          color: '#6f6a60',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 22, paddingTop: 14, borderTop: '1px solid #f2ede4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11.5, fontFamily: MONO, color: '#8a857a' }}>
                    {item.energyGraphRole.split(' ')[0]}
                  </span>
                  <Link
                    to={`/domains/${item.slug}`}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: ACCENT,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    Inspect domain <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
