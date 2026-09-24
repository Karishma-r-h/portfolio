import { motion } from 'framer-motion'

const CODE_CHARS = '01{}<>/=;#AI'.split('')

function makeColumn(seed) {
  return Array.from({ length: 14 }, (_, i) => CODE_CHARS[(seed + i * 7) % CODE_CHARS.length])
}

export default function CodeShowcase() {
  const columns = Array.from({ length: 16 }, (_, i) => i)

  return (
    <section className="relative px-8 md:px-16 py-32 bg-surface overflow-hidden flex flex-col items-center">
      <h2 className="font-display font-semibold text-4xl md:text-5xl text-red mb-16 text-center">
        Built with code, powered by AI
      </h2>

      <div className="relative w-full max-w-3xl h-[420px]" style={{ perspective: 1400 }}>
        <div className="absolute inset-0 flex justify-center gap-3 overflow-hidden opacity-40 pointer-events-none">
          {columns.map((col) => (
            <div key={col} className="flex flex-col items-center font-mono text-xs text-violet">
              {makeColumn(col).map((ch, i) => (
                <motion.span
                  key={i}
                  animate={{ y: ['-20px', '440px'], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 4 + (col % 5),
                    repeat: Infinity,
                    delay: (col * 0.3 + i * 0.15) % 4,
                    ease: 'linear',
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>
          ))}
        </div>

        <motion.div
          className="absolute left-1/2 top-1/2 w-[340px] md:w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-2xl bg-ink overflow-hidden z-10"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: [-8, 8, -8], rotateX: [4, -4, 4], y: [0, -14, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-1.5 px-4 py-3 bg-black/30">
            <span className="w-2.5 h-2.5 rounded-full bg-red" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <pre className="font-mono text-xs md:text-sm text-surface px-5 py-6 leading-relaxed">
{`const dev = {
  name: "Karishma",
  stack: ["React", "Node", "AI/RAG"],
  building: "full-stack + AI systems",
  status: "open to work 🚀"
}`}
          </pre>
        </motion.div>
      </div>
    </section>
  )
}