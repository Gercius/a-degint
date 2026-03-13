const MIN_ACTIVE_WIND_SPEED_MS = 1; // Below this, direction is unreliable
const PROFILE_MIN_WIND_SPEED_MS = MIN_ACTIVE_WIND_SPEED_MS;
const PROFILE_MAX_WIND_SPEED_MS = 12;

// At very low wind, smoke disperses radially — use a circle instead of cone
const MIN_DOWNWIND_CONE_ANGLE_DEG = 30;
const MAX_DOWNWIND_CONE_ANGLE_DEG = 90; // Wider at low speed to compensate for directional uncertainty

const MIN_DOWNWIND_DISTANCE_M = 250;
const MAX_DOWNWIND_DISTANCE_M = 2000;

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function interpolate(start: number, end: number, progress: number) {
    return start + (end - start) * progress;
}

function getWindProfileProgress(windSpeedMs: number) {
    const clampedSpeed = clamp(windSpeedMs, PROFILE_MIN_WIND_SPEED_MS, PROFILE_MAX_WIND_SPEED_MS);
    const linear = (clampedSpeed - PROFILE_MIN_WIND_SPEED_MS) / (PROFILE_MAX_WIND_SPEED_MS - PROFILE_MIN_WIND_SPEED_MS);
    return Math.sqrt(linear); // Fast initial narrowing, slower at high speeds
}

export interface DownwindProfile {
    isActive: boolean;
    coneAngleDeg: number;
    maxDistanceM: number;
}

export function getDownwindProfile(windSpeedMs: number): DownwindProfile {
    if (windSpeedMs < MIN_ACTIVE_WIND_SPEED_MS) {
        return { isActive: false, coneAngleDeg: 0, maxDistanceM: 0 };
    }

    const progress = getWindProfileProgress(windSpeedMs);

    return {
        isActive: true,
        coneAngleDeg: interpolate(MAX_DOWNWIND_CONE_ANGLE_DEG, MIN_DOWNWIND_CONE_ANGLE_DEG, progress),
        maxDistanceM: interpolate(MIN_DOWNWIND_DISTANCE_M, MAX_DOWNWIND_DISTANCE_M, progress * progress),
    };
}
