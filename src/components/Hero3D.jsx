import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

const palette = [
  "#FF6FB5", "#FF5C8A", "#C77DFF", "#B18CFF",
  "#5AC8FA", "#4DD9C0", "#6EE7B7", "#FFE066",
]

const BOUND_X = 2.6
const BOUND_Y = 1.6
const PARTICLE_COUNT = 18

function Confetti({ poolRef }) {
  const refs = useRef([])
  useFrame((state, delta) => {
    poolRef.current.forEach((p, i) => {
      if (p.life <= 0) {
        if (refs.current[i]) refs.current[i].visible = false
        return
      }
      p.pos[0] += p.vel[0] * delta
      p.pos[1] += p.vel[1] * delta
      p.vel[0] *= 0.96
      p.vel[1] *= 0.96
      p.life -= delta * 1.1
      const m = refs.current[i]
      if (m) {
        m.visible = true
        m.position.set(p.pos[0], p.pos[1], p.pos[2])
        const s = Math.max(p.life, 0) * 0.12
        m.scale.set(s, s, s)
        m.material.opacity = Math.max(p.life, 0)
      }
    })
  })
  return (
    <>
      {poolRef.current.map((p, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} visible={false}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={0} />
        </mesh>
      ))}
    </>
  )
}

function Blob() {
  const group = useRef()
  const bodyRef = useRef()
  const leftPupil = useRef()
  const rightPupil = useRef()
  const leftLid = useRef()
  const rightLid = useRef()
  const mouthRef = useRef()

  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const moved = useRef(0)
  const dragVel = useRef({ x: 0, y: 0 })

  const pos = useRef({ x: 0, y: 0 })
  const vel = useRef({ x: 0.6, y: 0.3 })

  const squishY = useRef(1)
  const squishVel = useRef(0)

  const blinkTimer = useRef(2 + Math.random() * 3)
  const blinkPhase = useRef(0)

  const surprisedUntil = useRef(0)

  const [colorIndex, setColorIndex] = useState(0)
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      life: 0,
      pos: [0, 0, 0],
      vel: [0, 0, 0],
      color: palette[0],
    }))
  )

  function burst() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.5
      const speed = 1.5 + Math.random() * 2
      particles.current[i].life = 1
      particles.current[i].pos = [0, 0, 0]
      particles.current[i].vel = [Math.cos(angle) * speed, Math.sin(angle) * speed, 0]
      particles.current[i].color = palette[Math.floor(Math.random() * palette.length)]
    }
  }

  function bounceReaction() {
    squishVel.current = -3
    setColorIndex((c) => (c + 1) % palette.length)
  }

  function onPointerDown(e) {
    dragging.current = true
    moved.current = 0
    last.current = { x: e.clientX, y: e.clientY }
    e.target.setPointerCapture(e.pointerId)
  }
  function onPointerMove(e) {
    if (!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    moved.current += Math.abs(dx) + Math.abs(dy)
    dragVel.current = { x: dx * 0.012, y: -dy * 0.012 }
    pos.current.x += dx * 0.012
    pos.current.y -= dy * 0.012
    last.current = { x: e.clientX, y: e.clientY }
  }
  function onPointerUp() {
    if (dragging.current) {
      if (moved.current < 6) {
        squishVel.current = -2.4
        setColorIndex((c) => (c + 1) % palette.length)
        surprisedUntil.current = performance.now() + 400
        burst()
      } else {
        vel.current.x = dragVel.current.x * 18
        vel.current.y = dragVel.current.y * 18
      }
    }
    dragging.current = false
  }

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    if (!dragging.current) {
      vel.current.x += Math.sin(t * 0.5) * 0.03 * delta
      vel.current.y += Math.cos(t * 0.4) * 0.03 * delta
      pos.current.x += vel.current.x * delta
      pos.current.y += vel.current.y * delta
      vel.current.x *= 0.996
      vel.current.y *= 0.996

      if (pos.current.x > BOUND_X) {
        pos.current.x = BOUND_X
        vel.current.x = -Math.abs(vel.current.x) * 0.75
        bounceReaction()
      } else if (pos.current.x < -BOUND_X) {
        pos.current.x = -BOUND_X
        vel.current.x = Math.abs(vel.current.x) * 0.75
        bounceReaction()
      }
      if (pos.current.y > BOUND_Y) {
        pos.current.y = BOUND_Y
        vel.current.y = -Math.abs(vel.current.y) * 0.75
        bounceReaction()
      } else if (pos.current.y < -BOUND_Y) {
        pos.current.y = -BOUND_Y
        vel.current.y = Math.abs(vel.current.y) * 0.75
        bounceReaction()
      }
    }

    group.current.position.x = pos.current.x
    group.current.position.y = pos.current.y
    group.current.rotation.z = -vel.current.x * 0.15
    group.current.rotation.x = vel.current.y * 0.15

    const stiffness = 140
    const damping = 9
    const displacement = squishY.current - 1
    const force = -stiffness * displacement - damping * squishVel.current
    squishVel.current += force * delta
    squishY.current += squishVel.current * delta
    const squishXZ = 1 + (1 - squishY.current) * 0.5
    if (bodyRef.current) bodyRef.current.scale.set(squishXZ, squishY.current, squishXZ)

    const px = state.pointer.x * 0.1
    const py = state.pointer.y * 0.1
    if (leftPupil.current) leftPupil.current.position.set(-0.32 + px, 0.18 + py, 1.02)
    if (rightPupil.current) rightPupil.current.position.set(0.32 + px, 0.18 + py, 1.02)

    blinkTimer.current -= delta
    if (blinkTimer.current <= 0 && blinkPhase.current === 0) {
      blinkPhase.current = 0.001
    }
    if (blinkPhase.current > 0) {
      blinkPhase.current += delta
      const s = Math.abs(Math.sin(blinkPhase.current * 14))
      if (leftLid.current) leftLid.current.scale.y = 1 - s
      if (rightLid.current) rightLid.current.scale.y = 1 - s
      if (blinkPhase.current > 0.22) {
        blinkPhase.current = 0
        blinkTimer.current = 2 + Math.random() * 3
        if (leftLid.current) leftLid.current.scale.y = 1
        if (rightLid.current) rightLid.current.scale.y = 1
      }
    }

    const surprised = performance.now() < surprisedUntil.current
    if (mouthRef.current) {
      const target = surprised ? 1.4 : 1
      mouthRef.current.scale.setScalar(mouthRef.current.scale.x + (target - mouthRef.current.scale.x) * 0.3)
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
      <mesh ref={bodyRef}>
        <sphereGeometry args={[1.5, 128, 128]} />
        <MeshDistortMaterial color={palette[colorIndex]} distort={0.25} speed={2} roughness={0.1} metalness={0.05} />
      </mesh>

      <mesh position={[-0.32, 0.18, 1]} ref={leftLid}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.32, 0.18, 1]} ref={rightLid}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh ref={leftPupil}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh ref={rightPupil}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <mesh position={[0, -0.28, 1.05]} ref={mouthRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <Confetti poolRef={particles} />
    </group>
  )
}

export default function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]} style={{ touchAction: 'none' }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={35} color="#ffffff" />
      <pointLight position={[-5, -3, 2]} intensity={15} color="#C77DFF" />
      <Blob />
      <EffectComposer>
        <Bloom intensity={0.25} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}