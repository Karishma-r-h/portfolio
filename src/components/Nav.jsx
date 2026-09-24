import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-6 right-6 z-50 w-14 h-14 rounded-full bg-ink flex flex-col items-center justify-center gap-1.5 transition-transform duration-300 hover:scale-110"
        aria-label="Toggle menu"
      >
        <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} className="block w-6 h-0.5 bg-base" />
        <motion.span animate={{ opacity: open ? 0 : 1 }} className="block w-6 h-0.5 bg-base" />
        <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} className="block w-6 h-0.5 bg-base" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-ink flex flex-col items-center justify-center gap-8"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="font-display text-5xl text-base hover:text-surface hover:translate-x-2 transition-all duration-300"
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}