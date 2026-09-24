import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TERRACOTTA = '#D97A3D'
const TRIM = '#7A2A1E'
const GOLD = '#E8B84B'

function EaveHorn({ x, z, flipX = 1, flipZ = 1 }) {
  return (
    <mesh
      position={[x, 0.12, z]}
      rotation={[0, Math.atan2(flipZ, flipX) + Math.PI / 4, Math.PI / 2.6]}
    >
      <coneGeometry args={[0.09, 0.42, 8]} />
      <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.15} />
    </mesh>
  )
}

function RoofTier({ width, depth, y, scale = 1 }) {
  const w = width / 2
  const d = depth / 2
  return (
    <group position={[0, y, 0]}>
      {/* main tile slab */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 0.22, depth]} />
        <meshStandardMaterial color={TERRACOTTA} roughness={0.55} metalness={0.05} />
      </mesh>
      {/* trim band underneath */}
      <mesh position={[0, -0.16, 0]}>
        <boxGeometry args={[width * 1.04, 0.08, depth * 1.04]} />
        <meshStandardMaterial color={TRIM} roughness={0.6} />
      </mesh>
      {/* ridge cap */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[width * 0.5, 0.08, depth * 0.5]} />
        <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* upturned corner horns */}
      <EaveHorn x={w} z={d} flipX={1} flipZ={1} />
      <EaveHorn x={-w} z={d} flipX={-1} flipZ={1} />
      <EaveHorn x={w} z={-d} flipX={1} flipZ={-1} />
      <EaveHorn x={-w} z={-d} flipX={-1} flipZ={-1} />
    </group>
  )
}

function Gopuram() {
  const group = useRef()
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.35
    }
  })

  return (
    <group ref={group}>
      <RoofTier width={3.2} depth={2.2} y={0.6} />
      <RoofTier width={2.3} depth={1.6} y={1.15} />
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.12, 0.3, 6]} />
        <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.3} />
      </mesh>
    </group>
  )
}

function CurtainText() {
  const phrase = 'TEMPLE BELLS · BRASS LAMPS · PRAYERS RISE · SOUTH INDIA · '
  const rows = Array.from({ length: 26 }, (_, i) => phrase.repeat(3).slice(i, i + 60))

  return (
    <div
      className="w-full flex justify-center overflow-hidden"
      style={{
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
        height: 260,
        marginTop: -20,
      }}
    >
      <div
        className="font-mono text-[6px] md:text-[7px] leading-[8px] text-center px-4"
        style={{ color: '#8a7d6c', wordBreak: 'break-all' }}
      >
        {rows.map((r, i) => (
          <div key={i}>{r}</div>
        ))}
      </div>
    </div>
  )
}

export default function GopuramShowcase() {
  return (
    <section className="relative px-8 md:px-16 py-32 bg-surface flex flex-col items-center overflow-hidden">
      <h2 className="font-display font-semibold text-4xl md:text-5xl text-red mb-16 text-center">
        Rooted in South India
      </h2>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden px-6 pt-6">
        <p className="font-mono text-xs md:text-sm text-ink leading-relaxed max-w-[200px] mb-4">
          South India —<br />
          gopuram towers,<br />
          temple bells,<br />
          prayers that rise
        </p>

        <div style={{ height: 260 }}>
          <Canvas camera={{ position: [3, 1.5, 4], fov: 40 }} shadows>
            <ambientLight intensity={0.6} color="#fff4e0" />
            <directionalLight position={[3, 5, 2]} intensity={1.2} color="#fff0d0" castShadow />
            <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#a0c0ff" />
            <Gopuram />
          </Canvas>
        </div>

        <CurtainText />
      </div>
    </section>
  )
}