import type { LatLng, Building } from "./buildings";
import { DOWNWIND_CONE_ANGLE_DEG, DOWNWIND_MAX_DISTANCE_M } from "../config/wind";

/**
 * Calculates the compass bearing from one point to another.
 * Returns degrees in range [0, 360) where 0 is North.
 */
export function getBearing(from: LatLng, to: LatLng): number {
    const [lat1, lon1] = from;
    const [lat2, lon2] = to;

    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);

    // Convert to degrees and normalize to [0, 360)
    const bearing = (θ * 180) / Math.PI;
    return (bearing + 360) % 360;
}

/**
 * Calculates the great-circle distance between two points using haversine formula.
 * Returns distance in meters.
 */
export function getDistance(from: LatLng, to: LatLng): number {
    const [lat1, lon1] = from;
    const [lat2, lon2] = to;

    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Determines if a target point lies within the downwind cone from an origin.
 *
 * @param origin - The source building location
 * @param target - The target building location to test
 * @param windDirection - Wind direction in degrees (0-360, where wind is blowing FROM)
 * @param coneAngle - Total cone angle in degrees (e.g., 90 means ±45° from downwind)
 * @param maxDistanceM - Maximum distance in meters to consider
 * @returns true if target is within the downwind cone and within max distance
 */
export function isInDownwindCone(
    origin: LatLng,
    target: LatLng,
    windDirection: number,
    coneAngle: number,
    maxDistanceM: number,
): boolean {
    const distance = getDistance(origin, target);

    if (distance > maxDistanceM) {
        return false;
    }

    const bearing = getBearing(origin, target);
    // Wind blows FROM windDirection, so downwind direction is opposite
    const downwindDirection = (windDirection + 180) % 360;

    // Calculate angular difference (shortest angle between two directions)
    let delta = Math.abs(bearing - downwindDirection);
    if (delta > 180) {
        delta = 360 - delta;
    }

    const halfConeAngle = coneAngle / 2;
    return delta <= halfConeAngle;
}

/**
 * Gets all buildings that are downwind from the origin building.
 * Excludes the origin building itself from the result.
 *
 * @param origin - The selected home building
 * @param allBuildings - All available buildings to check
 * @param windDirection - Current wind direction in degrees
 * @returns Array of buildings in the downwind cone, sorted by label
 */
export function getDownwindBuildings(origin: Building, allBuildings: Building[], windDirection: number): Building[] {
    const downwindBuildings = allBuildings.filter((building) => {
        if (building.id === origin.id) {
            return false; // Exclude origin
        }
        return isInDownwindCone(
            origin.center,
            building.center,
            windDirection,
            DOWNWIND_CONE_ANGLE_DEG,
            DOWNWIND_MAX_DISTANCE_M,
        );
    });

    // Sort by label for consistent display
    return sortBuildingsByLabel(downwindBuildings);
}

/**
 * Sorts buildings by label (numeric then alphabetical).
 * Extracted from buildings.ts to avoid duplication.
 */
function sortBuildingsByLabel(buildings: Building[]): Building[] {
    return [...buildings].sort((a, b) => {
        const extractNumber = (label: string): number => {
            const match = label.match(/^(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
        };

        const numA = extractNumber(a.label);
        const numB = extractNumber(b.label);

        if (numA !== numB) {
            return numA - numB;
        }

        return a.label.localeCompare(b.label);
    });
}
