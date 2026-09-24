import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'

function Cassette({ playing, setPlaying }) {
  const group = useRef()
  const reelL = useRef()
  const reelR = useRef()

  useFrame((state, delta) => {
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.08
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15
    if (playing) {
      reelL.current.rotation.z += delta * 4
      reelR.current.rotation.z += delta * 4
    }
  })

  return (
    <group ref={group} onClick={() => setPlaying((p) => !p)}>
      <RoundedBox args={[2.4, 1.5, 0.3]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#D9636B" roughness={0.3} metalness={0.1} />
      </RoundedBox>
      <mesh position={[0, 0.05, 0.16]}>
        <planeGeometry args={[1.7, 0.8]} />
        <meshStandardMaterial color="#F3D2D6" roughness={0.4} />
      </mesh>
      <mesh ref={reelL} position={[-0.42, 0.05, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
        <meshStandardMaterial color="#341418" />
      </mesh>
      <mesh ref={reelR} position={[0.42, 0.05, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
        <meshStandardMaterial color="#341418" />
      </mesh>
    </group>
  )
}

export default function Cassette3D() {
  const [playing, setPlaying] = useState(true)
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 40 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.8} />
      <pointLight position={[3, 3, 3]} intensity={30} color="#ffffff" />
      <Cassette playing={playing} setPlaying={setPlaying} />
    </Canvas>
  )
}