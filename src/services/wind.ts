import { z } from "zod";
import { VILLAGE_CENTER, OPEN_METEO_BASE_URL, WIND_REFRESH_INTERVAL_MS } from "../config/map";

const WindDataSchema = z.object({
    wind_speed_10m: z.number(),
    wind_direction_10m: z.number(),
});

export type WindData = z.infer<typeof WindDataSchema>;

interface WindCache {
    timestamp: number;
    data: WindData;
}

export interface WindFetchResult {
    data: WindData;
    timestamp: number;
}

export class WindFetchError extends Error {
    cause?: Error;

    constructor(message: string, cause?: Error) {
        super(message);
        this.name = "WindFetchError";
        this.cause = cause;
    }
}

function isAbortError(error: unknown): error is DOMException {
    return error instanceof DOMException && error.name === "AbortError";
}

const OpenMeteoResponseSchema = z.object({
    current: z.object({
        wind_speed_10m: z.number(),
        wind_direction_10m: z.number(),
    }),
});

const windCacheSchema = z.object({
    timestamp: z.number(),
    data: WindDataSchema,
});

const WIND_CACHE_KEY = `wind_data:${VILLAGE_CENTER[0]}:${VILLAGE_CENTER[1]}`;

function readCachedWindData(): WindFetchResult | null {
    try {
        const cached = window.localStorage.getItem(WIND_CACHE_KEY);

        if (!cached) {
            return null;
        }

        const parsed: WindCache = windCacheSchema.parse(JSON.parse(cached));

        if (Date.now() - parsed.timestamp >= WIND_REFRESH_INTERVAL_MS) {
            return null;
        }

        return parsed;
    } catch {
        window.localStorage.removeItem(WIND_CACHE_KEY);
        return null;
    }
}

function writeCachedWindData(result: WindFetchResult) {
    try {
        window.localStorage.setItem(WIND_CACHE_KEY, JSON.stringify(result));
    } catch {
        // Ignore storage failures so the live fetch still succeeds.
    }
}

export async function fetchWindData(signal?: AbortSignal): Promise<WindFetchResult> {
    const [lat, lon] = VILLAGE_CENTER;
    const url = `${OPEN_METEO_BASE_URL}?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms`;

    const cached = readCachedWindData();
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
            throw new WindFetchError(`Open-Meteo request failed: ${response.status} ${response.statusText}`);
        }

        const data: unknown = await response.json();
        const parsed = OpenMeteoResponseSchema.parse(data);
        const result = {
            data: WindDataSchema.parse(parsed.current),
            timestamp: Date.now(),
        };

        writeCachedWindData(result);

        return result;
    } catch (error) {
        if (isAbortError(error)) {
            throw error;
        }
        if (error instanceof z.ZodError) {
            throw new WindFetchError("Wind data validation failed", error);
        }
        if (error instanceof WindFetchError) {
            throw error;
        }
        throw new WindFetchError("Network error while fetching wind data", error as Error);
    }
}
