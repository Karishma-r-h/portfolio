import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, RoundedBox, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

const items = [
  { label: 'Django', color: '#4C6C9C' },
  { label: 'RAG + LLM', color: '#C97B86' },
  { label: 'Kafka', color: '#C9A227' },
  { label: 'PostgreSQL', color: '#7C9473' },
  { label: 'React', color: '#4C9C93' },
  { label: 'Docker', color: '#7C5C8A' },
]

function fibonacciPoint(i, n, radius) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
  const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  ]
}

function Chip({ position, label, color, groupRef }) {
  const labelRef = useRef()
  const normal = useMemo(() => new THREE.Vector3(...position).normalize(), [position])

  useFrame(() => {
    if (!groupRef.current || !labelRef.current) return
    const worldNormal = normal.clone().applyQuaternion(groupRef.current.quaternion)
    labelRef.current.style.opacity = worldNormal.z > 0.3 ? 1 : 0
  })

  return (
    <group position={position}>
      <RoundedBox args={[1.15, 0.55, 0.28]} radius={0.16} smoothness={4}>
        <meshPhysicalMaterial color={color} roughness={0.15} metalness={0.15} clearcoat={1} clearcoatRoughness={0.1} />
      </RoundedBox>
      <Html center distanceFactor={7}>
        <span
          ref={labelRef}
          className="font-mono text-xs font-semibold text-white whitespace-nowrap transition-opacity duration-150"
        >
          {label}
        </span>
      </Html>
    </group>
  )
}

function Core() {
  const ref = useRef()
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.15
    ref.current.rotation.x = state.clock.elapsedTime * 0.08
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 3]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={1}
        thickness={1.2}
        roughness={0.05}
        ior={1.4}
        iridescence={0.5}
        iridescenceIOR={1.3}
        clearcoat={1}
      />
    </mesh>
  )
}

function Scene() {
  const group = useRef()
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0.2 })

  function onPointerDown(e) {
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
    e.target.setPointerCapture(e.pointerId)
  }
  function onPointerMove(e) {
    if (!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    velocity.current = { x: dy * 0.005, y: dx * 0.005 }
    group.current.rotation.x += velocity.current.x
    group.current.rotation.y += velocity.current.y
    last.current = { x: e.clientX, y: e.clientY }
  }
  function onPointerUp() {
    dragging.current = false
  }

  useFrame((state, delta) => {
    if (!dragging.current) {
      velocity.current.x *= 0.95
      velocity.current.y += (0.2 - velocity.current.y) * 0.02
      group.current.rotation.x += velocity.current.x * delta
      group.current.rotation.y += velocity.current.y * delta
    }
  })

  return (
    <group
      ref={group}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
    >
      <Core />
      {items.map((it, i) => (
        <Chip key={it.label} position={fibonacciPoint(i, items.length, 2.3)} label={it.label} color={it.color} groupRef={group} />
      ))}
    </group>
  )
}

export default function Carousel3D() {
  return (
    <Canvas camera={{ position: [0, 0.5, 6.5], fov: 40 }} dpr={[1, 1.5]} style={{ touchAction: 'none' }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={30} color="#ffffff" />
      <Environment preset="city" />
      <Scene />
      <EffectComposer>
        <Bloom intensity={0.25} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}