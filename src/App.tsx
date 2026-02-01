import { GameCanvas } from './components/canvas/GameCanvas'
import { TouchControls } from './components/ui/TouchControls'
import { HUD } from './components/ui/HUD'

function App() {
  return (
    <>
      <GameCanvas />
      <TouchControls />
      <HUD />
    </>
  )
}

export default App
