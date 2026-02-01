import { useRef, useEffect } from 'react'
import { useTouchJoystick } from '../../hooks/useTouchJoystick'
import { useGameState } from '../../hooks/useGameState'

export function TouchControls() {
  const containerRef = useRef<HTMLDivElement>(null)
  useTouchJoystick(containerRef)

  useEffect(() => {
    const keys = new Set<string>()

    const updateInput = () => {
      let x = 0
      let y = 0

      if (keys.has('ArrowUp') || keys.has('KeyW')) y = 1
      if (keys.has('ArrowDown') || keys.has('KeyS')) y = -1
      if (keys.has('ArrowLeft') || keys.has('KeyA')) x = -1
      if (keys.has('ArrowRight') || keys.has('KeyD')) x = 1

      // Normalize diagonal movement
      if (x !== 0 && y !== 0) {
        const mag = Math.sqrt(x * x + y * y)
        x /= mag
        y /= mag
      }

      useGameState.getState().setJoystickInput({ x, y })
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.add(e.code)
      updateInput()
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.code)
      updateInput()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '50%',
        height: '40%',
        zIndex: 10,
        touchAction: 'none',
      }}
    />
  )
}
