import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  const [open, setOpen] = useState(false)

  return (
    <section id="contact" className="relative px-8 md:px-16 py-32 bg-surface flex flex-col items-center overflow-hidden">
      <h2 className="relative font-display font-semibold text-4xl md:text-5xl text-ink mb-16 transition-transform duration-300 hover:scale-105">
        Let's build something
      </h2>

      <div className="relative w-full max-w-md" style={{ perspective: 1200 }}>
        <motion.div
          initial={false}
          animate={open ? { y: -230, opacity: 1, scale: 1 } : { y: 0, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.55, delay: open ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-3 top-3 bg-white border-2 rounded-md shadow-xl p-6 flex flex-col gap-3 z-0"
          style={{ borderColor: '#AFCBE3' }}
        >
          <a href="mailto:karishmarh28@gmail.com" className="font-mono text-base text-ink border-b border-violet w-fit transition-colors duration-300 hover:text-violet">
            karishmarh28@gmail.com
          </a>
          <a href="tel:+917200393714" className="font-mono text-sm text-muted transition-colors duration-300 hover:text-ink">
            +91 72003 93714
          </a>
          <a href="https://linkedin.com/in/karishma-roshni-h" target="_blank" rel="noreferrer" className="font-mono text-sm text-muted transition-colors duration-300 hover:text-ink">
            linkedin.com/in/karishma-roshni-h
          </a>
          <a href="https://github.com/Karishma-r-h" target="_blank" rel="noreferrer" className="font-mono text-sm text-muted transition-colors duration-300 hover:text-ink">
            github.com/Karishma-r-h
          </a>
        </motion.div>

        <div
          onClick={() => setOpen((o) => !o)}
          className="relative z-10 w-full bg-violet rounded-2xl shadow-xl cursor-pointer overflow-hidden"
          style={{ height: '260px' }}
        >
          <div
            className="absolute inset-0"
            style={{ clipPath: 'polygon(0% 100%, 100% 100%, 50% 50%)', backgroundColor: '#4C6C9C' }}
          />
          <div
            className="absolute inset-0"
            style={{ clipPath: 'polygon(0% 0%, 0% 100%, 50% 50%)', backgroundColor: 'rgba(0,0,0,0.14)' }}
          />
          <div
            className="absolute inset-0"
            style={{ clipPath: 'polygon(100% 0%, 100% 100%, 50% 50%)', backgroundColor: 'rgba(0,0,0,0.14)' }}
          />

          <motion.div
            style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d', height: '50%' }}
            animate={{ rotateX: open ? -170 : 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 left-0 w-full z-20"
          >
            <div
              style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)', backfaceVisibility: 'hidden', backgroundColor: 'rgba(0,0,0,0.28)' }}
              className="absolute inset-0 bg-violet"
            />
            <div
              style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)', backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
              className="absolute inset-0 bg-surface"
            />
          </motion.div>

          {/* Centered wrapper — badge is centered via flex, not top/left math */}
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ opacity: open ? 0 : 1, scale: open ? 0.5 : 1 }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: '#F3EEE2' }}
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md leading-none pointer-events-auto"
            >
              <span className="text-violet text-sm font-display font-bold leading-none">K</span>
            </motion.div>
          </div>

          <div className="absolute inset-0 flex items-end justify-center pb-6 z-10">
            <p className="font-mono text-surface text-sm">
              {open ? "there's more inside ↑" : "click to open"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}