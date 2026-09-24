import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* ---------- Magnetic button (original) ---------- */
function MagneticButton({ href, children }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35)
  }
  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="pointer-events-auto mt-10 inline-block w-fit font-mono text-sm rounded-xl border border-violet text-ink px-6 py-3 hover:bg-violet hover:text-surface hover:scale-105 transition-all duration-300"
    >
      {children}
    </motion.a>
  )
}

/* ---------- Particles that drift inside the orb ---------- */
function OrbParticles({ hovered, violetRef, tealRef }) {
  const canvasRef = useRef(null)
  const hoverRef = useRef(false)
  hoverRef.current = hovered

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = canvas.parentElement.clientWidth
    canvas.width = canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    // Read the site's own colours so the orb always matches the palette
    const colors = [
      getComputedStyle(violetRef.current).color,
      getComputedStyle(tealRef.current).color,
    ]
    const R = size / 2
    const parts = Array.from({ length: 55 }, (_, i) => ({
      a: Math.random() * Math.PI * 2,
      r: Math.sqrt(Math.random()) * R * 0.85,
      s: 0.15 + Math.random() * 0.35,
      z: 1 + Math.random() * 2.2,
      ph: Math.random() * 6.28,
      c: colors[i % 2],
    }))

    let raf, t = 0
    function frame() {
      t += hoverRef.current ? 0.02 : 0.008
      ctx.clearRect(0, 0, size, size)
      for (const p of parts) {
        const ang = p.a + t * p.s
        const rad = p.r + Math.sin(t * 2 + p.ph) * 6
        const px = R + Math.cos(ang) * rad
        const py = R + Math.sin(ang) * rad * 0.92
        ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t * 3 + p.ph)
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(px, py, p.z, 0, 6.28)
        ctx.fill()
      }
      if (!reduce) raf = requestAnimationFrame(frame)
    }
    frame()
    return () => cancelAnimationFrame(raf)
  }, [violetRef, tealRef])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

/* ---------- The glass orb ---------- */
const tags = ['AI Agents', 'Django', 'Kafka', 'PostgreSQL', 'RAG', 'Python', 'Redis']
const coreSkills = ['RAG pipelines', 'Vector search', 'LangChain', 'Event-driven systems']
const RING = 60 // tag ring radius, % of orb width

function tagPos(i) {
  const a = (-90 + (i * 360) / tags.length) * (Math.PI / 180)
  return { left: `${50 + RING * Math.cos(a)}%`, top: `${50 + RING * Math.sin(a)}%` }
}

function GlassOrb() {
  const [hovered, setHovered] = useState(false)
  const violetRef = useRef(null)
  const tealRef = useRef(null)

  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 })
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 })

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 22)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 22)
  }
  function onLeave() {
    setHovered(false)
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2 }}
      className="relative w-[210px] sm:w-[320px] lg:w-[440px] aspect-square mx-auto"
      style={{ perspective: 1000 }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* hidden probes so canvas can read the theme colours */}
      <span ref={violetRef} className="text-violet absolute opacity-0 pointer-events-none" aria-hidden />
      <span ref={tealRef} className="text-teal absolute opacity-0 pointer-events-none" aria-hidden />

      {/* soft glow + ground shadow */}
      <div
        className={`absolute inset-[-6%] rounded-full bg-violet/20 blur-3xl transition-opacity duration-500 ${
          hovered ? 'opacity-100' : 'opacity-50'
        }`}
      />
      <div className="absolute -bottom-[12%] left-1/2 -translate-x-1/2 w-[62%] h-[7%] rounded-full bg-ink/20 blur-2xl" />

      {/* orbit rings the tags sit on */}
      <div
        className="absolute rounded-full border border-ink/10"
        style={{ inset: `${50 - RING}%` }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full border border-dashed border-ink/10"
        style={{ inset: `${50 - RING - 7}%` }}
      />

      <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative w-full h-full">
        {/* sphere body */}
        <div className="absolute inset-0 rounded-full overflow-hidden bg-white/10 backdrop-blur-md shadow-[0_30px_70px_-25px_rgba(40,30,70,0.35),inset_0_0_0_1px_rgba(255,255,255,0.65),inset_0_-30px_60px_rgba(255,255,255,0.25)]">
          <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-violet/30 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full bg-teal/30 blur-3xl" />
          <OrbParticles hovered={hovered} violetRef={violetRef} tealRef={tealRef} />
          {/* rim light + reflections */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_115%,rgba(255,255,255,0.55),transparent_55%)]" />
          <div className="absolute top-[9%] left-[17%] w-[30%] h-[15%] rounded-full bg-white/60 blur-[6px] rotate-[-30deg]" />
          <div className="absolute bottom-[11%] right-[18%] w-[16%] h-[6%] rounded-full bg-white/35 blur-[4px] rotate-[-30deg]" />

          {/* centre: core skills appear on hover */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-10">
            <ul
              className={`space-y-2 transition-all duration-500 ${
                hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {coreSkills.map((s) => (
                <li key={s} className="font-mono text-sm sm:text-base text-ink">{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* skill tags pinned evenly on the ring */}
      {tags.map((label, i) => (
        <div
          key={label}
          style={tagPos(i)}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            className={`flex items-center gap-2 whitespace-nowrap font-mono text-xs sm:text-sm text-ink rounded-full border border-white/80 bg-white/70 backdrop-blur-md px-3.5 py-1.5 shadow-[0_6px_18px_rgba(40,30,70,0.10)] transition-all duration-500 ${
              hovered ? 'opacity-100 scale-105' : 'opacity-90'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${i % 2 ? 'bg-teal' : 'bg-violet'}`} />
            {label}
          </motion.span>
        </div>
      ))}
    </motion.div>
  )
}

/* ---------- Hero ---------- */
export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[500px] h-[500px] rounded-full bg-violet/10 blur-[110px]" />
        <div className="absolute top-1/3 -right-24 w-[450px] h-[450px] rounded-full bg-teal/10 blur-[110px]" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center px-8 py-32">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          className="font-mono text-ink text-sm mb-4 tracking-wide"
        >
          Chennai, India — <span className="text-lg font-semibold text-red">(open to work)</span>
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-ink leading-[0.98] tracking-tight text-6xl md:text-8xl max-w-4xl"
        >
          Karishma Roshni H
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-muted text-lg md:text-xl max-w-2xl transition-colors duration-300 hover:text-ink"
        >
          Backend & Generative AI engineer building RAG pipelines, vector
          search, and event-driven systems with Django, Kafka, and Redis.
          I started in biomedical engineering, learning to trace signals
          through complex systems — and found that same instinct pulls me
          toward software today. Now I'm rounding out into a full-stack
          engineer, picking up frontend and shipping real, deployed systems
          along the way. Currently looking for my next role.
        </motion.p>
        <MagneticButton href="#projects">See what I've built</MagneticButton>

        {/* orb, placed below the about text */}
        <div className="mt-28 mb-8 w-full">
          <GlassOrb />
        </div>
      </div>
    </section>
  )
}