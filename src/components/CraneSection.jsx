import OrigamiCrane from './OrigamiCrane'

export default function CraneSection() {
  return (
    <section className="relative px-8 md:px-16 py-24 bg-base">
      <h2 className="relative font-display text-ink text-3xl md:text-4xl text-center mb-8">
        Hover to make it fly
      </h2>
      <div className="relative h-[60vh] w-full max-w-3xl mx-auto">
        <OrigamiCrane />
      </div>
    </section>
  )
}