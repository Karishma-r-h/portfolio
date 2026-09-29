import { useState } from 'react'
import Intro from './components/Intro'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Hero3DSection from './components/Hero3DSection'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import CraneSection from './components/CraneSection'

export default function App() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <>
      {!introDone && <Intro onFinish={() => setIntroDone(true)} />}
      <main className="bg-base">
        <Nav />
        <Hero />
        <About />
        <Hero3DSection />
        <CraneSection />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  )
}