import type { Building } from "../../utils/buildings";
import { AddressSelector } from "../address-selector/address-selector";
import { SmokeWarning } from "../smoke-warning/smoke-warning";
import styles from "./control-panel.module.scss";

interface ControlPanelProps {
    buildings: Building[];
    selectedBuilding: Building | null;
    onBuildingChange: (building: Building | null) => void;
    downwindBuildings: Building[];
    windStatus: "idle" | "loading" | "success" | "error";
}

export function ControlPanel({
    buildings,
    selectedBuilding,
    onBuildingChange,
    downwindBuildings,
    windStatus,
}: ControlPanelProps) {
    return (
        <div className={styles.controlPanel}>
            <AddressSelector buildings={buildings} selected={selectedBuilding} onChange={onBuildingChange} />
            <SmokeWarning
                selectedBuilding={selectedBuilding}
                downwindBuildings={downwindBuildings}
                windStatus={windStatus}
            />
        </div>
    );
}
