// ereuna logo — vectorised from the source drawing in design/brand/ereuna-logo-source.png
// (October 2026): a wellbore and bowl inside nested isotherm rings.
// Every size shows the complete drawing. Only the line weight changes: the source's
// hairlines are thickened as the logo gets smaller so the rings stay visible.
// Static brand files (SVG, PNG sizes, mono, reversed) live in /public/brand.
import { useId } from 'react'

// Drawing at source line weights, in the source image's pixel coordinates.
const DRAWING = "<path d=\"M408.4 540.5 L408.4 526.5 A144 144 0 1 1 440.0 551.2\" stroke=\"{outer}\" stroke-width=\"5.4\"/><path d=\"M410.7 507.0 L410.7 485.0 A117 117 0 1 1 457.1 529.8\" stroke=\"url(#{gid})\" stroke-width=\"5.0\"/><path d=\"M406.1 422.8 A106 106 0 0 1 512.0 320.5\" stroke=\"{grey}\" stroke-width=\"4.2\"/><path d=\"M565.0 334.7 A106 106 0 0 1 615.7 448.5\" stroke=\"{grey}\" stroke-width=\"4.2\"/><path d=\"M534.4 330.6 A98 98 0 0 1 604.9 389.8\" stroke=\"{navy}\" stroke-width=\"5.5\"/><circle cx=\"514\" cy=\"426.5\" r=\"88\" stroke=\"{navy}\" stroke-width=\"5.5\"/><path d=\"M428.5 404 V585\" stroke=\"{navy}\" stroke-width=\"5.5\"/>"

const TONES = {
  light: { outer: '#c2410c', mid2: '#8f4527', grey: '#57524c', navy: '#1b2230', word: '#1b2230' },
  dark: { outer: '#e0773f', mid2: '#b8653b', grey: '#a39d90', navy: '#ece7dc', word: '#ece7dc' },
  black: { outer: '#17202e', mid2: '#17202e', grey: '#17202e', navy: '#17202e', word: '#17202e' },
  white: { outer: '#ffffff', mid2: '#ffffff', grey: '#ffffff', navy: '#ffffff', word: '#ffffff' },
}

// Line-weight multiplier for the rendered size (matches the files in /public/brand).
function weightFor(size) {
  if (size >= 96) return 1
  if (size >= 56) return 1.4
  if (size >= 40) return 1.6
  if (size >= 28) return 1.8
  return 2.4
}

export function LogoMark({ size = 36, tone = 'light', title, style }) {
  const gid = 'lg' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const t = TONES[tone] || TONES.light
  const k = weightFor(size)
  const vars = { ...t, gid }
  const inner = DRAWING
    .replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '')
    .replace(/stroke-width="([\d.]+)"/g, (_, w) => `stroke-width="${(parseFloat(w) * k).toFixed(1)}"`)
  const grad = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.outer}"/><stop offset="1" stop-color="${t.mid2}"/></linearGradient></defs>`
  return (
    <svg
      width={size} height={size} viewBox="352 272 320 320"
      role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}
      style={{ display: 'block', flexShrink: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: `${grad}<g fill="none" stroke-linecap="round" stroke-linejoin="round">${inner}</g>` }}
    />
  )
}

// Mark + lowercase wordmark. Proportions follow /public/brand/ereuna-logo.svg:
// wordmark is Space Grotesk 500 at 0.66 x mark height, gap 0.22 x mark height.
export default function Logo({ size = 36, tone = 'light' }) {
  const t = TONES[tone] || TONES.light
  return (
    <span
      aria-label="ereuna"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.22),
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
        fontSize: Math.round(size * 0.66), letterSpacing: '-0.025em', lineHeight: 1,
        color: t.word,
      }}
    >
      <LogoMark size={size} tone={tone} />
      <span aria-hidden="true">ereuna</span>
    </span>
  )
}
