import { useState, useEffect, useMemo } from "react";
import type { Building } from "../utils/buildings";
import { getDownwindBuildings } from "../utils/downwind";

const STORAGE_KEY = "adegint_home_id";

export interface UseHomeSelectionReturn {
    selectedBuilding: Building | null;
    setSelectedBuilding: (building: Building | null) => void;
    downwindBuildings: Building[];
}

export function useHomeSelection(buildings: Building[], windDirection: number | null): UseHomeSelectionReturn {
    // Initialize from localStorage
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(() => {
        const storedId = localStorage.getItem(STORAGE_KEY);
        if (!storedId || buildings.length === 0) {
            return null;
        }
        return buildings.find((b) => b.id === storedId) || null;
    });

    // Persist selection to localStorage
    useEffect(() => {
        if (selectedBuilding) {
            localStorage.setItem(STORAGE_KEY, selectedBuilding.id);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [selectedBuilding]);

    // Derive downwind buildings
    const downwindBuildings = useMemo(() => {
        if (!selectedBuilding || windDirection === null) {
            return [];
        }
        return getDownwindBuildings(selectedBuilding, buildings, windDirection);
    }, [selectedBuilding, windDirection, buildings]);

    return {
        selectedBuilding,
        setSelectedBuilding,
        downwindBuildings,
    };
}
