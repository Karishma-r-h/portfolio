import JellyPop from './JellyPop'

export default function Hero3DSection() {
  return (
    <section className="relative pt-12 pb-0 px-8 md:px-16 bg-base">
      <h2 className="relative font-display text-ink text-3xl md:text-4xl text-center mb-2 transition-transform duration-300 hover:scale-105">
        Give it a tap
      </h2>
      <div className="relative h-[55vh] w-full">
        <JellyPop />
      </div>
    </section>
  )
}