import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const range = (v, a, b) => clamp01((v - a) / (b - a))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
// overshoots slightly past 1 and settles back: this is the "snap" into place
const easeOutBack = (t) => {
  const c1 = 1.25
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
const damp = THREE.MathUtils.damp
// smoothly turn toward an angle by the shortest way round (three.js has no built-in for this)
const dampAngle = (a, b, lambda, dt) => {
  const diff = Math.atan2(Math.sin(b - a), Math.cos(b - a))
  return a + diff * (1 - Math.exp(-lambda * dt))
}

/* ------------------------------------------------------------------ */
/*  Final crane geometry (body along +X, wings spread along ±Z)        */
/* ------------------------------------------------------------------ */
const F = [0.95, 0, 0]
const B = [-0.95, 0, 0]
const U = [0, 0.32, 0]
const D = [0, -0.38, 0]
const L = [0, 0, 0.48]
const R = [0, 0, -0.48]

const BODY = [
  [F, U, L], [F, R, U], [B, L, U], [B, U, R],
  [F, L, D], [F, D, R], [B, D, L], [B, R, D],
]

const NECK = (() => {
  const a0 = [0.75, 0.12, 0.15], b0 = [0.75, 0.12, -0.15]
  const a1 = [1.45, 1.0, 0.05], b1 = [1.45, 1.0, -0.05]
  const top = [1.58, 1.18, 0], tip = [2.0, 0.92, 0]
  return [[a0, b0, a1], [b0, b1, a1], [a1, top, tip], [b1, tip, top], [a1, tip, b1]]
})()

const TAIL = (() => {
  const a0 = [-0.75, 0.12, 0.15], b0 = [-0.75, 0.12, -0.15]
  const a1 = [-1.55, 0.85, 0.05], b1 = [-1.55, 0.85, -0.05]
  const tip = [-2.0, 1.02, 0]
  return [[a0, b0, a1], [b0, b1, a1], [a1, b1, tip]]
})()

function buildWing(dir) {
  const chord = [0.6, 0.2, -0.2, -0.6]
  return [0, 1, 2].map((i) => [
    [chord[i], 0, 0.05 * dir],
    [chord[i + 1], 0, 0.05 * dir],
    [0.55 - i * 0.55, 0.1 - i * 0.06, dir * (2.05 - i * 0.12)],
  ])
}
const WING_L = buildWing(1)
const WING_R = buildWing(-1)

/* How each part looks when it is still a flat sheet of paper */
const flatBody = (p) => [p[0] * 1.3, p[1] * 0.02, p[2] * 1.3]
const flatStrip = (p) => [p[0] * 1.5, p[1] * 0.05, p[2] * 3]
const flatWing = (p) => [p[0], p[1] * 0.1, p[2] * 0.4]

/* ------------------------------------------------------------------ */
/*  Piece: one sheet that floats, folds into shape and snaps into place */
/* ------------------------------------------------------------------ */
function Piece({ st, tris, flat, color, at, scatter, phase = 0 }) {
  const group = useRef()
  const lines = useRef()

  const data = useMemo(() => {
    const fin = tris.flat()
    const n = fin.length
    const c = [0, 0, 0]
    fin.forEach((p) => {
      c[0] += p[0] / n
      c[1] += p[1] / n
      c[2] += p[2] / n
    })
    const finalV = new Float32Array(n * 3)
    const flatV = new Float32Array(n * 3)
    fin.forEach((p, i) => {
      const q = flat(p)
      finalV.set([p[0] - c[0], p[1] - c[1], p[2] - c[2]], i * 3)
      flatV.set([q[0] - c[0], q[1] - c[1], q[2] - c[2]], i * 3)
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(flatV.slice(), 3))

    const edgeIdx = []
    for (let t = 0; t < tris.length; t++) {
      const o = t * 3
      edgeIdx.push(o, o + 1, o + 1, o + 2, o + 2, o)
    }
    const lgeo = new THREE.BufferGeometry()
    lgeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgeIdx.length * 3), 3))
    return { c, finalV, flatV, geo, lgeo, edgeIdx }
  }, [tris]) // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state) => {
    const s = st.current
    const t = state.clock.elapsedTime
    const local = range(s.fold, at[0], at[1])
    const e = easeInOut(local)

    // morph flat sheet -> folded shape
    const pos = data.geo.attributes.position.array
    for (let i = 0; i < pos.length; i++) {
      pos[i] = data.flatV[i] + (data.finalV[i] - data.flatV[i]) * e
    }
    data.geo.attributes.position.needsUpdate = true

    // crease lines follow the same vertices
    const lp = data.lgeo.attributes.position.array
    for (let j = 0; j < data.edgeIdx.length; j++) {
      const vi = data.edgeIdx[j] * 3
      lp[j * 3] = pos[vi]
      lp[j * 3 + 1] = pos[vi + 1]
      lp[j * 3 + 2] = pos[vi + 2]
    }
    data.lgeo.attributes.position.needsUpdate = true

    // crease glow: peaks while the piece is mid-fold, flashes when the crane completes
    const glow = Math.sin(Math.PI * local)
    lines.current.material.opacity = Math.min(1, 0.16 + 0.75 * glow + s.flash * 0.6)

    // float in, then snap to the final position (with a tiny overshoot)
    const m = easeOutBack(local)
    const free = 1 - m
    const calm = 1 - local
    const [sp, sr] = [scatter.pos, scatter.rot]
    group.current.position.set(
      data.c[0] + sp[0] * free + Math.sin(t * 0.8 + phase) * 0.18 * calm,
      data.c[1] + sp[1] * free + Math.cos(t * 0.6 + phase) * 0.2 * calm,
      data.c[2] + sp[2] * free
    )
    group.current.rotation.set(
      sr[0] * free + Math.sin(t * 0.5 + phase) * 0.5 * calm,
      sr[1] * free + Math.sin(t * 0.4 + phase * 2) * 0.8 * calm,
      sr[2] * free + Math.cos(t * 0.45 + phase) * 0.4 * calm
    )
  })

  return (
    <group ref={group}>
      <mesh geometry={data.geo} frustumCulled={false}>
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.28}
          transparent
          opacity={0.96}
          roughness={0.55}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
          iridescence={0.4}
          iridescenceIOR={1.3}
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>
      <lineSegments ref={lines} geometry={data.lgeo} frustumCulled={false}>
        <lineBasicMaterial color="#9B7FE8" transparent opacity={0.2} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

function Wing({ st, side, color, at, scatter, phase }) {
  const pivot = useRef()
  const dir = side === 'left' ? 1 : -1
  const flap = useRef(side === 'left' ? 0 : 0.15)

  useFrame((_, dt) => {
    const s = st.current
    const ew = easeInOut(range(s.fold, at[0], at[1]))
    // flap harder when flying away, and moderately while roaming
    const energy = Math.max(s.fly, s.roam * 0.6)
    flap.current += dt * (1.6 + energy * 10)
    const amp = 0.06 + energy * 0.7
    const angle = 0.08 + ew * (0.34 + energy * 0.25 + Math.sin(flap.current) * amp)
    pivot.current.rotation.x = -dir * angle
  })

  return (
    <group ref={pivot} position={[0, 0.28, dir * 0.06]}>
      <Piece
        st={st}
        tris={dir === 1 ? WING_L : WING_R}
        flat={flatWing}
        color={color}
        at={at}
        scatter={scatter}
        phase={phase}
      />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  The whole scene                                                    */
/* ------------------------------------------------------------------ */
function Crane({ st, ui }) {
  const root = useRef()
  const flyGroup = useRef()
  const sparkles = useRef()

  useEffect(() => {
    flyGroup.current.rotation.order = 'YXZ' // yaw, then bank around the body axis
  }, [])

  useFrame((state, dt) => {
    const s = st.current
    const t = state.clock.elapsedTime

    // fold progress = mouse travel, or scrolling toward the next section
    const target = Math.max(s.mouse, clamp01(s.scroll * 2))
    s.fold = damp(s.fold, target, 3.2, dt)
    if (target >= 1 && s.fold > 0.998) s.fold = 1

    // the moment it is complete: one soft flash of the creases
    if (!s.done && s.fold >= 1) {
      s.done = true
      s.flash = 1
    }
    if (s.fold < 0.9) s.done = false
    s.flash = damp(s.flash, 0, 3, dt)

    // reaching the next section: it flies away
    s.fly = damp(s.fly, clamp01((s.scroll - 0.5) * 2), 2.5, dt)
    const ef = easeInOut(s.fly)

    // once built: take off and glide around the scene
    const roamTarget = s.done && !s.calm && s.scroll < 0.5 ? 1 : 0
    s.roam = damp(s.roam, roamTarget, 1.2, dt)
    const r = easeInOut(s.roam)

    // figure-8 path, sized to the visible area
    const ax = Math.min(3.4, state.viewport.width * 0.3)
    const w = 0.55
    const px = Math.sin(t * w) * ax
    const py = Math.sin(t * w * 2) * 0.9 + Math.sin(t * 1.3) * 0.12
    const pz = Math.cos(t * w) * 1.6
    // velocity -> heading + banking
    const vx = Math.cos(t * w) * ax * w
    const vz = -Math.sin(t * w) * 1.6 * w
    const heading = Math.atan2(-vz, vx)
    s.yaw = dampAngle(s.yaw, s.roam > 0.05 ? heading : 0, 3, dt)
    const bank = -Math.cos(t * w) * 0.35 * r // lean into the turns
    const pitch = Math.cos(t * w * 2) * 0.12 * r

    root.current.position.y = Math.sin(t * 0.7) * 0.08 * (1 - r)
    root.current.rotation.y = (-0.65 + Math.sin(t * 0.35) * 0.25) * (1 - r)

    flyGroup.current.position.set(
      px * r * (1 - ef) + ef * 8,
      py * r * (1 - ef) + ef * 3.2 + Math.sin(t * 4) * 0.05 * ef,
      pz * r * (1 - ef) - ef * 2
    )
    flyGroup.current.rotation.set(0, s.yaw, ef * 0.45 + pitch)
    flyGroup.current.rotation.x = bank
    flyGroup.current.scale.setScalar(1 - 0.5 * ef)

    sparkles.current.scale.setScalar(0.6 + 0.4 * s.fold + s.flash * 0.6 + r * 0.25)

    // caption + progress + shadow (plain DOM, no React re-renders)
    const stage = s.fold < 0.12 ? 0 : s.fold < 0.97 ? 1 : 2
    ui.stages.forEach((el, i) => el && (el.style.opacity = i === stage ? 1 : 0.35))
    if (ui.bar.current) ui.bar.current.style.transform = `scaleX(${s.fold})`
    if (ui.hint.current) ui.hint.current.style.opacity = s.fold < 0.05 ? 1 : 0
    if (ui.shadow.current) {
      const v = (0.15 + 0.85 * s.fold) * (1 - ef) * (1 - 0.85 * r)
      ui.shadow.current.style.opacity = String(v)
      ui.shadow.current.style.transform = `translateX(-50%) scale(${0.6 + 0.4 * s.fold})`
    }
  })

  return (
    <group ref={flyGroup}>
      <group ref={root}>
        <group position={[0, -0.35, 0]}>
          <Piece
            st={st} tris={BODY} flat={flatBody} color="#E6D6F7" at={[0.0, 0.4]} phase={0}
            scatter={{ pos: [0, 0.3, 0.6], rot: [1.0, 0.5, 0.2] }}
          />
          <Piece
            st={st} tris={NECK} flat={flatStrip} color="#FBDDCB" at={[0.3, 0.6]} phase={1.7}
            scatter={{ pos: [1.8, 1.3, -1.2], rot: [1.2, 0.8, -0.6] }}
          />
          <Piece
            st={st} tris={TAIL} flat={flatStrip} color="#EBD3F1" at={[0.4, 0.7]} phase={3.1}
            scatter={{ pos: [-2.2, -1.2, 0.8], rot: [-0.9, 1.1, 0.7] }}
          />
          <Wing
            st={st} side="left" color="#BFEBD8" at={[0.5, 0.85]} phase={4.2}
            scatter={{ pos: [1.2, 1.6, 1.8], rot: [0.8, -0.7, 1.0] }}
          />
          <Wing
            st={st} side="right" color="#CBDCF7" at={[0.58, 0.95]} phase={5.4}
            scatter={{ pos: [-1.6, -0.4, -2.2], rot: [-1.1, 0.6, -0.8] }}
          />
        </group>
        <group ref={sparkles}>
          {/* deeper colours so they read on the pastel gradient */}
          <Sparkles count={45} scale={[6, 3, 4]} size={7} speed={0.6} opacity={1} color="#7C5CE0" />
          <Sparkles count={30} scale={[5, 2.6, 3.5]} size={5} speed={0.9} opacity={1} color="#F59E6B" />
          <Sparkles count={20} scale={[4, 2, 3]} size={4} speed={0.5} opacity={0.9} color="#FFFFFF" />
        </group>
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Section wrapper: place this above "Selected Works"                 */
/*  Give your Selected Works section  id="selected-works"              */
/* ------------------------------------------------------------------ */
export default function OrigamiCrane({ targetId = 'selected-works' }) {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const st = useRef({
    fold: reduced ? 1 : 0.02,
    mouse: reduced ? 1 : 0.02,
    scroll: 0,
    fly: 0,
    roam: 0, // 0 -> 1 once the crane is built and flying around
    yaw: 0, // smoothed heading
    calm: reduced, // skip roaming for reduced-motion users
    flash: 0,
    done: false,
  })
  const stages = useRef([])
  const bar = useRef()
  const hint = useRef()
  const shadow = useRef()
  const ui = useMemo(() => ({ stages: stages.current, bar, hint, shadow }), [])

  useEffect(() => {
    let last = null
    const onMove = (e) => {
      if (last) {
        const d = Math.hypot(e.clientX - last.x, e.clientY - last.y)
        // roughly three screen-widths of mouse travel folds the whole crane
        st.current.mouse = Math.min(1, st.current.mouse + d / (window.innerWidth * 3.2))
      }
      last = { x: e.clientX, y: e.clientY }
    }
    const onScroll = () => {
      const el = document.getElementById(targetId)
      if (!el) return
      const vh = window.innerHeight
      const top = el.getBoundingClientRect().top
      st.current.scroll = clamp01((vh - top) / (vh * 0.7))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [targetId])

  const labels = ['Idea', 'Process', 'Product']

  return (
    <div
      className="relative w-full h-full min-h-[380px] rounded-3xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #DFF5EA 0%, #FBE7D8 50%, #E9DDF7 100%)' }}
    >
      <div
        ref={shadow}
        className="absolute bottom-24 left-1/2 h-8 w-56 rounded-full"
        style={{
          opacity: 0.15,
          transform: 'translateX(-50%) scale(0.6)',
          background: 'radial-gradient(ellipse, rgba(90,70,140,0.16), transparent 70%)',
        }}
      />

      <Canvas camera={{ position: [0, 0.4, 9.5], fov: 34 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} color="#ffffff" />
        <pointLight position={[-4, 2, -2]} intensity={14} color="#C9B8E8" />
        <pointLight position={[0, -2, 3]} intensity={8} color="#FBE0D0" />
        <Crane st={st} ui={{ ...ui, stages: stages.current }} />
      </Canvas>

      {/* Idea -> Process -> Product: the story, told by the crane itself */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-56 text-center pointer-events-none select-none">
        <div className="flex justify-between text-[13px] font-medium" style={{ color: '#5B4B8A' }}>
          {labels.map((l, i) => (
            <span
              key={l}
              ref={(el) => (stages.current[i] = el)}
              style={{ opacity: i === 0 ? 1 : 0.35, transition: 'opacity 0.4s ease' }}
            >
              {l}
            </span>
          ))}
        </div>
        <div className="mt-2 h-[2px] rounded-full" style={{ background: 'rgba(91,75,138,0.15)' }}>
          <div
            ref={bar}
            className="h-full rounded-full origin-left"
            style={{ background: '#9B7FE8', transform: 'scaleX(0.02)' }}
          />
        </div>
        <p
          ref={hint}
          className="mt-3 text-xs"
          style={{ color: '#5B4B8A', opacity: 1, transition: 'opacity 0.5s ease' }}
        >
          Move your mouse to start folding
        </p>
      </div>
    </div>
  )
}