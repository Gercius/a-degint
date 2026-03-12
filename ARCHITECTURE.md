# A Degint - Project Structure

## Overview

**A Degint** is a hyperlocal web application that helps village residents decide if it's safe to burn garden waste. The app displays a pre-loaded village map with building footprints and a live wind direction overlay, allowing users to visually judge whether smoke would blow toward neighboring buildings.

**Name**: ka-gaminti (Lithuanian for "to burn")  
**Type**: Static SPA (Single Page Application)  
**License**: Private

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 7 |
| **Styling** | SCSS Modules |
| **Map** | Leaflet + react-leaflet |
| **Validation** | Zod |
| **Icons** | Inline SVGs |
| **Data** | Static GeoJSON (OSM) |
| **API** | Open-Meteo (wind data) |

---

## Project Structure

```
a-degint/
├── .roo/                          # Roo mode rules and configurations
│   ├── rules/
│   │   ├── general.md            # General web dev rules
│   │   └── rules.md              # Project-specific rules
├── notes/                         # Project documentation and planning
│   ├── features/
│   │   ├── f1.md                 # Village Map feature plan
│   │   ├── f2.md                 # Wind Direction Overlay feature plan
│   │   └── f3.md                 # Downwind Highlight feature plan
│   ├── other.md
│   ├── project.md                # Project overview and goals
│   ├── rules.md                  # Coding standards
│   └── tech-stack.md             # Technology decisions
├── public/                        # Static assets
│   └── vite.svg
├── src/
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Application entry point
│   ├── assets/                   # Static assets (images, icons)
│   │   └── react.svg
│   ├── components/               # Feature-based components
│   │   ├── address-selector/    # Address search combobox (F3)
│   │   │   ├── address-selector.module.scss
│   │   │   └── address-selector.tsx
│   │   ├── control-panel/        # Bottom panel container (F3)
│   │   │   ├── control-panel.module.scss
│   │   │   └── control-panel.tsx
│   │   ├── home-marker/          # User's home pin on map (F3)
│   │   │   ├── home-marker.module.scss
│   │   │   └── home-marker.tsx
│   │   ├── smoke-warning/        # Downwind warning display (F3)
│   │   │   ├── smoke-warning.module.scss
│   │   │   └── smoke-warning.tsx
│   │   ├── village-map/          # Base map component (F1)
│   │   │   ├── village-map.module.scss
│   │   │   └── village-map.tsx
│   │   ├── wind-layer/           # Wind arrow overlay (F2)
│   │   │   ├── wind-layer.module.scss
│   │   │   └── wind-layer.tsx
│   │   └── wind-status-bar/      # Top status bar (F2)
│   │       ├── wind-status-bar.module.scss
│   │       └── wind-status-bar.tsx
│   ├── config/                   # Configuration constants
│   │   ├── map.ts                # Map bounds, zoom, tile URL
│   │   └── wind.ts               # Wind config (cone angle, refresh interval)
│   ├── data/                     # Static data files
│   │   └── village-buildings.geojson  # OSM building footprints
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-home-selection.ts # Home selection + downwind calc (F3)
│   │   └── use-wind.ts           # Wind data fetching + polling (F2)
│   ├── lib/                      # Library setup
│   │   └── leaflet.ts            # Leaflet CSS/icon fixes
│   ├── pages/                    # Page components
│   │   └── Homepage.tsx          # Main page layout
│   ├── services/                 # External API services
│   │   └── wind.ts               # Open-Meteo API client
│   ├── styles/                   # Global styles
│   │   ├── _layout.scss
│   │   ├── _tokens.scss
│   │   └── global.scss
│   ├── types/                    # TypeScript type definitions
│   │   └── geojson.d.ts          # GeoJSON type extensions
│   └── utils/                    # Pure utility functions
│       ├── buildings.ts          # Building extraction/sorting (F1, F3)
│       ├── downwind.ts           # Downwind calculation logic (F3)
│       ├── downwind.test.ts      # Unit tests for downwind utils
│       ├── wind-arrows.ts        # Arrow grid + rotation (F2)
│       └── wind.ts               # Wind direction formatting (F2)
├── .eslintrc.cjs
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md                     # Vite default template README
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts                # Vite config + GeoJSON loader plugin
```

---

## Feature Breakdown

### F1 — Village Map (Complete)
- Pre-loaded Leaflet map centered on the village
- Map constraints: bounded to village area, zoom limits (15-18)
- Building footprints rendered from GeoJSON
- Address labels shown as permanent tooltips where data exists
- Config: `src/config/map.ts`

### F2 — Wind Direction Overlay (Complete)
- Open-Meteo API integration with Zod validation
- Auto-refresh every 10 minutes
- Wind status bar: speed (m/s), direction (degrees + Lithuanian label), last updated
- Wind arrow layer: grid of directional arrows spread across map
- Smooth arrow rotation on wind change
- Config: `src/config/wind.ts`, `src/config/map.ts` (arrow constants)
- Hook: `src/hooks/use-wind.ts`
- Components: `WindStatusBar`, `WindLayer`
- Utils: `src/utils/wind.ts`, `src/utils/wind-arrows.ts`

### F3 — Downwind Highlight (Complete)
- Address selector: searchable combobox with keyboard support
- Home selection persisted to `localStorage`
- Downwind calculation: cone-based (90° angle, 300m max distance)
- Smoke warning: shows affected buildings or safe message
- Home marker: distinct pin on map at selected location
- Control panel: bottom overlay housing selector and warning
- Hook: `src/hooks/use-home-selection.ts`
- Components: `AddressSelector`, `SmokeWarning`, `HomeMarker`, `ControlPanel`
- Utils: `src/utils/buildings.ts`, `src/utils/downwind.ts`

---

## Key Configuration Files

### `vite.config.ts`
- Vite configuration with React plugin
- Custom GeoJSON loader plugin for direct imports
- No build optimization needed (static asset bundling)

### `tsconfig.app.json`
- TypeScript configuration for the React app
- Strict mode enabled
- Path aliases not used (direct relative imports)

### `package.json`
- **Scripts**:
  - `dev` — Start Vite dev server
  - `build` — TypeScript check + Vite build
  - `preview` — Preview production build
  - `lint` — Run ESLint
  - `style` — Check Prettier formatting
  - `format` — Apply Prettier formatting
- **Dependencies**: React 19, react-dom, react-leaflet, leaflet, zod, sass
- **DevDependencies**: Vite, TypeScript, ESLint + plugins, Prettier

### `src/config/map.ts`
```typescript
export const VILLAGE_CENTER: [number, number] = [54.8746054, 24.51654165];
export const VILLAGE_BOUNDS: LatLngBoundsExpression = [
  [54.8684759, 24.5071891],
  [54.8807349, 24.5268942],
];
export const MAP_MIN_ZOOM = 15;
export const MAP_MAX_ZOOM = 18;
export const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";
export const WIND_ARROW_GRID_COLS = 4;
export const WIND_ARROW_GRID_ROWS = 5;
export const WIND_ARROW_COLOR = "#2f8dff";
export const WIND_ARROW_OPACITY = 0.9;
export const WIND_REFRESH_INTERVAL_MS = 600_000;
```

### `src/config/wind.ts`
```typescript
export const DOWNWIND_CONE_ANGLE_DEG = 90;  // ±45° either side
export const DOWNWIND_MAX_DISTANCE_M = 300; // Reasonable smoke reach
```

---

## Data Flow

```
App.tsx
├── useWind() → wind data (F2)
└── Homepage
    ├── Extract buildings from GeoJSON (F1, F3)
    ├── useHomeSelection(buildings, windDirection) (F3)
    │   ├── selectedBuilding (persisted to localStorage)
    │   └── downwindBuildings (computed)
    └── Render
        ├── WindStatusBar (wind, status, error, lastUpdated)
        ├── VillageMap
        │   ├── WindLayer (wind)
        │   └── HomeMarker (selectedBuilding)
        └── ControlPanel
            ├── AddressSelector (buildings, selected, onChange)
            └── SmokeWarning (selectedBuilding, downwindBuildings, windStatus)
```

---

## External APIs

### Open-Meteo Wind API
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Params**: `latitude`, `longitude`, `current=wind_speed_10m,wind_direction_10m`
- **Response**: Validated with Zod schema in `src/services/wind.ts`
- **Refresh**: Every 10 minutes (configurable via `WIND_REFRESH_INTERVAL_MS`)
- **No API key required**

### OpenStreetMap Tiles
- **URL**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Attribution**: Required, included in `src/config/map.ts`
- **No API key required**

---

## Development Guidelines

### Code Style
- **Naming**: `camelCase` for variables/functions, `PascalCase` for components, `SCREAMING_SNAKE_CASE` for constants
- **TypeScript**: No `any`, prefer `type` over `interface`, co-locate types
- **Components**: Feature-based folders, separate logic from presentation
- **Styling**: SCSS modules, no inline styles, mobile-first breakpoints
- **State**: Keep local, separate server state from UI state
- **Async**: Explicit error handling, consistent loading/error/success states

### Git Workflow
- Atomic commits (one logical change per commit)
- Imperative present tense: `fix`, `add`, `update`
- No commented-out code, no `console.log` in commits

### Testing
- Unit tests for pure functions (e.g., `downwind.test.ts` in utils folder)
- Integration testing via manual browser verification
- No dedicated test runner configured (consider adding Vitest if needed)

---

## Build & Deployment

### Development
```bash
npm install
npm run dev
```
- Vite dev server with HMR
- Runs on `http://localhost:5173` by default

### Production Build
```bash
npm run build
```
- TypeScript type checking (`tsc -b`)
- Vite production build (output to `dist/`)

### Preview
```bash
npm run preview
```
- Serve production build locally

### Linting & Formatting
```bash
npm run lint       # Check for ESLint errors
npm run style      # Check Prettier formatting
npm run format     # Apply Prettier formatting
```

### Deployment
- Static site: copy `dist/` to any static host (Netlify, Vercel, GitHub Pages, etc.)
- No backend required
- No environment variables needed

---

## Architecture Decisions

### Why Static GeoJSON?
- One-time export via Overpass Turbo for the specific village
- Bundled as static asset → no database, no sync, no API calls for building data
- Instant load, works offline (except wind API)

### Why Open-Meteo?
- Free, no API key
- CORS-friendly (called directly from browser)
- Provides both speed and direction

### Why Leaflet + react-leaflet?
- Lightweight, battle-tested
- No API key needed for OSM tiles
- react-leaflet provides React bindings

### Why No Backend?
- All data sources are public and CORS-accessible
- Simpler deployment, lower cost
- No server maintenance overhead

---

## Known Limitations

1. **Geolocation (F4)**: Not implemented — could center map on user's approximate location
2. **Manual Refresh**: Optional in F2, intentionally omitted from UI
3. **Mobile UX**: Some polish items marked optional in F2/F3 (scroll hijack, tap targets)
4. **Offline Wind**: Wind data requires network; last known data shown on error
5. **Village-Specific**: Hardcoded coordinates and GeoJSON; not generalizable without code changes

---

## Future Enhancements (Out of Scope)

- Multi-village support
- User accounts or preferences storage
- Push notifications for dangerous wind conditions
- Integration with local fire department APIs
- Burn permit status display
- Historical wind data trends
- Alternative tile layers (satellite, terrain)

---

## Contact & Credits

**Project**: A Degint (ka-gaminti)  
**Stack**: React + TypeScript + Vite + Leaflet  
**Data**: OpenStreetMap, Open-Meteo  
**Status**: Feature-complete for F1-F3

---

*Last updated: 2025-03-12*