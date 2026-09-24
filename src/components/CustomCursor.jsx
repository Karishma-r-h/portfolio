import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 400, damping: 35 })
  const sy = useSpring(y, { stiffness: 400, damping: 35 })

  useEffect(() => {
    function move(e) {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <motion.div
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      className="fixed top-0 left-0 z-[200] w-3 h-3 rounded-full bg-yellow pointer-events-none"
    />
  )
}