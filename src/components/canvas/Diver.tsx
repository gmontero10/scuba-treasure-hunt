import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameState } from '../../hooks/useGameState'

export function Diver() {
  const groupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Mesh>(null)

  const joystickInput = useGameState((state) => state.joystickInput)
  const setDiverPosition = useGameState((state) => state.setDiverPosition)
  const setDiverRotation = useGameState((state) => state.setDiverRotation)

  const velocity = useRef(new THREE.Vector3())
  const targetRotation = useRef(0)

  // Movement parameters
  const speed = 8
  const rotationSpeed = 5
  const drag = 0.95
  const boundarySize = 45

  // Animation time
  const animTime = useRef(0)

  // Create materials
  const suitMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a2e',
    roughness: 0.3,
    metalness: 0.1,
  }), [])

  const skinMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffdbac',
    roughness: 0.6,
    metalness: 0,
  }), [])

  const maskMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00aaff',
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.7,
  }), [])

  const tankMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffcc00',
    roughness: 0.3,
    metalness: 0.5,
  }), [])

  const finMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00cc88',
    roughness: 0.4,
    metalness: 0.1,
  }), [])

  useFrame(({ camera }, delta) => {
    if (!groupRef.current) return

    animTime.current += delta

    // Apply joystick input to velocity
    const inputMagnitude = Math.sqrt(joystickInput.x ** 2 + joystickInput.y ** 2)

    if (inputMagnitude > 0.1) {
      // Transform joystick input based on camera rotation
      const cameraRotation = camera.rotation.y
      const cos = Math.cos(cameraRotation)
      const sin = Math.sin(cameraRotation)

      // Rotate joystick input from view-space to world-space
      const worldX = joystickInput.x * cos - joystickInput.y * sin
      const worldZ = joystickInput.x * sin + joystickInput.y * cos

      // Calculate target rotation from transformed input (diver faces movement direction)
      targetRotation.current = Math.atan2(worldX, worldZ)

      // Add acceleration based on transformed joystick input
      velocity.current.x += worldX * speed * delta
      velocity.current.z += worldZ * speed * delta
    }

    // Apply drag
    velocity.current.multiplyScalar(drag)

    // Smooth rotation
    const currentRotation = groupRef.current.rotation.y
    const rotationDiff = targetRotation.current - currentRotation
    const normalizedDiff = Math.atan2(Math.sin(rotationDiff), Math.cos(rotationDiff))
    groupRef.current.rotation.y += normalizedDiff * rotationSpeed * delta

    // Update position
    groupRef.current.position.add(velocity.current.clone().multiplyScalar(delta))

    // Boundary constraints
    groupRef.current.position.x = THREE.MathUtils.clamp(
      groupRef.current.position.x,
      -boundarySize,
      boundarySize
    )
    groupRef.current.position.z = THREE.MathUtils.clamp(
      groupRef.current.position.z,
      -boundarySize,
      boundarySize
    )

    // Vertical bobbing and swimming animation
    const swimBob = Math.sin(animTime.current * 2) * 0.1
    const movementBob = inputMagnitude > 0.1 ? Math.sin(animTime.current * 6) * 0.15 : 0
    groupRef.current.position.y = 3 + swimBob + movementBob

    // Tilt based on movement
    const tiltAmount = inputMagnitude > 0.1 ? 0.2 : 0
    if (bodyRef.current) {
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(
        bodyRef.current.rotation.x,
        tiltAmount,
        delta * 5
      )
    }

    // Update game state
    setDiverPosition(groupRef.current.position.clone())
    setDiverRotation(groupRef.current.rotation.y)
  })

  return (
    <group ref={groupRef} position={[0, 3, 0]}>
      {/* Main body group for tilt */}
      <group ref={bodyRef}>
        {/* Torso */}
        <mesh material={suitMaterial} position={[0, 0, 0]}>
          <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
        </mesh>

        {/* Head */}
        <mesh material={skinMaterial} position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
        </mesh>

        {/* Diving mask */}
        <mesh material={maskMaterial} position={[0, 0.8, 0.15]}>
          <boxGeometry args={[0.35, 0.15, 0.15]} />
        </mesh>

        {/* Snorkel */}
        <mesh material={tankMaterial} position={[0.2, 1, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
        </mesh>

        {/* Air tank */}
        <mesh material={tankMaterial} position={[0, 0, -0.35]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 8]} />
        </mesh>

        {/* Arms */}
        <mesh material={suitMaterial} position={[0.5, 0.2, 0]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.08, 0.4, 8, 8]} />
        </mesh>
        <mesh material={suitMaterial} position={[-0.5, 0.2, 0]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.08, 0.4, 8, 8]} />
        </mesh>

        {/* Legs */}
        <mesh material={suitMaterial} position={[0.15, -0.7, 0]} rotation={[0.2, 0, 0]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 8]} />
        </mesh>
        <mesh material={suitMaterial} position={[-0.15, -0.7, 0]} rotation={[0.2, 0, 0]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 8]} />
        </mesh>

        {/* Fins */}
        <mesh material={finMaterial} position={[0.15, -1.2, 0.2]} rotation={[0.5, 0, 0]}>
          <boxGeometry args={[0.15, 0.05, 0.5]} />
        </mesh>
        <mesh material={finMaterial} position={[-0.15, -1.2, 0.2]} rotation={[0.5, 0, 0]}>
          <boxGeometry args={[0.15, 0.05, 0.5]} />
        </mesh>
      </group>
    </group>
  )
}
