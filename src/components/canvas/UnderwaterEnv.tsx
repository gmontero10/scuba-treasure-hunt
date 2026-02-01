import { useMemo } from 'react'
import * as THREE from 'three'

export function UnderwaterEnv() {
  // Sand material
  const sandMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c2a366',
    roughness: 0.9,
    metalness: 0,
  }), [])

  // Rock material
  const rockMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4a4a4a',
    roughness: 0.85,
    metalness: 0.1,
  }), [])

  // Coral materials
  const coralMaterials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: '#ff6b6b', roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: '#ffa502', roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: '#ff4757', roughness: 0.7 }),
    new THREE.MeshStandardMaterial({ color: '#7bed9f', roughness: 0.7 }),
  ], [])

  // Seaweed material
  const seaweedMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2ed573',
    roughness: 0.6,
    side: THREE.DoubleSide,
  }), [])

  // Generate random decorations
  const decorations = useMemo(() => {
    const items: {
      type: 'rock' | 'coral' | 'seaweed'
      position: [number, number, number]
      rotation: [number, number, number]
      scale: number
      materialIndex?: number
    }[] = []

    // Rocks
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 90
      const z = (Math.random() - 0.5) * 90
      items.push({
        type: 'rock',
        position: [x, Math.random() * 0.5, z],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: 0.5 + Math.random() * 1.5,
      })
    }

    // Corals
    for (let i = 0; i < 40; i++) {
      const x = (Math.random() - 0.5) * 90
      const z = (Math.random() - 0.5) * 90
      items.push({
        type: 'coral',
        position: [x, 0, z],
        rotation: [0, Math.random() * Math.PI * 2, 0],
        scale: 0.3 + Math.random() * 0.7,
        materialIndex: Math.floor(Math.random() * 4),
      })
    }

    // Seaweed patches
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * 90
      const z = (Math.random() - 0.5) * 90
      items.push({
        type: 'seaweed',
        position: [x, 1, z],
        rotation: [0, Math.random() * Math.PI * 2, 0],
        scale: 0.5 + Math.random() * 1,
      })
    }

    return items
  }, [])

  return (
    <group>
      {/* Ocean floor */}
      <mesh
        material={sandMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100, 50, 50]} />
      </mesh>

      {/* Decorations */}
      {decorations.map((item, index) => {
        if (item.type === 'rock') {
          return (
            <mesh
              key={`rock-${index}`}
              material={rockMaterial}
              position={item.position}
              rotation={item.rotation}
              scale={item.scale}
              castShadow
            >
              <dodecahedronGeometry args={[1, 0]} />
            </mesh>
          )
        }

        if (item.type === 'coral') {
          return (
            <group
              key={`coral-${index}`}
              position={item.position}
              rotation={item.rotation}
              scale={item.scale}
            >
              {/* Coral base */}
              <mesh material={coralMaterials[item.materialIndex ?? 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.3, 1.5, 8]} />
              </mesh>
              {/* Coral branches */}
              {[...Array(4)].map((_, bi) => (
                <mesh
                  key={bi}
                  material={coralMaterials[item.materialIndex ?? 0]}
                  position={[
                    Math.sin((bi / 4) * Math.PI * 2) * 0.2,
                    0.5 + Math.random() * 0.5,
                    Math.cos((bi / 4) * Math.PI * 2) * 0.2,
                  ]}
                  rotation={[
                    (Math.random() - 0.5) * 0.5,
                    0,
                    (Math.random() - 0.5) * 0.5,
                  ]}
                  castShadow
                >
                  <cylinderGeometry args={[0.05, 0.1, 0.8, 6]} />
                </mesh>
              ))}
            </group>
          )
        }

        if (item.type === 'seaweed') {
          return (
            <group
              key={`seaweed-${index}`}
              position={item.position}
              rotation={item.rotation}
              scale={item.scale}
            >
              {[...Array(3)].map((_, si) => (
                <mesh
                  key={si}
                  material={seaweedMaterial}
                  position={[si * 0.15 - 0.15, 0, 0]}
                >
                  <planeGeometry args={[0.2, 2]} />
                </mesh>
              ))}
            </group>
          )
        }

        return null
      })}
    </group>
  )
}
