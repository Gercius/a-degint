import { useMemo } from "react";
import { Polygon } from "react-leaflet";
import type { LatLng } from "../../utils/buildings";
import { getDownwindProfile } from "../../config/wind";

interface SmokeConeProps {
    origin: LatLng;
    windDirection: number; // Degrees where wind is blowing FROM
    windSpeedMs: number;
}

/**
 * Generates points for a cone shape centered on the downwind direction.
 * The cone extends from the origin to maxDistance, with the specified cone angle.
 */
function projectPoint(origin: LatLng, bearingDeg: number, distanceM: number): LatLng {
    const [lat, lng] = origin;
    const angularDistance = distanceM / 6371000;
    const bearingRad = (bearingDeg * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;

    const projectedLat = Math.asin(
        Math.sin(latRad) * Math.cos(angularDistance) +
            Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearingRad),
    );
    const projectedLng =
        lngRad +
        Math.atan2(
            Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(latRad),
            Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(projectedLat),
        );

    return [(projectedLat * 180) / Math.PI, (projectedLng * 180) / Math.PI] as LatLng;
}

function generateConePoints(
    origin: LatLng,
    windDirection: number,
    coneAngleDeg: number,
    maxDistanceM: number,
): LatLng[] {
    const points: LatLng[] = [origin];

    // Wind blows FROM windDirection, so downwind direction is opposite
    const downwindDirection = (windDirection + 180) % 360;

    // Convert to radians
    const coneAngleRad = (coneAngleDeg * Math.PI) / 180;
    const downwindRad = (downwindDirection * Math.PI) / 180;

    // Number of points to approximate the arc (more points = smoother arc)
    const numArcPoints = 20;

    // Generate arc points at the max distance
    const halfAngle = coneAngleRad / 2;
    const startAngle = downwindRad - halfAngle;
    const endAngle = downwindRad + halfAngle;

    for (let i = 0; i <= numArcPoints; i++) {
        const t = i / numArcPoints;
        const angle = startAngle + t * (endAngle - startAngle);
        const bearingDeg = (angle * 180) / Math.PI;
        points.push(projectPoint(origin, bearingDeg, maxDistanceM));
    }

    // Close the polygon by returning to origin
    points.push(origin);

    return points;
}

export const SmokeCone = ({ origin, windDirection, windSpeedMs }: SmokeConeProps) => {
    const profile = useMemo(() => getDownwindProfile(windSpeedMs), [windSpeedMs]);
    const conePoints = useMemo(() => {
        if (!profile.isActive) {
            return [];
        }

        return generateConePoints(origin, windDirection, profile.coneAngleDeg, profile.maxDistanceM);
    }, [origin, windDirection, profile]);

    if (!profile.isActive) {
        return null;
    }

    return (
        <Polygon
            positions={conePoints}
            pathOptions={{
                color: "#f97316", // Orange
                fillColor: "#fb923c", // Light orange
                fillOpacity: 0.3,
                weight: 2,
                dashArray: "5, 5",
            }}
        />
    );
};
