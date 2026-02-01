# Scuba Treasure Hunt

A 3D mobile web game where players control a diver from a third-person view to collect underwater treasures.

## Play

Visit: https://gmontero10.github.io/scuba-treasure-hunt/

## Features

- 3D third-person diver movement
- Touch joystick controls for mobile (nipplejs)
- Keyboard controls for desktop (WASD / Arrow keys)
- Treasure chest collection
- Underwater visuals: fog, caustics, bubbles
- Score display HUD

## Tech Stack

- React 19 + TypeScript
- Vite
- React Three Fiber (R3F)
- Three.js
- Zustand (state management)
- nipplejs (touch controls)

## Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Controls

- **Desktop**: WASD or Arrow keys to move
- **Mobile**: Touch joystick in bottom-left corner

## Deployment

Automatically deploys to GitHub Pages on push to `main` branch via GitHub Actions.
