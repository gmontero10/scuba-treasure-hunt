import { create } from 'zustand'
import * as THREE from 'three'

interface Treasure {
  id: string
  position: THREE.Vector3
  collected: boolean
}

interface GameState {
  score: number
  diverPosition: THREE.Vector3
  diverRotation: number
  joystickInput: { x: number; y: number }
  treasures: Treasure[]

  // Actions
  addScore: (points: number) => void
  setDiverPosition: (position: THREE.Vector3) => void
  setDiverRotation: (rotation: number) => void
  setJoystickInput: (input: { x: number; y: number }) => void
  collectTreasure: (id: string) => void
  spawnTreasures: (count: number) => void
}

const generateTreasurePosition = (): THREE.Vector3 => {
  const range = 40
  return new THREE.Vector3(
    (Math.random() - 0.5) * range,
    Math.random() * 2 + 1,
    (Math.random() - 0.5) * range
  )
}

export const useGameState = create<GameState>((set) => ({
  score: 0,
  diverPosition: new THREE.Vector3(0, 3, 0),
  diverRotation: 0,
  joystickInput: { x: 0, y: 0 },
  treasures: [],

  addScore: (points) => set((state) => ({ score: state.score + points })),

  setDiverPosition: (position) => set({ diverPosition: position }),

  setDiverRotation: (rotation) => set({ diverRotation: rotation }),

  setJoystickInput: (input) => set({ joystickInput: input }),

  collectTreasure: (id) => set((state) => ({
    treasures: state.treasures.map((t) =>
      t.id === id ? { ...t, collected: true } : t
    ),
    score: state.score + 100,
  })),

  spawnTreasures: (count) => set({
    treasures: Array.from({ length: count }, (_, i) => ({
      id: `treasure-${i}`,
      position: generateTreasurePosition(),
      collected: false,
    })),
  }),
}))
