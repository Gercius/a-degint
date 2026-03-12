import type { LatLngBoundsExpression } from "leaflet";

export const VILLAGE_CENTER: [number, number] = [54.8746054, 24.51654165];

// prettier-ignore
export const VILLAGE_BOUNDS: LatLngBoundsExpression = [
    [
        54.8654759, // latitude (south/bottom)
        24.4920000  // longitude (west/left)
    ], 
    [
        54.8897349, // latitude (north/top)
        24.5358942  // longitude (east/right)
    ], 
];

export const MAP_MIN_ZOOM = 15;
export const MAP_MAX_ZOOM = 18;
export const MAP_DEFAULT_ZOOM = MAP_MIN_ZOOM;

export const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_LAYER_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

// Wind configuration
export const WIND_REFRESH_INTERVAL_MS = 300_000; // 5 minutes
export const WIND_ARROW_GRID_COLS = 4;
export const WIND_ARROW_GRID_ROWS = 5;
export const WIND_ARROW_COLOR = "#2f8dff"; // light blue
export const WIND_ARROW_OPACITY = 0.9;
