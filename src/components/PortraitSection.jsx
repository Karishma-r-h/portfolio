import EyePortrait from './EyePortrait'

export default function PortraitSection() {
  return (
    <section className="relative px-8 md:px-16 py-32 bg-base flex justify-center">
      <div style={{ maxWidth: '960px', width: '100%' }}>
        <EyePortrait />
      </div>
    </section>
  )
}