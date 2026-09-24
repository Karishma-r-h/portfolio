import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Intro({ onFinish }) {
  const [phase, setPhase] = useState('name')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('exit'), 2000)
    const t2 = setTimeout(() => onFinish(), 2800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onFinish])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{ pointerEvents: phase === 'exit' ? 'none' : 'auto' }}
      className="fixed inset-0 z-[100] bg-ink flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: phase === 'exit' ? '-120vh' : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="font-display font-semibold text-base text-6xl md:text-9xl text-center px-6 leading-none"
      >
        Karishma Roshni H
      </motion.h1>
    </motion.div>
  )
}