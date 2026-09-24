import { motion } from 'framer-motion'
import TiltCard from './TiltCard'
import Cassette3D from './Cassette3D'

const projects = [
  {
    title: "A chatbot that actually replies",
    tag: "6",
    desc: "RAG-powered support chat with live handoff to a real human when it gets stuck.",
    link: "https://rag-my-chatbot.onrender.com/api/chat-ui/",
    linkLabel: "Try it",
  },
  {
    title: "A gadget that predicts its own future",
    tag: "3",
    desc: "IoT pressure sensors + a model that predicts trouble before it happens.",
    link: "",
    linkLabel: "",
  },
]

const card = "rounded-[2rem] bg-surface p-6 md:p-8 h-full flex flex-col"

export default function BentoGrid() {
  return (
    <section className="min-h-screen bg-base px-6 md:px-10 py-28">
      <div className="bento-grid max-w-6xl mx-auto">
        <TiltCard className={`area-headline ${card} justify-center`}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-sm text-muted mb-2"
          >
            Chennai, India — <span className="text-lg font-semibold text-ink">(open to work)</span>
          </motion.p>
          <h1 className="font-display font-extrabold text-ink text-4xl md:text-5xl leading-tight">
            Hi, I'm Karishma — I make <span className="font-script text-5xl md:text-6xl text-accent">fun</span> things with code.
          </h1>
        </TiltCard>

        <TiltCard className={`area-photo ${card} items-center justify-center text-center`}>
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center font-display font-bold text-3xl text-surface mb-3">
            KR
          </div>
          <p className="text-muted text-sm">
            Recovering biomedical engineer, current full-stack tinkerer.
          </p>
        </TiltCard>

        <TiltCard className={`area-projects ${card}`}>
          <h2 className="font-display font-bold text-ink text-2xl mb-6">Things I've built</h2>
          <div className="space-y-6 flex-1">
            {projects.map((p) => (
              <div key={p.title} className="relative">
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-surface text-xs font-mono flex items-center justify-center">
                  {p.tag}
                </span>
                <h3 className="font-display font-semibold text-ink text-lg">{p.title}</h3>
                <p className="text-muted text-sm mt-1">{p.desc}</p>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 font-mono text-xs text-accent border-b border-accent"
                  >
                    {p.linkLabel}
                  </a>
                )}
              </div>
            ))}
          </div>
        </TiltCard>

        <TiltCard className={`area-cassette ${card} items-center justify-center`}>
          <div className="w-full h-40">
            <Cassette3D />
          </div>
          <p className="font-script text-2xl text-accent mt-2">press play</p>
        </TiltCard>

        <TiltCard className={`area-badge ${card} items-center justify-center text-center`}>
          <p className="font-script text-2xl text-accent">currently</p>
          <p className="text-ink font-semibold">caffeinated & coding</p>
        </TiltCard>

        <TiltCard className={`area-contact ${card} bg-accent items-start justify-center`}>
          <h2 className="font-display font-bold text-surface text-3xl mb-3">Let's talk</h2>
          <a
            href="mailto:karishmarh28@gmail.com"
            className="font-mono text-sm text-surface border-b border-surface pb-0.5"
          >
            karishmarh28@gmail.com
          </a>
          <a href="tel:+917200393714" className="font-mono text-sm text-surface/80 mt-2">
            +91 72003 93714
          </a>
        </TiltCard>

        <TiltCard className={`area-socials ${card} items-center justify-center gap-2`}>
          <a href="https://github.com/Karishma-r-h" target="_blank" rel="noreferrer" className="font-mono text-xs text-ink">
            GitHub
          </a>
          <a href="https://linkedin.com/in/karishma-roshni-h" target="_blank" rel="noreferrer" className="font-mono text-xs text-ink">
            LinkedIn
          </a>
        </TiltCard>
      </div>
    </section>
  )
}