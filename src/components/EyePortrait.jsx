import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import portrait from '../assets/portrait.png'

const EYES = [
  { x: 40.9, y: 40.8, size: 2.8 },
  { x: 57.7, y: 36.5, size: 2.7 },
]

function useTrackedOffset(containerRef) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 22 })
  const sy = useSpring(y, { stiffness: 220, damping: 22 })

  useEffect(() => {
    function handleMove(e) {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      const clampedX = Math.max(-1, Math.min(1, dx))
      const clampedY = Math.max(-1, Math.min(1, dy))
      x.set(clampedX * 4)
      y.set(clampedY * 3)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [containerRef, x, y])

  return { sx, sy }
}

export default function EyePortrait() {
  const containerRef = useRef(null)
  const { sx, sy } = useTrackedOffset(containerRef)

  return (
    <div ref={containerRef} className="relative w-full rounded-3xl overflow-hidden shadow-xl">
      <img
        src={portrait}
        alt="Illustrated portrait of Karishma"
        className="w-full h-auto block select-none pointer-events-none"
        draggable={false}
      />
      {EYES.map((eye, i) => (
        <motion.div
          key={i}
          style={{
            left: `${eye.x}%`,
            top: `${eye.y}%`,
            width: `${eye.size}%`,
            height: `${eye.size}%`,
            x: sx,
            y: sy,
          }}
          className="absolute rounded-full bg-[#1a0f08] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
        >
          <div className="w-1/3 h-1/3 rounded-full bg-white/90 -translate-x-0.5 -translate-y-0.5" />
        </motion.div>
      ))}
    </div>
  )
}