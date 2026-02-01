import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameState } from '../../hooks/useGameState'

interface TreasureProps {
  id: string
  position: THREE.Vector3
}

export function Treasure({ id, position }: TreasureProps) {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  const diverPosition = useGameState((state) => state.diverPosition)
  const collectTreasure = useGameState((state) => state.collectTreasure)

  const animTime = useRef(Math.random() * Math.PI * 2)
  const collectionRadius = 2

  // Materials
  const woodMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8B4513',
    roughness: 0.8,
    metalness: 0.1,
  }), [])

  const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFD700',
    roughness: 0.2,
    metalness: 0.8,
    emissive: '#FFD700',
    emissiveIntensity: 0.3,
  }), [])

  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#FFD700',
    transparent: true,
    opacity: 0.3,
  }), [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    animTime.current += delta

    // Bobbing animation
    groupRef.current.position.y = position.y + Math.sin(animTime.current * 2) * 0.2

    // Slow rotation
    groupRef.current.rotation.y += delta * 0.5

    // Glow pulsing
    if (glowRef.current) {
      const scale = 1 + Math.sin(animTime.current * 3) * 0.1
      glowRef.current.scale.setScalar(scale)
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.2 + Math.sin(animTime.current * 3) * 0.1
    }

    // Check for collection
    const distance = groupRef.current.position.distanceTo(diverPosition)
    if (distance < collectionRadius) {
      collectTreasure(id)
    }
  })

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      {/* Glow effect */}
      <mesh ref={glowRef} material={glowMaterial}>
        <sphereGeometry args={[1.2, 16, 16]} />
      </mesh>

      {/* Chest body */}
      <mesh material={woodMaterial} position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.5]} />
      </mesh>

      {/* Chest lid (rounded top) */}
      <mesh material={woodMaterial} position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.8, 16, 1, false, 0, Math.PI]} />
      </mesh>

      {/* Metal bands */}
      <mesh material={metalMaterial} position={[0.3, 0, 0]}>
        <boxGeometry args={[0.05, 0.52, 0.52]} />
      </mesh>
      <mesh material={metalMaterial} position={[-0.3, 0, 0]}>
        <boxGeometry args={[0.05, 0.52, 0.52]} />
      </mesh>
      <mesh material={metalMaterial} position={[0, 0, 0.26]}>
        <boxGeometry args={[0.82, 0.52, 0.05]} />
      </mesh>

      {/* Lock */}
      <mesh material={metalMaterial} position={[0, 0.1, 0.28]}>
        <boxGeometry args={[0.15, 0.15, 0.05]} />
      </mesh>

      {/* Keyhole */}
      <mesh position={[0, 0.1, 0.31]}>
        <circleGeometry args={[0.03, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Point light for glow */}
      <pointLight color="#FFD700" intensity={2} distance={5} decay={2} />
    </group>
  )
}
