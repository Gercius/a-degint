import { z } from "zod";
import { VILLAGE_CENTER, OPEN_METEO_BASE_URL } from "../config/map";

const WindDataSchema = z.object({
    wind_speed_10m: z.number(),
    wind_direction_10m: z.number(),
});

export type WindData = z.infer<typeof WindDataSchema>;

export class WindFetchError extends Error {
    cause?: Error;

    constructor(message: string, cause?: Error) {
        super(message);
        this.name = "WindFetchError";
        this.cause = cause;
    }
}

const OpenMeteoResponseSchema = z.object({
    current: z.object({
        wind_speed_10m: z.number(),
        wind_direction_10m: z.number(),
    }),
});

export async function fetchWindData(signal?: AbortSignal): Promise<WindData> {
    const [lat, lon] = VILLAGE_CENTER;
    const url = `${OPEN_METEO_BASE_URL}?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms`;

    try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
            throw new WindFetchError(`Open-Meteo request failed: ${response.status} ${response.statusText}`);
        }

        const data: unknown = await response.json();
        const parsed = OpenMeteoResponseSchema.parse(data);

        return WindDataSchema.parse(parsed.current);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new WindFetchError("Wind data validation failed", error);
        }
        if (error instanceof WindFetchError) {
            throw error;
        }
        throw new WindFetchError("Network error while fetching wind data", error as Error);
    }
}
