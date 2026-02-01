import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { Diver } from './Diver'
import { Treasure } from './Treasure'
import { UnderwaterEnv } from './UnderwaterEnv'
import { WaterEffects } from './WaterEffects'
import { CameraController } from './CameraController'
import { useGameState } from '../../hooks/useGameState'

function Scene() {
  const treasures = useGameState((state) => state.treasures)
  const spawnTreasures = useGameState((state) => state.spawnTreasures)

  useEffect(() => {
    spawnTreasures(10)
  }, [spawnTreasures])

  return (
    <>
      <CameraController />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#00aaff" />

      <Diver />

      {treasures
        .filter((t) => !t.collected)
        .map((treasure) => (
          <Treasure
            key={treasure.id}
            id={treasure.id}
            position={treasure.position}
          />
        ))}

      <UnderwaterEnv />
      <WaterEffects />

      <fog attach="fog" args={['#001830', 5, 50]} />
    </>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00aaff" wireframe />
    </mesh>
  )
}

export function GameCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 5, 10], fov: 60 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
    >
      <color attach="background" args={['#001830']} />
      <Suspense fallback={<LoadingFallback />}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
