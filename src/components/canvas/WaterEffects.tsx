import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createCausticsMaterial, updateCausticsMaterial } from '../../shaders/caustics'

export function WaterEffects() {
  const bubblesRef = useRef<THREE.InstancedMesh>(null)
  const causticsRef = useRef<THREE.Mesh>(null)

  const bubbleCount = 100
  const bubbleData = useMemo(() => {
    return Array.from({ length: bubbleCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 80,
        Math.random() * 20 - 5,
        (Math.random() - 0.5) * 80
      ),
      speed: 0.5 + Math.random() * 1.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 1 + Math.random() * 2,
      scale: 0.05 + Math.random() * 0.15,
    }))
  }, [])

  const causticsMaterial = useMemo(() => createCausticsMaterial(), [])

  const bubbleMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.4,
  }), [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Update bubbles
    if (bubblesRef.current) {
      bubbleData.forEach((bubble, i) => {
        // Move bubble up
        bubble.position.y += bubble.speed * 0.02

        // Reset bubble if too high
        if (bubble.position.y > 20) {
          bubble.position.y = -5
          bubble.position.x = (Math.random() - 0.5) * 80
          bubble.position.z = (Math.random() - 0.5) * 80
        }

        // Wobble
        const wobbleX = Math.sin(time * bubble.wobbleSpeed + bubble.wobble) * 0.1
        const wobbleZ = Math.cos(time * bubble.wobbleSpeed + bubble.wobble) * 0.1

        dummy.position.set(
          bubble.position.x + wobbleX,
          bubble.position.y,
          bubble.position.z + wobbleZ
        )
        dummy.scale.setScalar(bubble.scale)
        dummy.updateMatrix()
        bubblesRef.current!.setMatrixAt(i, dummy.matrix)
      })
      bubblesRef.current.instanceMatrix.needsUpdate = true
    }

    // Update caustics
    if (causticsRef.current) {
      updateCausticsMaterial(causticsMaterial, time)
    }
  })

  return (
    <>
      {/* Bubbles */}
      <instancedMesh
        ref={bubblesRef}
        args={[undefined, undefined, bubbleCount]}
        material={bubbleMaterial}
      >
        <sphereGeometry args={[1, 8, 8]} />
      </instancedMesh>

      {/* Caustics on ocean floor */}
      <mesh
        ref={causticsRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.4, 0]}
        material={causticsMaterial}
      >
        <planeGeometry args={[100, 100]} />
      </mesh>

      {/* Light rays (volumetric-like effect with simple meshes) */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.sin(angle) * 15
        const z = Math.cos(angle) * 15
        return (
          <mesh
            key={i}
            position={[x, 10, z]}
            rotation={[0, -angle, Math.PI / 6]}
          >
            <coneGeometry args={[3, 20, 4]} />
            <meshBasicMaterial
              color="#00aaff"
              transparent
              opacity={0.02}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      })}
    </>
  )
}
