const CARDINAL_DIRECTIONS = [
    { dir: "N", min: 348.75, max: 11.25 },
    { dir: "NNE", min: 11.25, max: 33.75 },
    { dir: "NE", min: 33.75, max: 56.25 },
    { dir: "ENE", min: 56.25, max: 78.75 },
    { dir: "E", min: 78.75, max: 101.25 },
    { dir: "ESE", min: 101.25, max: 123.75 },
    { dir: "SE", min: 123.75, max: 146.25 },
    { dir: "SSE", min: 146.25, max: 168.75 },
    { dir: "S", min: 168.75, max: 191.25 },
    { dir: "SSW", min: 191.25, max: 213.75 },
    { dir: "SW", min: 213.75, max: 236.25 },
    { dir: "WSW", min: 236.25, max: 258.75 },
    { dir: "W", min: 258.75, max: 281.25 },
    { dir: "WNW", min: 281.25, max: 303.75 },
    { dir: "NW", min: 303.75, max: 326.25 },
    { dir: "NNW", min: 326.25, max: 348.75 },
];

export function degreesToCardinal(deg: number): string {
    const normalized = ((deg % 360) + 360) % 360;
    for (const { dir, min, max } of CARDINAL_DIRECTIONS) {
        if (min < max) {
            if (normalized >= min && normalized < max) {
                return dir;
            }
        } else {
            if (normalized >= min || normalized < max) {
                return dir;
            }
        }
    }
    return "N";
}

export function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}
