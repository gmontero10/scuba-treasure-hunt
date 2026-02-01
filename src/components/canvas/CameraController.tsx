import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameState } from '../../hooks/useGameState'

export function CameraController() {
  const { camera } = useThree()
  const diverPosition = useGameState((state) => state.diverPosition)
  const diverRotation = useGameState((state) => state.diverRotation)

  const targetPosition = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())

  // Camera follow parameters
  const cameraDistance = 8
  const cameraHeight = 5
  const cameraLag = 3

  useFrame((_, delta) => {
    // Calculate desired camera position behind the diver
    const offsetX = Math.sin(diverRotation) * cameraDistance
    const offsetZ = Math.cos(diverRotation) * cameraDistance

    targetPosition.current.set(
      diverPosition.x + offsetX,
      diverPosition.y + cameraHeight,
      diverPosition.z + offsetZ
    )

    // Smoothly interpolate camera position
    camera.position.lerp(targetPosition.current, cameraLag * delta)

    // Look at point slightly above the diver
    targetLookAt.current.set(
      diverPosition.x,
      diverPosition.y + 1,
      diverPosition.z
    )

    camera.lookAt(targetLookAt.current)
  })

  return null
}
