import { VillageMap } from "../components/village-map/village-map";
import { WindStatusBar } from "../components/wind-status-bar/wind-status-bar";
import { WindLayer } from "../components/wind-layer/wind-layer";
import type { UseWindReturn } from "../hooks/use-wind";

interface HomepageProps {
    windData: UseWindReturn;
}

export const Homepage = ({ windData }: HomepageProps) => {
    const { wind, status, error, lastUpdated, refresh } = windData;

    return (
        <main className="app-shell">
            <WindStatusBar wind={wind} status={status} error={error} lastUpdated={lastUpdated} onRefresh={refresh} />
            <VillageMap>
                <WindLayer wind={wind} />
            </VillageMap>
        </main>
    );
};
