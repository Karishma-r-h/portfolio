import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

export default function TiltCard({ children, className = "" }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-100, 100], [6, -6]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-100, 100], [-6, 6]), { stiffness: 150, damping: 20 })
  const lift = useSpring(0, { stiffness: 150, damping: 20 })

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }
  function handleEnter() {
    lift.set(-6)
  }
  function handleLeave() {
    x.set(0)
    y.set(0)
    lift.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, y: lift, transformPerspective: 800 }}
      className={`transition-shadow duration-300 hover:shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  )
}
