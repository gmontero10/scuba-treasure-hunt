import { useEffect, useRef, useCallback } from 'react'
import nipplejs from 'nipplejs'
import type { JoystickManager, EventData, JoystickOutputData } from 'nipplejs'
import { useGameState } from './useGameState'

export function useTouchJoystick(containerRef: React.RefObject<HTMLDivElement | null>) {
  const managerRef = useRef<JoystickManager | null>(null)
  const setJoystickInput = useGameState((state) => state.setJoystickInput)

  const handleMove = useCallback((_evt: EventData, data: JoystickOutputData) => {
    if (data.vector) {
      setJoystickInput({
        x: data.vector.x,
        y: data.vector.y,
      })
    }
  }, [setJoystickInput])

  const handleEnd = useCallback(() => {
    setJoystickInput({ x: 0, y: 0 })
  }, [setJoystickInput])

  useEffect(() => {
    if (!containerRef.current) return

    managerRef.current = nipplejs.create({
      zone: containerRef.current,
      mode: 'static',
      position: { left: '80px', bottom: '80px' },
      color: 'rgba(255, 255, 255, 0.5)',
      size: 120,
      restOpacity: 0.5,
      fadeTime: 0,
    })

    managerRef.current.on('move', handleMove)
    managerRef.current.on('end', handleEnd)

    return () => {
      if (managerRef.current) {
        managerRef.current.destroy()
        managerRef.current = null
      }
    }
  }, [containerRef, handleMove, handleEnd])

  return managerRef
}
