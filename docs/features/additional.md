# Additional Features Implemented

This file tracks features that were added beyond the original F1-F3 plans, or changes that materially updated how those planned features work.

## Implemented

### 1. Auto-zoom to selected house

When a user selects a house, the map flies to that building at zoom level `17`.

- Implemented in `src/components/village-map/village-map.tsx`
- Uses a `ZoomToBuilding` helper with `map.flyTo(...)`

### 2. Visual building state on the map

The map no longer relies only on text warnings.

- Selected house is highlighted in green
- Potentially affected downwind houses are highlighted in red
- Neutral buildings keep the default muted style

Implemented in `src/components/village-map/village-map.tsx`.

### 3. Warning UI changed from listing addresses to map highlighting

The original F3 plan expected affected houses to be listed inline in the warning message. The current implementation instead shows a generic warning and tells the user to look for red-marked houses on the map.

- Implemented in `src/components/smoke-warning/smoke-warning.tsx`
- Supported by red building styling in `src/components/village-map/village-map.tsx`

This matches the idea noted in `notes/todos.md`:
- "dont list all potentially smoked houses, just show warning, and if possible mark affected houses as red"

### 4. Smoke cone overlay

A dedicated smoke plume/cone overlay was added on top of the map to visualize the likely downwind smoke path from the selected house.

- Implemented in `src/components/smoke-cone/smoke-cone.tsx`
- Wired in `src/pages/Homepage.tsx`

This was not part of the original F1-F3 plans and is a meaningful extra visualization layer.

### 5. Wind-speed-based plume behavior

The downwind area is no longer fixed.

- Stronger wind makes the plume narrower and longer
- Weaker wind makes the plume wider and shorter
- Very low wind disables the directional plume entirely

Implemented in `src/config/wind.ts` via `getDownwindProfile(...)`.

This profile is used consistently by:
- `src/components/smoke-cone/smoke-cone.tsx`
- `src/utils/downwind.ts`

### 6. Calm-wind cutoff

At very low wind speed, the app no longer pretends there is a reliable downwind direction.

- No smoke cone is rendered
- No neighboring houses are marked as downwind

Implemented through `DownwindProfile.isActive` in `src/config/wind.ts`, and respected in:
- `src/components/smoke-cone/smoke-cone.tsx`
- `src/utils/downwind.ts`

### 7. Improved address search matching

The address selector supports more forgiving search behavior than a plain substring filter.

- Case-insensitive matching
- Diacritic-insensitive matching
- Token-based matching across address parts
- Keyboard navigation and outside-click closing

Implemented in `src/components/address-selector/address-selector.tsx`.

### 8. Lithuanian-first UI text and wind direction labels

The shipped UI is localized around Lithuanian copy rather than using the English example wording from the original plans.

- Address selector placeholder and empty-state text are in Lithuanian
- Smoke warning states are shown in Lithuanian
- Wind direction is translated into Lithuanian compass labels in the status bar

Implemented in:
- `src/components/address-selector/address-selector.tsx`
- `src/components/smoke-warning/smoke-warning.tsx`
- `src/components/wind-status-bar/wind-status-bar.tsx`
- `src/utils/wind.ts`

### 9. Wind results are reused from local cache across refreshes/reloads

The app keeps successful Open-Meteo responses in `localStorage` for the configured freshness window, which means reloads can reuse recent wind data instead of always waiting for a new network request.

- Cached entries are validated before use
- Stale or invalid cached entries are discarded automatically
- `lastUpdated` reflects the cached fetch timestamp, not just the current page load time

Implemented in:
- `src/services/wind.ts`
- `src/hooks/use-wind.ts`
