# Nature-Eloquent — Project Guide

## Project Overview

A WebGL 3D interactive narrative experience built on Three.js + TypeScript + Vite.
Plugin-based architecture designed for extensibility (FPS camera, base experience framework).

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Three.js | ^0.183.2 | 3D graphics |
| TypeScript | ~6.0.2 | Type safety |
| Vite | ^8.0.4 | Build tool + HMR |
| GSAP | ^3.15.0 | Animations |
| lil-gui | ^0.21.0 | Debug UI |
| Vitest | ^4.1.5 | Unit tests |
| vite-plugin-glsl | ^1.6.0 | GLSL shader imports |

---

## Commands

```bash
npm run dev       # Start dev server (HMR)
npm run build     # Production build
npm run preview   # Preview production build
npm run test      # Run Vitest unit tests
```

---

## Architecture

### Singleton Experience Pattern

`Experience` is a singleton — the central orchestrator. All subsystems access it via `Experience.instance`.

```
Experience (singleton)
├── scene         (THREE.Scene)
├── camera        (Camera subclass)
├── renderer      (Renderer)
├── world         (World subclass)
├── inputs        (InputSystem)
├── resources     (Resources)
├── time          (Time)
├── sizes         (Sizes)
└── debug         (Debug / lil-gui)
```

### Lifecycle Interface

Every system implements `LifeTimeObject`:

```typescript
interface LifeTimeObject {
  init(): void;     // Called after resources load
  update(): void;   // Called every frame
  destroy(): void;  // Cleanup
}
```

**Critical:** `init()` is never called before `Resources` emits `"ready"`. Do not access asset data before that event.

### Plugin System

Two reusable plugins live in `src/plugins/`:

- **`baseExperience/`** — Core framework: Experience, World, Camera, Renderer, Inputs, Utils
- **`firstPersonCamera/`** — FPS controller with Octree collision

Each plugin has its own `main.ts` entry point for standalone demos.

### Entry Points

| File | Purpose |
|------|---------|
| `src/main.ts` | **Main game** — Playground world + FPS camera |
| `src/plugins/baseExperience/main.ts` | Template demo — Orbit camera |
| `src/plugins/firstPersonCamera/main.ts` | FPS template demo |

---

## Project Structure

```
src/
├── main.ts                      # App entry point
├── plugins/
│   ├── baseExperience/          # Core framework plugin
│   │   ├── experience/          # Experience, Camera, Renderer
│   │   ├── world/               # World, Environment, Collision
│   │   ├── objects/             # Actor, StaticObject, Animation
│   │   ├── inputs/              # InputSystem, InputProfile
│   │   └── utils/               # EventEmitter, Resources, Time, Sizes, Debug
│   └── firstPersonCamera/       # FPS camera plugin
│       ├── camera/              # FirstPersonCamera, FirstPersonCameraOctree
│       └── templates/           # CollisionTemplateWorld, input profiles
├── world/                       # Game-specific worlds
│   ├── PlaygroundWorld.ts       # Main world
│   ├── GameEnvironment.ts       # Sky, fog, bloom, grass, clouds
│   └── ...
├── interactions/                # Interaction systems
│   ├── InteractionManager.ts    # Raycasting + object placement
│   ├── InstancedMeshManager.ts  # Instanced mesh management
│   └── Menu/                    # Menu system + unit tests
├── camera/                      # Game camera controllers
├── interactable/                # Interactable objects
├── books/                       # Book interaction UI
├── subtitle/                    # Dialog / subtitle system
├── resources/                   # Asset manifest + input profiles
├── common/                      # Shared constants (Colors, Layers, Fog)
├── utils/                       # Utility functions
├── shaders/                     # GLSL shaders (grass, skybox)
└── assets/                      # CSS, static assets
```

---

## Key Systems

### Resource Loading

Assets declared in `src/resources/sources.ts`. Loaded by `Resources` class; `"ready"` event fires once all assets are loaded. Never access `resources.items` before this event.

### Input System

`InputSystem` maps physical inputs to abstract action events (e.g., `"forward"`, `"jump"`, `"interact"`) via `InputProfile` objects. Register profiles with `experience.inputs.addProfile(profile)`.

Configured profiles: `keyboardInputProfile`, `gamepadInputProfile` (BitDo Ultimate 2C).

### Rendering Layers

| Layer | Usage |
|-------|-------|
| 1 | Interactable objects (raycasting) |
| 2 | Debug / selective bloom objects |

Selective bloom is achieved by masking layers on the `UnrealBloomPass`.

### Collision

`CollisionManager` tracks collidable objects. `FirstPersonCameraOctree` uses Three.js `Octree` for FPS floor/wall collision.

### Subtitles / Dialog

`SubtitleManager` (singleton) reads `subtitle/dialogSubtitleAudio.json` and displays dialog HUD elements triggered by in-world events (e.g., mushroom placement count).

---

## Code Conventions

### Naming

- Classes: `PascalCase`
- Files: `PascalCase` (one class per file)
- Private properties/methods: `private` keyword; internal helpers may use `_` prefix
- Event names: `camelCase` strings (`"forward"`, `"resourcesReady"`)

### Formatting (Prettier)

- Indentation: **tabs** (width 4)
- Quotes: **double**
- Semicolons: **yes**
- Line width: **80 characters**
- Trailing commas: **ES5**

### TypeScript

- Target: ES2023, strict mode
- Path aliases: `@plugins/*` → `src/plugins/*`, `@shaders/*` → `src/shaders/*`
- `noUnusedLocals` and `noUnusedParameters` are enabled — clean up unused variables
- `@ts-ignore` is used only for GLSL shader imports

### Comments

Only add comments when the **why** is non-obvious. Do not describe what the code does.

---

## TODOs & Known Issues

- **Draco loader not added** — `@TODO add the draco loader` in `Resources.ts:36`
- **Camera/Actor attachment** — `@TODO The Camera should be attached to an actor?` in `Camera.ts:51`
- **Cloud system disabled** — commented out in `GameEnvironment` constructor
- **Gamepad analog sticks** — axes mapping partially implemented but commented out
- **Performance display** — `displayPerformances()` stub in `Experience.ts:75`

---

## Testing

Tests live alongside their module (e.g., `src/interactions/Menu/Menu.test.ts`).

```bash
npm run test      # Run all tests
```

Tests use Vitest with `beforeEach` setup. Test environment is `node`.

---

## Debug Mode

Append `#debug` to the URL to enable lil-gui debug panels on all major systems.
Debug objects (helpers, overlays) are placed on rendering layer 2.
