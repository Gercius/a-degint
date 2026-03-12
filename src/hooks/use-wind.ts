import { useEffect, useRef, useState, useCallback } from "react";
import type { WindData } from "../services/wind";
import { WindFetchError, fetchWindData } from "../services/wind";
import { WIND_REFRESH_INTERVAL_MS } from "../config/map";

type Status = "idle" | "loading" | "success" | "error";

export interface UseWindReturn {
    wind: WindData | null;
    status: Status;
    error: string | null;
    lastUpdated: Date | null;
    refresh: () => void;
}

export function useWind(): UseWindReturn {
    const [wind, setWind] = useState<WindData | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);
    const intervalIdRef = useRef<number | null>(null);

    const performFetch = useCallback(async (signal?: AbortSignal) => {
        try {
            setStatus("loading");
            setError(null);
            const result = await fetchWindData(signal);
            setWind(result.data);
            setLastUpdated(new Date(result.timestamp));
            setStatus("success");
        } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") {
                return;
            }
            if (err instanceof WindFetchError) {
                setError(err.message);
                setStatus("error");
            }
        }
    }, []);

    const refresh = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        performFetch(abortControllerRef.current.signal);
    }, [performFetch]);

    useEffect(() => {
        refresh();

        intervalIdRef.current = window.setInterval(() => {
            refresh();
        }, WIND_REFRESH_INTERVAL_MS);

        return () => {
            if (intervalIdRef.current) {
                window.clearInterval(intervalIdRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [refresh]);

    return {
        wind,
        status,
        error,
        lastUpdated,
        refresh,
    };
}
