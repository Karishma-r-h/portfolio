import { motion } from 'framer-motion'

const accentClasses = {
  pink: { text: "text-violet", tagText: "text-violet", tagBg: "bg-pink/20", tagBorder: "border-violet/20" },
  teal: { text: "text-teal", tagText: "text-teal", tagBg: "bg-teal/10", tagBorder: "border-teal/20" },
}

const projects = [
  {
    title: "Enterprise RAG AI Chatbot",
    subtitle: "with live human handoff",
    description: "Event-driven support platform using Django, pgvector, and OpenAI APIs — recursive document chunking, semantic vector retrieval, and WebSocket token streaming. An async Kafka pub/sub pipeline runs sentiment analysis, Redis session caching, and Slack webhook escalation for human-in-the-loop handoff.",
    stack: ["Django", "pgvector", "Kafka", "Redis", "WebSockets", "OpenAI API"],
    link: "https://rag-my-chatbot.onrender.com/api/chat-ui/",
    linkLabel: "Try the live chatbot",
    accent: "pink",
  },
  {
    title: "IoT-Integrated Predictive Control",
    subtitle: "Real-time ML on embedded hardware",
    description: "A Gradient Boosting model (R-squared 0.98) predicts dynamic pressure thresholds, served via a Flask REST API. An ESP32 with pressure sensors and solenoid valves closes the loop for real-time hardware control and telemetry validation.",
    stack: ["Flask", "scikit-learn", "ESP32", "REST API"],
    link: "",
    linkLabel: "",
    accent: "teal",
  },
];

const Anchor = "a";

function ProjectCard({ p, index }) {
  const c = accentClasses[p.accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.3, delay: index * 0.1 }}
      className="rounded-[2rem] bg-surface border border-ink/5 shadow-xl p-8 md:p-10 grid md:grid-cols-12 gap-6 group transition-all duration-300 hover:scale-[1.02] hover:border-violet hover:shadow-2xl"
    >
      <div className="md:col-span-5">
        <h3 className="font-display font-semibold text-2xl md:text-3xl text-ink transition-colors duration-300 group-hover:text-violet">{p.title}</h3>
        <p className={`font-mono text-sm ${c.text} mt-1`}>{p.subtitle}</p>
      </div>
      <div className="md:col-span-7">
        <p className="text-muted leading-relaxed">{p.description}</p>
        <div className="flex flex-wrap gap-2 mt-5">
          {p.stack.map((s) => (
            <span key={s} className={`font-mono text-xs ${c.tagText} ${c.tagBg} border ${c.tagBorder} rounded-full px-3 py-1`}>
              {s}
            </span>
          ))}
        </div>
        {p.link ? (
          <Anchor href={p.link} target="_blank" rel="noreferrer" className={`inline-block mt-6 font-mono text-sm text-ink border-b ${c.tagBorder.replace('/20', '')} pb-0.5`}>
            {p.linkLabel}
          </Anchor>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative px-8 md:px-16 pt-8 pb-32 bg-base overflow-hidden">
      <h2 className="relative font-display font-semibold text-4xl md:text-5xl text-ink mb-20">
        Selected work
      </h2>
      <div className="relative space-y-16 max-w-4xl mx-auto">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}