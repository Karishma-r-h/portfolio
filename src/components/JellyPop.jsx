import { useRef, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

const palette = [
  "#ECE9DC", "#E4CAEF", "#B4DBD9", "#AEC5D8", "#E3CACC", "#FFFFFF",
]

const BOUND_X = 2.8
const BOUND_Y = 1.8

let nextId = 1

function makeBlob({ x = 0, y = 0, size = 1.3, vx = 0, vy = 0, poppable = false, color }) {
  return {
    id: nextId++,
    pos: { x, y },
    vel: { x: vx, y: vy },
    size,
    poppable,
    color: color ?? palette[Math.floor(Math.random() * palette.length)],
    squishY: 1,
    squishVel: 0,
  }
}

function BlobMesh({ data, onHit }) {
  const ref = useRef()

  useFrame((state, delta) => {
    data.pos.x += data.vel.x * delta
    data.pos.y += data.vel.y * delta
    data.vel.x *= 0.99
    data.vel.y *= 0.99

    const bx = BOUND_X - data.size * 0.5
    const by = BOUND_Y - data.size * 0.5
    let hit = false
    if (data.pos.x > bx) { data.pos.x = bx; data.vel.x *= -0.75; hit = true }
    if (data.pos.x < -bx) { data.pos.x = -bx; data.vel.x *= -0.75; hit = true }
    if (data.pos.y > by) { data.pos.y = by; data.vel.y *= -0.75; hit = true }
    if (data.pos.y < -by) { data.pos.y = -by; data.vel.y *= -0.75; hit = true }
    if (hit) data.squishVel -= 2

    const stiffness = 140
    const damping = 9
    const displacement = data.squishY - 1
    const force = -stiffness * displacement - damping * data.squishVel
    data.squishVel += force * delta
    data.squishY += data.squishVel * delta
    const squishXZ = 1 + (1 - data.squishY) * 0.5

    if (ref.current) {
      ref.current.position.set(data.pos.x, data.pos.y, 0)
      ref.current.scale.set(data.size * squishXZ, data.size * data.squishY, data.size * squishXZ)
    }
  })

  return (
    <mesh ref={ref} onClick={(e) => { e.stopPropagation(); onHit(data.id) }}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
  color={data.color}
  distort={0.25}
  speed={2}
  roughness={0.05}
  metalness={0}
  transmission={0.9}
  thickness={1.5}
  iridescence={1}
  iridescenceIOR={1.3}
  iridescenceThicknessRange={[100, 400]}
  transparent
  opacity={0.9}
/>
    </mesh>
  )
}

function Scene() {
  const [blobs, setBlobs] = useState(() => [makeBlob({ size: 1.3 })])

  const handleHit = useCallback((id) => {
    setBlobs((prev) => {
      const target = prev.find((b) => b.id === id)
      if (!target) return prev
      const rest = prev.filter((b) => b.id !== id)

      if (!target.poppable) {
        const children = Array.from({ length: 3 }).map((_, i) => {
          const angle = (i / 3) * Math.PI * 2 + Math.random()
          const speed = 1.5 + Math.random() * 1.5
          return makeBlob({
            x: target.pos.x,
            y: target.pos.y,
            size: target.size * 0.5,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            poppable: true,
          })
        })
        return [...rest, ...children]
      }

      if (rest.length === 0) {
        setTimeout(() => {
          setBlobs([makeBlob({ size: 1.3 })])
        }, 900)
      }
      return rest
    })
  }, [])

  return (
    <>
      {blobs.map((b) => (
        <BlobMesh key={b.id} data={b} onHit={handleHit} />
      ))}
    </>
  )
}

export default function JellyPop() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]} style={{ touchAction: 'none' }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={35} color="#ffffff" />
      <pointLight position={[-5, -3, 2]} intensity={15} color="#C77DFF" />
      <Scene />
      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.4} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}