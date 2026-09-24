import { motion } from 'framer-motion'

const timeline = [
  { year: "Nov 2022", title: "Biomedical Engineering begins", text: "Training in tracing signals through complex systems and finding failure points — pressure thresholds, sensor telemetry, feedback loops." },
  { year: "Jan 2025", title: "AMS Solutions internship — the pivot", text: "Debugged hardware-software communication failures by tracing logic workflows through telemetry logs. Writing scripts to find a fault faster than by hand was the moment it clicked." },
  { year: "2025–2026", title: "Self-directed reskilling", text: "Python Fullstack, RAG and LangChain AI Agents, and AI Developer certifications — alongside finishing the degree, not instead of it." },
  { year: "2026", title: "Shipping real systems", text: "The RAG chatbot and IoT predictive control system are the direct output — live, deployed systems, not class projects." },
]

export default function About() {
  return (
    <section id="about" className="relative px-8 md:px-16 py-32 bg-surface overflow-hidden">
      <h2 className="relative font-display font-semibold text-4xl md:text-5xl text-ink mb-20">
        Why a biomedical engineer builds backend systems
      </h2>
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-ink/10" />
        <div className="space-y-16">
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="relative pl-14 group transition-transform duration-300 hover:translate-x-2"
            >
              <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-violet transition-transform duration-300 group-hover:scale-150" />
              <p className="font-mono text-sm text-violet mb-1">{item.year}</p>
              <h3 className="font-display font-semibold text-xl text-ink mb-2 transition-colors duration-300 group-hover:text-violet">{item.title}</h3>
              <p className="text-muted leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}