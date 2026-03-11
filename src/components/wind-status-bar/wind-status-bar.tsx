import type { WindData } from "../../services/wind";
import { degreesToCardinal, formatTime } from "../../utils/wind";
import styles from "./wind-status-bar.module.scss";

interface WindStatusBarProps {
    wind: WindData | null;
    status: "idle" | "loading" | "success" | "error";
    error: string | null;
    lastUpdated: Date | null;
    onRefresh: () => void;
}

export const WindStatusBar = ({ wind, status, error, lastUpdated, onRefresh }: WindStatusBarProps) => {
    const isLoading = status === "loading";

    return (
        <div className={styles.windStatusBar}>
            <div className={styles.content}>
                {wind && (
                    <span className={styles.windInfo}>
                        Wind: {wind.wind_speed_10m.toFixed(1)} m/s · {Math.round(wind.wind_direction_10m)}°{" "}
                        {degreesToCardinal(wind.wind_direction_10m)}
                    </span>
                )}

                {status === "idle" && <span className={styles.status}>Waiting for data...</span>}

                {isLoading && <span className={styles.loading}>Loading...</span>}

                {status === "error" && error && <span className={styles.error}>Error: {error}</span>}

                {lastUpdated && status !== "idle" && status !== "loading" && (
                    <span className={styles.updated}>Last updated: {formatTime(lastUpdated)}</span>
                )}
            </div>

            <button
                className={styles.refreshButton}
                onClick={onRefresh}
                disabled={isLoading}
                aria-label="Refresh wind data"
                type="button"
            >
                🔄
            </button>
        </div>
    );
};
