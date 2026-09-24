// Axon S2 Line Iso — illustrations for the homepage "How Ereuna is organized" section.
//
// Unlike the hand-typed polygons in the other illustration files, these are built from a
// small 2:1 dimetric helper (`makeIso`) so the four drawings share one projection and the
// geometry can be adjusted by changing world units rather than recomputing screen points.
//
// Content rule (see ereuna-geothermal-rewrite-brief.md): labels only restate the section
// copy or whitelist item W9 (Olkaria, Menengai, East African Rift). No well IDs, figures,
// or metric values are drawn — plots are unitless shapes.

const INK = '#34322d'
const MUTED = '#8a857a'
const FAINT = '#cfc8b9'
const LEADER = '#bdb6a6'
const LEFT = '#efeadf'
const RIGHT = '#e4ddcf'
const ACC = '#cf5a2a'
const ACC_TOP = '#f7e2d5'
const ACC_LEFT = '#f3d3c0'
const ACC_RIGHT = '#ecc3aa'
const MONO = "'Space Mono',monospace"

// World (x, y, z) -> screen. x runs right-down, y runs left-down, z runs up.
// Depth toward the viewer is x + y + z, so draw in ascending x + y order.
function makeIso(ox, oy, u) {
  const p = (x, y, z = 0) => [ox + (x - y) * u, oy + ((x + y) * u) / 2 - z * u]
  p.u = u
  return p
}

const pts = (...ps) => ps.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

function Box({ p, x, y, z = 0, w, d, h, top = '#fff', left = LEFT, right = RIGHT, stroke = INK, sw = 1.4 }) {
  const t = [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)]
  const b = [p(x + w, y, z), p(x + w, y + d, z), p(x, y + d, z)]
  return (
    <g stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
      <polygon points={pts(t[3], t[2], b[1], b[2])} fill={left} />
      <polygon points={pts(t[2], t[1], b[0], b[1])} fill={right} />
      <polygon points={pts(...t)} fill={top} />
    </g>
  )
}

// A circle lying flat on a horizontal plane projects to an axis-aligned 2:1 ellipse.
function IsoCircle({ p, x, y, z = 0, r, ...rest }) {
  const [cx, cy] = p(x, y, z)
  const rx = Math.SQRT2 * r * p.u
  return <ellipse cx={cx} cy={cy} rx={rx} ry={rx / 2} {...rest} />
}

function Line({ a, b, ...rest }) {
  return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} {...rest} />
}

function Label({ x, y, children, color = MUTED, anchor = 'middle', size = 9, weight = 400 }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={MONO} fontSize={size} fontWeight={weight} fill={color} letterSpacing="0.04em">
      {children}
    </text>
  )
}

// Leader line with the small square terminal used across the Axon illustrations.
// Pass square={false} when the leader starts at a highlighted mark it must not cover.
function Leader({ from, to, square = true }) {
  return (
    <g>
      <Line a={from} b={to} stroke={LEADER} strokeWidth="1" />
      {square && <rect x={from[0] - 2.5} y={from[1] - 2.5} width="5" height="5" fill="#fff" stroke={INK} strokeWidth="1" />}
    </g>
  )
}

// Open arrowhead whose tip sits at `at`, pointing along screen vector `dir`.
function Chevron({ at, dir, size = 4.5, color = ACC }) {
  const len = Math.hypot(dir[0], dir[1])
  const [ux, uy] = [dir[0] / len, dir[1] / len]
  const back = [at[0] - ux * size * 1.5, at[1] - uy * size * 1.5]
  const a = [back[0] - uy * size, back[1] + ux * size]
  const b = [back[0] + uy * size, back[1] - ux * size]
  return <polyline points={pts(a, at, b)} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
}

// Map-pin style wellhead: collar ellipse on the ground, short riser, round head.
function Wellhead({ at, held = false, rise = 13 }) {
  const [x, y] = at
  return (
    <g>
      <ellipse cx={x} cy={y} rx="3.2" ry="1.6" fill="#fff" stroke={INK} strokeWidth="1" />
      <line x1={x} y1={y} x2={x} y2={y - rise} stroke={INK} strokeWidth="1.2" />
      {held && <circle cx={x} cy={y - rise} r="6.5" fill="none" stroke={ACC} strokeWidth="1" strokeDasharray="2 2" />}
      <circle cx={x} cy={y - rise} r="2.8" fill={held ? ACC : INK} />
    </g>
  )
}

const svgStyle = { width: '100%', maxWidth: 520, display: 'block', overflow: 'visible' }

// ─────────────────────────────────────────────────────────────────────────────
// 01 · Domains — seven research-area tiles on one tray, one lifted out, with a range
// bar from "exploration & drilling" to "reservoir & production engineering".
// Only the range endpoints are labelled: the copy names those, not all seven areas.
// ─────────────────────────────────────────────────────────────────────────────
export function DomainsIso() {
  const p = makeIso(178, 128, 26)
  const STEP = 1.18
  const TILE_H = 0.22
  const LIFTED = 3
  const LIFT_Z = 0.95
  const lx = LIFTED * STEP
  const last = 6 * STEP

  const [dx, dy] = p(0.5, 0.75, TILE_H)
  const plant = { x: last + 0.22, y: 0.4, w: 0.56, d: 0.7, h: 0.5 }
  const [sx, sy] = p(plant.x + plant.w / 2, plant.y + plant.d / 2, TILE_H + plant.h)

  const RANGE_Y = 2.45
  const r0 = p(0, RANGE_Y, -0.35)
  const r1 = p(last + 1, RANGE_Y, -0.35)
  const liftedTop = p(lx + 0.5, 0.75, LIFT_Z + TILE_H)

  // Derrick legs taper from ±8px at the tile to ±1.5px at the crown.
  const legHalf = t => 8 - 6.5 * t
  const legY = t => dy + 2 - 42 * t

  return (
    <svg viewBox="0 0 520 320" style={svgStyle} role="img"
      aria-label="Seven research-area tiles on a tray, one lifted out, spanning exploration and drilling to reservoir and production engineering">
      <Label x={24} y={30} anchor="start">7 RESEARCH AREAS</Label>

      {/* tray */}
      <Box p={p} x={-0.3} y={-0.3} z={-0.35} w={last + 1.6} d={2.1} h={0.35} />
      <circle cx={p(-0.1, 1.6)[0]} cy={p(-0.1, 1.6)[1]} r="2.2" fill={MUTED} />
      <circle cx={p(last + 1.1, -0.1)[0]} cy={p(last + 1.1, -0.1)[1]} r="2.2" fill={MUTED} />

      {/* tiles, back to front */}
      {Array.from({ length: 7 }, (_, i) => {
        const x = i * STEP
        if (i === LIFTED) {
          return (
            <polygon key={i} points={pts(p(x, 0), p(x + 1, 0), p(x + 1, 1.5), p(x, 1.5))}
              fill="#e6dfd0" stroke={INK} strokeWidth="1" strokeDasharray="3 3" />
          )
        }
        const plain = i !== 0 && i !== 6
        return (
          <g key={i}>
            <Box p={p} x={x} y={0} w={1} d={1.5} h={TILE_H} />
            {plain && (
              <polygon points={pts(p(x + 0.28, 0.35, TILE_H), p(x + 0.72, 0.35, TILE_H), p(x + 0.72, 1.15, TILE_H), p(x + 0.28, 1.15, TILE_H))}
                fill="none" stroke={FAINT} strokeWidth="1" />
            )}
          </g>
        )
      })}

      {/* tile 1 — drilling derrick (exploration & drilling end of the range) */}
      <g stroke={INK} strokeWidth="1.3" strokeLinecap="round" fill="none">
        <line x1={dx - legHalf(0)} y1={legY(0)} x2={dx - legHalf(1)} y2={legY(1)} />
        <line x1={dx + legHalf(0)} y1={legY(0)} x2={dx + legHalf(1)} y2={legY(1)} />
        {[0.25, 0.5, 0.75].map(t => (
          <line key={t} x1={dx - legHalf(t)} y1={legY(t)} x2={dx + legHalf(t)} y2={legY(t)} strokeWidth="1" />
        ))}
        {[0, 0.25, 0.5].map((t, k) => {
          const s = k % 2 ? -1 : 1
          return <line key={t} x1={dx - s * legHalf(t)} y1={legY(t)} x2={dx + s * legHalf(t + 0.25)} y2={legY(t + 0.25)} strokeWidth="0.8" />
        })}
      </g>
      <rect x={dx - 3.5} y={legY(1) - 4} width="7" height="4" fill="#fff" stroke={INK} strokeWidth="1" />
      <circle cx={dx} cy={legY(1) - 9} r="2.6" fill={ACC} />

      {/* tile 7 — production plant with steam (reservoir & production end of the range) */}
      <Box p={p} {...plant} z={TILE_H} />
      <g fill="#fff" stroke={FAINT} strokeWidth="1.1">
        <circle cx={sx + 2} cy={sy - 9} r="4" />
        <circle cx={sx + 7} cy={sy - 18} r="5" />
        <circle cx={sx + 3} cy={sy - 29} r="6" />
      </g>

      {/* lifted tile + drop guides into its empty socket */}
      <g stroke={ACC} strokeWidth="0.9" strokeDasharray="2 3">
        {[[lx, 1.5], [lx + 1, 1.5], [lx + 1, 0]].map(([x, y]) => (
          <Line key={`${x}-${y}`} a={p(x, y, 0)} b={p(x, y, LIFT_Z)} />
        ))}
      </g>
      <Box p={p} x={lx} y={0} z={LIFT_Z} w={1} d={1.5} h={TILE_H} top={ACC_TOP} left={ACC_LEFT} right={ACC_RIGHT} stroke={ACC} />
      <polygon points={pts(p(lx + 0.28, 0.35, LIFT_Z + TILE_H), p(lx + 0.72, 0.35, LIFT_Z + TILE_H), p(lx + 0.72, 1.15, LIFT_Z + TILE_H), p(lx + 0.28, 1.15, LIFT_Z + TILE_H))}
        fill="none" stroke={ACC} strokeWidth="1" />
      <Leader from={liftedTop} to={[liftedTop[0], 74]} />
      <Label x={liftedTop[0]} y={66} color={ACC}>ONE DOMAIN</Label>

      {/* range: from exploration & drilling → to reservoir & production engineering */}
      <Line a={r0} b={r1} stroke={MUTED} strokeWidth="1" />
      <Line a={p(0, RANGE_Y - 0.18, -0.35)} b={p(0, RANGE_Y + 0.18, -0.35)} stroke={MUTED} strokeWidth="1" />
      <Chevron at={r1} dir={[r1[0] - r0[0], r1[1] - r0[1]]} color={MUTED} />
      <Label x={r0[0] - 8} y={r0[1] + 14} anchor="end" color={INK}>EXPLORATION &amp;</Label>
      <Label x={r0[0] - 8} y={r0[1] + 26} anchor="end" color={INK}>DRILLING</Label>
      <Label x={r1[0] + 10} y={r1[1] + 4} anchor="start" color={INK}>RESERVOIR &amp;</Label>
      <Label x={r1[0] + 10} y={r1[1] + 16} anchor="start" color={INK}>PRODUCTION ENGINEERING</Label>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 02 · Fields — a terrain slab of the Kenya Rift: two normal faults bound the rift
// floor (graben), Menengai to the north and Olkaria to the south sit inside it with
// their wells, and one well links out to a stack of published well-data sheets.
// North is up-right (−y), so Menengai is drawn north of Olkaria, as on a map.
// ─────────────────────────────────────────────────────────────────────────────
export function FieldsIso() {
  const p = makeIso(166, 104, 28)
  const W = 5.6
  const D = 4.4
  const H = 0.8
  const [FW, FE] = [2.0, 3.4] // graben-bounding faults (constant x, running north–south)
  const faultX = (edge, z) => edge + (edge === FW ? 1 : -1) * 0.2 * (-z / H) // faults dip inward

  // Well offsets from each field centre; `pub` marks the well linked to published data.
  const fields = [
    { name: 'MENENGAI', c: [2.7, 1.0], wells: [[-0.3, -0.12], [0.22, 0.12, 'pub'], [-0.05, 0.38]] },
    { name: 'OLKARIA', c: [2.75, 3.3], wells: [[-0.32, 0.02], [0.1, -0.3], [0.3, 0.2], [-0.05, 0.36]] },
  ]
  const wells = fields
    .flatMap(f => f.wells.map(([ox, oy, pub]) => ({ x: f.c[0] + ox, y: f.c[1] + oy, pub: pub === 'pub' })))
    .sort((a, b) => a.x + a.y - (b.x + b.y))
  const published = wells.find(w => w.pub)
  const pubHead = [p(published.x, published.y)[0], p(published.x, published.y)[1] - 13]

  const menengai = p(...fields[0].c)
  const olkaria = p(...fields[1].c)
  const olkariaRy = (Math.SQRT2 * 0.62 * p.u) / 2

  // Stylised temperature-vs-depth trace on the front sheet (unitless).
  const trace = [[372, 137], [397, 151], [420, 166], [438, 184], [449, 203], [455, 222]]

  return (
    <svg viewBox="0 0 520 320" style={svgStyle} role="img"
      aria-label="Terrain slab of the Kenya Rift with Menengai and Olkaria geothermal fields, their wells, and a well linked to published well data">
      <Label x={24} y={30} anchor="start">KENYA · EAST AFRICAN RIFT</Label>

      {/* terrain slab */}
      <Box p={p} x={0} y={0} z={-H} w={W} d={D} h={H} />

      {/* offset strata on the cut faces show the rift floor dropped between the faults */}
      <g stroke={FAINT} strokeWidth="1">
        <Line a={p(0, D, -0.35)} b={p(faultX(FW, -0.35), D, -0.35)} />
        <Line a={p(faultX(FW, -0.55), D, -0.55)} b={p(faultX(FE, -0.55), D, -0.55)} />
        <Line a={p(faultX(FE, -0.35), D, -0.35)} b={p(W, D, -0.35)} />
        <Line a={p(W, 0, -0.35)} b={p(W, D, -0.35)} />
      </g>
      <g stroke={INK} strokeWidth="1.1">
        <Line a={p(FW, D, 0)} b={p(faultX(FW, -H), D, -H)} />
        <Line a={p(FE, D, 0)} b={p(faultX(FE, -H), D, -H)} />
      </g>

      {/* rift floor + fault traces with ticks on the downthrown side */}
      <polygon points={pts(p(FW, 0), p(FE, 0), p(FE, D), p(FW, D))} fill="#f5f0e7" />
      <g stroke={INK} strokeWidth="1.1">
        <Line a={p(FW, 0)} b={p(FW, D)} />
        <Line a={p(FE, 0)} b={p(FE, D)} />
      </g>
      <g stroke={INK} strokeWidth="0.9">
        {Array.from({ length: 10 }, (_, k) => 0.25 + k * 0.44).map(y => (
          <g key={y}>
            <Line a={p(FW, y)} b={p(FW + 0.14, y)} />
            <Line a={p(FE, y)} b={p(FE - 0.14, y)} />
          </g>
        ))}
      </g>

      {/* field outlines */}
      {fields.map(f => (
        <IsoCircle key={f.name} p={p} x={f.c[0]} y={f.c[1]} r={0.62}
          fill={ACC_TOP} fillOpacity="0.7" stroke={ACC} strokeWidth="1.1" strokeDasharray="3 3" />
      ))}

      {/* wells */}
      {wells.map(w => (
        <Wellhead key={`${w.x}-${w.y}`} at={p(w.x, w.y)} held={w.pub} />
      ))}

      {/* field labels: Menengai to the north (up), Olkaria to the south (down) */}
      <Leader from={[menengai[0] - 22, menengai[1] - 2]} to={[menengai[0] - 22, 70]} />
      <Label x={menengai[0] - 22} y={62} color={INK}>MENENGAI</Label>
      <Leader from={[olkaria[0], olkaria[1] + olkariaRy]} to={[olkaria[0], 282]} />
      <Label x={olkaria[0]} y={296} color={INK}>OLKARIA</Label>

      {/* north arrow */}
      <Line a={[284, 124]} b={[304, 114]} stroke={MUTED} strokeWidth="1.1" />
      <Chevron at={[304, 114]} dir={[2, -1]} color={MUTED} size={4} />
      <Label x={312} y={112} anchor="start">N</Label>

      {/* published well data — a stack of sheets linked to one well */}
      <Leader from={[pubHead[0] + 6.5, pubHead[1]]} to={[338, pubHead[1]]} square={false} />
      <rect x="350" y="64" width="144" height="176" rx="6" fill="#fff" stroke="#e0d9ca" />
      <rect x="344" y="70" width="144" height="176" rx="6" fill="#fff" stroke="#e0d9ca" />
      <rect x="338" y="76" width="144" height="176" rx="6" fill="#fff" stroke={INK} strokeWidth="1.2" />
      <Label x={350} y={95} anchor="start" size={8.5}>PUBLISHED WELL DATA</Label>
      <rect x="350" y="102" width="112" height="3" rx="1.5" fill="#ebe5d8" />
      <rect x="350" y="109" width="78" height="3" rx="1.5" fill="#ebe5d8" />
      <g stroke={INK} strokeWidth="1">
        <line x1="352" y1="124" x2="468" y2="124" />
        <line x1="352" y1="124" x2="352" y2="234" />
      </g>
      <Label x={468} y={120} anchor="end" size={7.5}>TEMP →</Label>
      <Label x={356} y={246} anchor="start" size={7.5}>DEPTH ↓</Label>
      <path d="M356,127 C392,140 428,164 446,194 S457,226 459,232" fill="none" stroke={FAINT} strokeWidth="1.2" />
      {trace.map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.4" fill={ACC} />)}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 03 · Workbench — four stations on one chain, started by a RUN control:
// simulate a reservoir → sample virtual (dashed) wells → train → validate.
// ─────────────────────────────────────────────────────────────────────────────
export function WorkbenchIso() {
  const p = makeIso(175, 118, 25)
  const PITCH = 3.2
  const P = 2.2
  const PH = 0.2
  const BLOCK = { off: 0.35, size: 1.5, h: 0.75 }
  const blockTop = PH + BLOCK.h
  const BOARD = { y: 0.2, d: 1.8, h: 1.55 } // upright board facing +x (lower-right)

  const stations = [
    { n: '01', name: 'SIMULATE', sub: 'RESERVOIR', topZ: blockTop },
    { n: '02', name: 'SAMPLE', sub: 'VIRTUAL WELLS', topZ: blockTop + 0.5 },
    { n: '03', name: 'TRAIN', topZ: PH + BOARD.h },
    { n: '04', name: 'VALIDATE', topZ: PH + BOARD.h },
  ]

  const b0 = BLOCK.off
  const b1 = BLOCK.off + BLOCK.size
  const reservoir = (x0, hot) => (
    <g>
      <Box p={p} x={x0 + b0} y={b0} z={PH} w={BLOCK.size} d={BLOCK.size} h={BLOCK.h} />
      <g stroke={FAINT} strokeWidth="1">
        <Line a={p(x0 + b0, b1, PH + 0.35)} b={p(x0 + b1, b1, PH + 0.35)} />
        <Line a={p(x0 + b1, b0, PH + 0.35)} b={p(x0 + b1, b1, PH + 0.35)} />
      </g>
      {/* simulation mesh on the modelled reservoir */}
      {hot && (
        <g stroke={FAINT} strokeWidth="0.8">
          {[0.5, 1.0].map(k => (
            <g key={k}>
              <Line a={p(x0 + b0 + k, b0, blockTop)} b={p(x0 + b0 + k, b1, blockTop)} />
              <Line a={p(x0 + b0, b0 + k, blockTop)} b={p(x0 + b1, b0 + k, blockTop)} />
            </g>
          ))}
        </g>
      )}
      <IsoCircle p={p} x={x0 + 1.1} y={1.1} z={blockTop} r={0.6} fill={hot ? ACC_TOP : 'none'} stroke={ACC} strokeWidth="1" strokeOpacity={hot ? 1 : 0.4} />
      <IsoCircle p={p} x={x0 + 1.1} y={1.1} z={blockTop} r={0.36} fill={hot ? ACC_LEFT : 'none'} stroke={ACC} strokeWidth="1" strokeOpacity={hot ? 1 : 0.4} />
      {hot && <IsoCircle p={p} x={x0 + 1.1} y={1.1} z={blockTop} r={0.13} fill={ACC} />}
    </g>
  )

  // Boards face +x: a rising curve drawn on that face still rises on screen, whereas on
  // a +y-facing board the 2:1 shear flattens it. `s` runs 0→1 left-to-right across the face.
  const panel = x0 => <Box p={p} x={x0 + 1.02} y={BOARD.y} z={PH} w={0.08} d={BOARD.d} h={BOARD.h} right="#fff" />
  const onPanel = (x0, s, z) => p(x0 + 1.1, BOARD.y + BOARD.d * (1 - s), PH + z)

  const content = [
    // 01 simulate a reservoir: block with a heat plume on its top face
    x0 => reservoir(x0, true),

    // 02 sample virtual wells: the same block, pierced by dashed (virtual) wells
    x0 => (
      <g>
        {reservoir(x0, false)}
        {[[0.75, 0.75], [1.45, 0.8], [0.95, 1.45]].map(([wx, wy]) => {
          const head = p(x0 + wx, wy, blockTop + 0.5)
          return (
            <g key={`${wx}-${wy}`}>
              <Line a={head} b={p(x0 + wx, wy, blockTop)} stroke={ACC} strokeWidth="1.5" strokeDasharray="3 2.5" />
              <Line a={p(x0 + wx, wy, blockTop)} b={p(x0 + wx, wy, PH + 0.08)} stroke={ACC} strokeWidth="1.2" strokeDasharray="2 3" strokeOpacity="0.55" />
              <circle cx={head[0]} cy={head[1]} r="3" fill="#fff" stroke={ACC} strokeWidth="1.3" strokeDasharray="2 1.5" />
            </g>
          )
        })}
      </g>
    ),

    // 03 train: a small network drawn on an upright board
    x0 => {
      const layers = [
        [0.2, [0.45, 0.8, 1.15]],
        [0.5, [0.33, 0.65, 0.97, 1.29]],
        [0.8, [0.62, 1.0]],
      ]
      const nodes = layers.map(([s, zs]) => zs.map(z => onPanel(x0, s, z)))
      return (
        <g>
          {panel(x0)}
          <g stroke={FAINT} strokeWidth="0.8">
            {nodes.slice(1).flatMap((layer, li) =>
              layer.flatMap((b, bi) => nodes[li].map((a, ai) => <Line key={`${li}-${ai}-${bi}`} a={a} b={b} />)),
            )}
          </g>
          {nodes.flatMap((layer, li) =>
            layer.map(([x, y], k) => (
              <circle key={`${li}-${k}`} cx={x} cy={y} r="2.8" fill={li === 2 ? ACC : '#fff'} stroke={li === 2 ? ACC : INK} strokeWidth="1" />
            )),
          )}
        </g>
      )
    },

    // 04 validate: prediction band vs observations on an upright board, with a check
    x0 => {
      const curve = t => [0.16 + t * 0.74, 0.4 + 0.85 * (1 - (1 - t) ** 2)]
      const ts = Array.from({ length: 13 }, (_, k) => k / 12)
      const upper = ts.map(t => { const [s, z] = curve(t); return onPanel(x0, s, z + 0.15) })
      const lower = ts.map(t => { const [s, z] = curve(t); return onPanel(x0, s, z - 0.15) }).reverse()
      const mid = ts.map(t => onPanel(x0, ...curve(t)))
      const obs = [[0.12, 0.06], [0.38, -0.08], [0.62, 0.09], [0.88, -0.05]]
      const badge = onPanel(x0, 1, BOARD.h)
      return (
        <g>
          {panel(x0)}
          <g stroke={INK} strokeWidth="1">
            <Line a={onPanel(x0, 0.1, 0.26)} b={onPanel(x0, 0.94, 0.26)} />
            <Line a={onPanel(x0, 0.1, 0.26)} b={onPanel(x0, 0.1, 1.4)} />
          </g>
          <polygon points={pts(...upper, ...lower)} fill={ACC_TOP} stroke="none" />
          <polyline points={pts(...mid)} fill="none" stroke={ACC} strokeWidth="1.3" />
          {obs.map(([t, dz]) => {
            const [s, z] = curve(t)
            const [cx, cy] = onPanel(x0, s, z + dz)
            return <circle key={t} cx={cx} cy={cy} r="2.2" fill={INK} />
          })}
          <circle cx={badge[0]} cy={badge[1]} r="8" fill={ACC} />
          <path d={`M${badge[0] - 3.8},${badge[1] + 0.2} l2.6,2.8 l5,-5.6`} fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )
    },
  ]

  const flow = [p.u, p.u / 2] // screen direction of +x
  const runStart = p(-1.15, 1.1, PH)
  const runEnd = p(-0.3, 1.1, PH) // stop short of plate 1 so the arrowhead is not covered

  return (
    <svg viewBox="0 0 520 320" style={svgStyle} role="img"
      aria-label="A run control starts a chain of four stations: simulate a reservoir, sample virtual wells, train, validate">
      {/* RUN control feeding the chain */}
      <rect x={runStart[0] - 52} y={runStart[1] - 12} width="50" height="20" rx="10" fill={INK} />
      <text x={runStart[0] - 27} y={runStart[1] + 1.5} textAnchor="middle" fontFamily={MONO} fontSize="9" fill="#fff" letterSpacing="0.06em">▶ RUN</text>
      <Line a={runStart} b={runEnd} stroke={ACC} strokeWidth="1.4" />
      <Chevron at={runEnd} dir={flow} />

      {stations.map((s, i) => {
        const x0 = i * PITCH
        const top = p(x0 + 1.1, 1.1, s.topZ)
        const next = i < stations.length - 1
        const a = p(x0 + P + 0.1, 1.1, PH)
        const b = p(x0 + PITCH - 0.1, 1.1, PH)
        return (
          <g key={s.n}>
            <Box p={p} x={x0} y={0} w={P} d={P} h={PH} />
            {content[i](x0)}
            {next && (
              <g>
                <Line a={a} b={b} stroke={ACC} strokeWidth="1.4" />
                <Chevron at={[(a[0] + b[0]) / 2 + 4, (a[1] + b[1]) / 2 + 2]} dir={flow} />
              </g>
            )}
            <Leader from={[top[0], top[1] - 6]} to={[top[0], 74]} />
            <Label x={top[0]} y={40} color={ACC}>{s.n}</Label>
            <Label x={top[0]} y={53} color={INK}>{s.name}</Label>
            {s.sub && <Label x={top[0]} y={65} size={8}>{s.sub}</Label>}
          </g>
        )
      })}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 04 · Benchmarks — a reservoir block where some wells are held out; one held-out
// bore on the cut face is compared against a prediction band (per-well score), and a
// calibration plot checks the uncertainty. Two views, not one error number.
// ─────────────────────────────────────────────────────────────────────────────
export function BenchmarksIso() {
  const p = makeIso(124, 118, 26)
  const S = 3.4
  const H = 1.4
  const faceWell = [S, 1.5]
  const training = [[0.8, 0.7], [2.1, 0.6], [1.1, 1.6], [2.4, 1.6], [2.6, 2.6]]
  const heldTop = [1.3, 2.7]
  const pins = [...training.map(w => ({ w, held: false })), { w: heldTop, held: true }, { w: faceWell, held: true }]
    .sort((a, b) => a.w[0] + a.w[1] - (b.w[0] + b.w[1]))

  const heldHead = [p(...heldTop)[0], p(...heldTop)[1] - 13]
  const boreMid = p(faceWell[0], faceWell[1], -0.625) // between two observation marks

  // Profile card: temperature across, depth down; band widens with depth.
  const depthY = d => 98 + d * 140
  const tempX = t => 262 + t * 98
  const mean = d => 0.12 + 0.78 * (1 - (1 - d) ** 2)
  const halfW = d => 4 + 10 * d
  const ds = Array.from({ length: 13 }, (_, k) => k / 12)
  const band = [
    ...ds.map(d => [tempX(mean(d)) - halfW(d), depthY(d)]),
    ...ds.slice().reverse().map(d => [tempX(mean(d)) + halfW(d), depthY(d)]),
  ]
  const meanLine = ds.map(d => [tempX(mean(d)), depthY(d)])
  const observed = [[0.08, 2], [0.22, -7], [0.38, 4], [0.52, -2], [0.68, 5], [0.84, -4], [0.95, 3]]
    .map(([d, off]) => [tempX(mean(d)) + off, depthY(d)])

  // Calibration card: expected vs observed coverage, close to the diagonal.
  const calib = [[0.1, 0.12], [0.3, 0.27], [0.5, 0.51], [0.7, 0.68], [0.9, 0.91]]
    .map(([e, o]) => [412 + e * 80, 228 - o * 80])

  return (
    <svg viewBox="0 0 520 320" style={svgStyle} role="img"
      aria-label="Reservoir with held-out wells; a held-out well's observations compared to a prediction band, and a calibration plot">
      <Label x={24} y={30} anchor="start">HELD-OUT · CALIBRATED</Label>

      {/* reservoir block */}
      <Box p={p} x={0} y={0} z={-H} w={S} d={S} h={H} />
      <g stroke={FAINT} strokeWidth="1">
        {[-0.5, -0.95].map(z => (
          <g key={z}>
            <Line a={p(0, S, z)} b={p(S, S, z)} />
            <Line a={p(S, 0, z)} b={p(S, S, z)} />
          </g>
        ))}
      </g>
      <IsoCircle p={p} x={1.7} y={1.7} r={1.2} fill="none" stroke={ACC} strokeWidth="1" strokeOpacity="0.3" />
      <IsoCircle p={p} x={1.7} y={1.7} r={0.8} fill="none" stroke={ACC} strokeWidth="1" strokeOpacity="0.5" />
      <IsoCircle p={p} x={1.7} y={1.7} r={0.4} fill={ACC_TOP} stroke={ACC} strokeWidth="1" />

      {/* held-out bore exposed on the cut face, with observation points */}
      <Line a={p(faceWell[0], faceWell[1], 0)} b={p(faceWell[0], faceWell[1], -1.18)} stroke={ACC} strokeWidth="1.8" />
      {[-0.25, -0.5, -0.75, -1.0].map(z => {
        const [cx, cy] = p(faceWell[0], faceWell[1], z)
        return <circle key={z} cx={cx} cy={cy} r="2.2" fill="#fff" stroke={ACC} strokeWidth="1.2" />
      })}

      {pins.map(({ w, held }) => <Wellhead key={w.join()} at={p(...w)} held={held} />)}

      <Leader from={[heldHead[0], heldHead[1] - 6.5]} to={[heldHead[0], 78]} square={false} />
      <Label x={heldHead[0]} y={70} color={ACC}>HELD-OUT WELLS</Label>

      {/* legend */}
      <circle cx="30" cy="288" r="2.8" fill={INK} />
      <Label x={40} y={291} anchor="start" size={8}>TRAINING</Label>
      <circle cx="104" cy="288" r="5.5" fill="none" stroke={ACC} strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="104" cy="288" r="2.8" fill={ACC} />
      <Label x={115} y={291} anchor="start" size={8}>HELD OUT</Label>

      {/* per-well score: prediction band vs the held-out well's observations */}
      <Leader from={[boreMid[0] + 1, boreMid[1]]} to={[244, boreMid[1]]} square={false} />
      <rect x="244" y="56" width="140" height="232" rx="6" fill="#fff" stroke={INK} strokeWidth="1.2" />
      <Label x={256} y={76} anchor="start" size={8.5}>HELD-OUT WELL</Label>
      <g stroke={INK} strokeWidth="1">
        <line x1="258" y1="94" x2="370" y2="94" />
        <line x1="258" y1="94" x2="258" y2="242" />
      </g>
      <Label x={370} y={89} anchor="end" size={7.5}>TEMP →</Label>
      <text x="252" y="242" transform="rotate(-90 252 242)" textAnchor="start" fontFamily={MONO} fontSize="7" fill={MUTED} letterSpacing="0.04em">← DEPTH</text>
      <polygon points={pts(...band)} fill={ACC_TOP} />
      <polyline points={pts(...meanLine)} fill="none" stroke={ACC} strokeWidth="1.3" />
      {observed.map(([x, y]) => <circle key={y} cx={x} cy={y} r="2.3" fill={INK} />)}
      <rect x="256" y="254" width="12" height="7" fill={ACC_TOP} stroke={ACC} strokeWidth="0.8" />
      <Label x={274} y={261} anchor="start" size={7.5}>PREDICTED BAND</Label>
      <circle cx="262" cy="274" r="2.3" fill={INK} />
      <Label x={274} y={277} anchor="start" size={7.5}>OBSERVED</Label>

      {/* calibration: does the stated uncertainty match observed coverage? */}
      <rect x="396" y="118" width="112" height="140" rx="6" fill="#fff" stroke={INK} strokeWidth="1.2" />
      <Label x={406} y={137} anchor="start" size={8.5}>CALIBRATION</Label>
      <g stroke={INK} strokeWidth="1">
        <line x1="412" y1="148" x2="412" y2="228" />
        <line x1="412" y1="228" x2="492" y2="228" />
      </g>
      <line x1="412" y1="228" x2="492" y2="148" stroke={FAINT} strokeWidth="1" strokeDasharray="3 3" />
      <polyline points={pts(...calib)} fill="none" stroke={ACC} strokeWidth="1.1" />
      {calib.map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.6" fill={ACC} />)}
      <Label x={492} y={243} anchor="end" size={7}>EXPECTED</Label>
      <text x="406" y="150" transform="rotate(-90 406 150)" textAnchor="end" fontFamily={MONO} fontSize="7" fill={MUTED} letterSpacing="0.04em">OBSERVED</text>
    </svg>
  )
}
