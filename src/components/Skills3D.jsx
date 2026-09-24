import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

const skills = [
  "LangChain", "RAG Systems", "Vector Search", "Django", "DRF",
  "Kafka", "Redis", "PostgreSQL", "pgvector", "Docker", "Flask", "OpenAI API",
]

const textColors = ["text-ink", "text-muted"]
const borderColors = ["border-violet/50", "border-pink/50", "border-teal/50", "border-yellow/50"]

function OrbitLabel({ skill, index, total }) {
  const ref = useRef()
  const radius = 3.2
  const speed = 0.15
  const offset = (index / total) * Math.PI * 2

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
    ref.current.position.y = Math.sin(t * 1.3 + index) * 0.6
  })

  return (
    <group ref={ref}>
      <Html center distanceFactor={8}>
        <span
          className={`font-mono text-sm whitespace-nowrap px-3 py-1 rounded-full bg-base/90 border ${borderColors[index % borderColors.length]} ${textColors[index % textColors.length]}`}
        >
          {skill}
        </span>
      </Html>
    </group>
  )
}

function Core() {
  const ref = useRef()
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.3
    ref.current.rotation.x = state.clock.elapsedTime * 0.15
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.6, 1]} />
      <meshStandardMaterial color="#690202" emissive="#690202" emissiveIntensity={1} wireframe />
    </mesh>
  )
}

export default function Skills3D() {
  return (
    <Canvas camera={{ position: [0, 2, 7], fov: 50 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={30} color="#690202" />
      <Core />
      {skills.map((s, i) => (
        <OrbitLabel key={s} skill={s} index={i} total={skills.length} />
      ))}
    </Canvas>
  )
}