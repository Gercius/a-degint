const LITHUANIAN_DIRECTIONS = [
    { dir: "Šiaurės", min: 337.5, max: 22.5 },
    { dir: "Šiaurės Rytų", min: 22.5, max: 67.5 },
    { dir: "Rytų", min: 67.5, max: 112.5 },
    { dir: "Pietryčių", min: 112.5, max: 157.5 },
    { dir: "Pietų", min: 157.5, max: 202.5 },
    { dir: "Pietvakarių", min: 202.5, max: 247.5 },
    { dir: "Vakarų", min: 247.5, max: 292.5 },
    { dir: "Šiaurės Vakarų", min: 292.5, max: 337.5 },
];

export function degreesToLithuanianDirection(deg: number): string {
    const normalized = ((deg % 360) + 360) % 360;
    for (const { dir, min, max } of LITHUANIAN_DIRECTIONS) {
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
    return "Šiaurės";
}

export function formatTime(date: Date): string {
    return date.toLocaleTimeString("lt-LT", {
        hour: "2-digit",
        minute: "2-digit",
    });
}
