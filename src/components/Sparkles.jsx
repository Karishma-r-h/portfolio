import { motion } from 'framer-motion'

const dots = [
  { color: 'bg-violet', size: 10, x: 0, y: 4 },
  { color: 'bg-pink', size: 6, x: 24, y: -10 },
  { color: 'bg-yellow', size: 8, x: 44, y: 8 },
]

export default function Sparkles({ className = "" }) {
  return (
    <span className={`relative inline-block ${className}`} style={{ width: 60, height: 30 }}>
      {dots.map((d, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          className={`absolute rounded-full ${d.color}`}
          style={{ width: d.size, height: d.size, left: d.x, top: d.y }}
        />
      ))}
    </span>
  )
}