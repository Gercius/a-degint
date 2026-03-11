import type { LatLngBoundsExpression } from "leaflet";

export const VILLAGE_CENTER: [number, number] = [54.8746054, 24.51654165];

export const VILLAGE_BOUNDS: LatLngBoundsExpression = [
    [54.8684759, 24.5071891],
    [54.8807349, 24.5268942],
];

export const MAP_MIN_ZOOM = 15;
export const MAP_MAX_ZOOM = 18;
export const MAP_DEFAULT_ZOOM = MAP_MIN_ZOOM;

export const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_LAYER_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

// Wind configuration
export const WIND_REFRESH_INTERVAL_MS = 600_000; // 10 minutes
export const WIND_ARROW_GRID_COLS = 4;
export const WIND_ARROW_GRID_ROWS = 5;
export const WIND_ARROW_COLOR = "#60a5fa"; // light blue
export const WIND_ARROW_OPACITY = 0.9;
