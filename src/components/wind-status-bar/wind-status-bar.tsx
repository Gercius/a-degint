import type { WindData } from "../../services/wind";
import { degreesToLithuanianDirection, formatTime } from "../../utils/wind";
import styles from "./wind-status-bar.module.scss";

interface WindStatusBarProps {
    wind: WindData | null;
    status: "idle" | "loading" | "success" | "error";
    error: string | null;
    lastUpdated: Date | null;
}

export const WindStatusBar = ({ wind, status, error, lastUpdated }: WindStatusBarProps) => {
    const isLoading = status === "loading";

    return (
        <div className={styles.windStatusBar}>
            <div className={styles.content}>
                {wind && (
                    <span className={styles.windInfo}>
                        Vėjas: {wind.wind_speed_10m.toFixed(1)} m/s · {Math.round(wind.wind_direction_10m)}°{" "}
                        {degreesToLithuanianDirection(wind.wind_direction_10m)}
                    </span>
                )}

                {status === "idle" && <span className={styles.status}>Laukiama duomenų...</span>}

                {isLoading && <span className={styles.loading}>Kraunama...</span>}

                {status === "error" && error && <span className={styles.error}>Klaida: {error}</span>}

                {lastUpdated && status !== "idle" && status !== "loading" && (
                    <span className={styles.updated}>Atnaujinta: {formatTime(lastUpdated)}</span>
                )}
            </div>
        </div>
    );
};
