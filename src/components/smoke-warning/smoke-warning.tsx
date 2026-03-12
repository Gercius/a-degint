import type { Building } from "../../utils/buildings";
import styles from "./smoke-warning.module.scss";

interface SmokeWarningProps {
    selectedBuilding: Building | null;
    downwindBuildings: Building[];
    windStatus: "idle" | "loading" | "success" | "error";
}

export function SmokeWarning({ selectedBuilding, downwindBuildings, windStatus }: SmokeWarningProps) {
    // No selection - show prompt
    if (!selectedBuilding) {
        return (
            <div className={styles.smokeWarning}>
                <p className={styles.prompt}>Pasirinkite savo namą norėdami matyti įspėjimus</p>
            </div>
        );
    }

    // Wind data loading
    if (windStatus === "loading") {
        return (
            <div className={styles.smokeWarning}>
                <p className={styles.loading}>Tikrinama dūmų paeiga...</p>
            </div>
        );
    }

    // Wind error - don't show false warnings
    if (windStatus === "error") {
        return (
            <div className={styles.smokeWarning}>
                <p className={styles.error}>Negalima apskaičiuoti dūmų paeigos</p>
            </div>
        );
    }

    // Success state - evaluate downwind buildings
    if (downwindBuildings.length === 0) {
        return (
            <div className={styles.smokeWarning}>
                <p className={styles.safe}>Dūmai greičiausiai nepasieks kaimynų namų</p>
            </div>
        );
    }

    // Warning state - show generic warning (affected houses marked red on map)
    return (
        <div className={styles.smokeWarning}>
            <p className={styles.warning}>
                Dūmai gali pasiekti kaimynų namus! Raudonos spalvos žymėjimas žemėlapyje rodo namus, kurie gali būti
                paveikti.
            </p>
        </div>
    );
}
