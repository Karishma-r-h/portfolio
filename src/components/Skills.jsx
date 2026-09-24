import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const categories = [
  { title: 'Backend', skills: ['Django', 'DRF', 'Flask'], color: '#4C6C9C' },
  { title: 'Generative AI', skills: ['RAG', 'LangChain', 'OpenAI API'], color: '#C97B86' },
  { title: 'Data', skills: ['PostgreSQL', 'pgvector', 'Kafka', 'Redis'], color: '#C9A227' },
  { title: 'Frontend', skills: ['React', 'JavaScript'], color: '#7C9473' },
  { title: 'DevOps', skills: ['Docker', 'Git'], color: '#4C9C93' },
  { title: 'Core CS', skills: ['DSA', 'OOP'], color: '#7C5C8A' },
]

const targets = [
  { x: 0, y: 0 },
  { x: 0, y: -90 },
  { x: 0, y: -180 },
  { x: 0, y: 90 },
  { x: 90, y: 0 },
  { x: -90, y: 0 },
]

const faceTransforms = [
  'translateZ(150px)',
  'rotateY(90deg) translateZ(150px)',
  'rotateY(180deg) translateZ(150px)',
  'rotateY(-90deg) translateZ(150px)',
  'rotateX(-90deg) translateZ(150px)',
  'rotateX(90deg) translateZ(150px)',
]

export default function Skills() {
  const [index, setIndex] = useState(0)
  const current = categories[index]

  return (
    <section id="skills" className="relative px-8 md:px-16 py-32 bg-surface overflow-hidden flex flex-col items-center">
      <h2 className="relative font-display font-semibold text-4xl md:text-5xl text-ink mb-4 transition-colors duration-300 hover:text-violet">
        Toolkit
      </h2>
      <p className="text-muted text-sm mb-16 font-mono">click the cube to rotate</p>

      <div style={{ perspective: 900 }} className="mb-12">
        <motion.div
          onClick={() => setIndex((i) => (i + 1) % categories.length)}
          animate={{ rotateX: targets[index].x, rotateY: targets[index].y }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 300, height: 300, transformStyle: 'preserve-3d' }}
          className="relative cursor-pointer"
        >
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              style={{
                position: 'absolute',
                inset: 0,
                transform: faceTransforms[i],
                backgroundColor: cat.color,
                backfaceVisibility: 'hidden',
              }}
              className="flex items-center justify-center rounded-2xl shadow-lg"
            >
              <span className="font-display font-bold text-white text-xl text-center px-4">
                {cat.title}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap gap-3 justify-center max-w-lg"
        >
          {current.skills.map((s) => (
            <span
              key={s}
              style={{ backgroundColor: current.color }}
              className="font-mono text-sm font-semibold text-white px-5 py-2.5 rounded-full shadow-md"
            >
              {s}
            </span>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
