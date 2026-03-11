import { useMemo } from "react";
import { VillageMap } from "../components/village-map/village-map";
import { WindStatusBar } from "../components/wind-status-bar/wind-status-bar";
import { WindLayer } from "../components/wind-layer/wind-layer";
import { ControlPanel } from "../components/control-panel/control-panel";
import { HomeMarker } from "../components/home-marker/home-marker";
import { useHomeSelection } from "../hooks/use-home-selection";
import { extractAddresses, sortBuildingsByLabel } from "../utils/buildings";
import type { UseWindReturn } from "../hooks/use-wind";
import type { Building } from "../utils/buildings";

// Import GeoJSON (type assertion to access features array)
import villageBuildingsRaw from "../data/village-buildings.geojson";
const { features } = villageBuildingsRaw as any;

interface HomepageProps {
    windData: UseWindReturn;
}

export const Homepage = ({ windData }: HomepageProps) => {
    const { wind, status, error, lastUpdated } = windData;

    // Extract and sort buildings from GeoJSON (memoized to run only once)
    const buildings = useMemo<Building[]>(() => {
        const extracted = extractAddresses(features);
        return sortBuildingsByLabel(extracted);
    }, [features]);

    // Hook for home selection and downwind calculation
    const { selectedBuilding, setSelectedBuilding, downwindBuildings } = useHomeSelection(
        buildings,
        wind?.wind_direction_10m ?? null,
    );

    // Determine wind status for smoke warning
    const windStatus = (() => {
        if (status === "loading") return "loading";
        if (status === "error") return "error";
        if (status === "success" && wind) return "success";
        return "idle";
    })();

    return (
        <main className="app-shell">
            <WindStatusBar wind={wind} status={status} error={error} lastUpdated={lastUpdated} />
            <VillageMap>
                <WindLayer wind={wind} />
                <HomeMarker building={selectedBuilding} />
            </VillageMap>
            <ControlPanel
                buildings={buildings}
                selectedBuilding={selectedBuilding}
                onBuildingChange={setSelectedBuilding}
                downwindBuildings={downwindBuildings}
                windStatus={windStatus}
            />
        </main>
    );
};
