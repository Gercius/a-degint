import { LatLng, LatLngBounds } from "leaflet";

export function generateArrowGrid(bounds: LatLngBounds, cols: number, rows: number): LatLng[] {
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();

    const latStep = (northEast.lat - southWest.lat) / rows;
    const lngStep = (northEast.lng - southWest.lng) / cols;

    const positions: LatLng[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const lat = southWest.lat + latStep * (row + 0.5);
            const lng = southWest.lng + lngStep * (col + 0.5);
            positions.push(new LatLng(lat, lng));
        }
    }

    return positions;
}

export function windDegToArrowRotation(deg: number): number {
    return (deg + 180) % 360;
}

export function windSpeedToArrowScale(speed: number): number {
    const minSpeed = 0;
    const maxSpeed = 20;
    const minScale = 0.6;
    const maxScale = 1.4;

    const clampedSpeed = Math.max(minSpeed, Math.min(maxSpeed, speed));
    const normalized = (clampedSpeed - minSpeed) / (maxSpeed - minSpeed);

    return minScale + normalized * (maxScale - minScale);
}

export function generateGrid(bounds: LatLngBounds, cols: number, rows: number): LatLng[] {
    return generateArrowGrid(bounds, cols, rows);
}
