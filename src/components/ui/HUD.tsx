import { useGameState } from '../../hooks/useGameState'

export function HUD() {
  const score = useGameState((state) => state.score)
  const treasures = useGameState((state) => state.treasures)
  const collectedCount = treasures.filter((t) => t.collected).length
  const totalCount = treasures.length

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        pointerEvents: 'none',
        zIndex: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Score */}
      <div
        style={{
          background: 'rgba(0, 24, 48, 0.8)',
          borderRadius: '12px',
          padding: '12px 20px',
          border: '2px solid rgba(0, 170, 255, 0.5)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '4px',
          }}
        >
          Score
        </div>
        <div
          style={{
            color: '#FFD700',
            fontSize: '32px',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          }}
        >
          {score}
        </div>
      </div>

      {/* Treasures collected */}
      <div
        style={{
          background: 'rgba(0, 24, 48, 0.8)',
          borderRadius: '12px',
          padding: '12px 20px',
          border: '2px solid rgba(0, 170, 255, 0.5)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          textAlign: 'right',
        }}
      >
        <div
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '4px',
          }}
        >
          Treasures
        </div>
        <div
          style={{
            color: '#00aaff',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 170, 255, 0.5)',
          }}
        >
          {collectedCount} / {totalCount}
        </div>
      </div>

      {/* Instructions (desktop) */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 24, 48, 0.8)',
          borderRadius: '8px',
          padding: '10px 16px',
          border: '1px solid rgba(0, 170, 255, 0.3)',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '12px',
        }}
      >
        <div style={{ marginBottom: '4px' }}>WASD or Arrow Keys to move</div>
        <div>Touch joystick on mobile</div>
      </div>

      {/* Win message */}
      {collectedCount === totalCount && totalCount > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 24, 48, 0.95)',
            borderRadius: '20px',
            padding: '40px 60px',
            border: '3px solid #FFD700',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: '#FFD700',
              fontSize: '36px',
              fontWeight: 'bold',
              marginBottom: '16px',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            }}
          >
            All Treasures Found!
          </div>
          <div
            style={{
              color: 'white',
              fontSize: '24px',
            }}
          >
            Final Score: {score}
          </div>
        </div>
      )}
    </div>
  )
}
