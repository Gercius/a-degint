# A Degint - Project Structure

## Overview

**A Degint** is a hyperlocal web application that helps village residents decide if it's safe to burn garden waste. The app displays a pre-loaded village map with building footprints and a live wind direction overlay, allowing users to visually judge whether smoke would blow toward neighboring buildings.

**Name**: A degint? (Lithuanian for "to burn")  
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
├── public/
│   └── vite.svg
├── src/
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Application entry point
│   ├── assets/
│   ├── components/               # Feature-based components
│   │   ├── address-selector/
│   │   ├── control-panel/
│   │   ├── home-marker/
│   │   ├── smoke-warning/
│   │   ├── village-map/
│   │   ├── wind-layer/
│   │   └── wind-status-bar/
│   ├── config/                   # Configuration constants
│   │   ├── map.ts                # Map bounds, zoom, tile URL, arrow grid
│   │   └── wind.ts               # Cone angle, refresh interval
│   ├── data/
│   │   └── village-buildings.geojson
│   ├── hooks/
│   │   ├── use-home-selection.ts # Home selection + downwind calc
│   │   └── use-wind.ts           # Wind data fetching + polling
│   ├── lib/
│   │   └── leaflet.ts            # Leaflet icon patch (see Architecture Decisions)
│   ├── pages/
│   │   └── Homepage.tsx
│   ├── services/
│   │   └── wind.ts               # Open-Meteo API client
│   ├── styles/
│   │   ├── _layout.scss
│   │   ├── _tokens.scss
│   │   └── global.scss
│   ├── types/
│   │   └── geojson.d.ts
│   └── utils/
│       ├── buildings.ts          # Building extraction/sorting
│       ├── downwind.ts           # Downwind calculation logic
│       ├── downwind.test.ts
│       ├── wind-arrows.ts        # Arrow grid + rotation
│       └── wind.ts               # Wind direction formatting
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.ts                # Vite config + GeoJSON loader plugin
└── ...                           # tsconfig, prettier, gitignore, etc.
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

### F4 — Geolocation (Not Implemented)
- Could center map on user's approximate location on first load
- Would reduce friction for users finding their home address

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

### Error Handling
- `useWind` exposes `status: 'loading' | 'success' | 'error'` and `lastUpdated`
- On fetch failure, last known wind data is retained; error state surfaced in `WindStatusBar`
- No error boundary needed — wind failure degrades gracefully (map still usable)

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
- **Attribution**: Required, included in map config
- **No API key required**

---

## Architecture Decisions

### Why Static GeoJSON?
- One-time export via Overpass Turbo for the specific village
- Bundled as static asset → no database, no sync, no API calls for building data
- Instant load, works offline (except wind API)
- File is small enough that building extraction is done inline without memoization concerns; revisit if the dataset grows significantly

### Why Open-Meteo?
- Free, no API key
- CORS-friendly (called directly from browser)
- Provides both speed and direction

### Why Leaflet + react-leaflet?
- Lightweight, battle-tested
- No API key needed for OSM tiles
- react-leaflet provides React bindings
- **Note**: react-leaflet breaks Leaflet's default marker icons in Vite/bundler environments. Patched in `src/lib/leaflet.ts` by manually setting icon URLs — this file must be imported before any map is rendered.

### Why No Backend?
- All data sources are public and CORS-accessible
- Simpler deployment, lower cost
- No server maintenance overhead

---

## Build & Deployment

### Scripts
- `dev` — Vite dev server with HMR
- `build` — TypeScript check + Vite production build → `dist/`
- `preview` — Serve production build locally
- `lint` / `style` / `format` — ESLint and Prettier

### Deployment
- Static site: copy `dist/` to any static host (Netlify, Vercel, GitHub Pages, etc.)
- No backend, no environment variables required

---

## Known Limitations

1. **Geolocation (F4)**: Not implemented — could reduce friction for home selection
2. **Manual Refresh**: Intentionally omitted from UI; auto-refresh every 10 min
3. **Mobile UX**: Some polish items optional in F2/F3 (scroll hijack, tap targets)
4. **Offline Wind**: Wind data requires network; last known data shown on error
5. **Village-Specific**: Hardcoded coordinates and GeoJSON; not generalizable without code changes

---

*Last updated: 2025-03-12*