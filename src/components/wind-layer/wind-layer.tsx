import { useMap, Marker as LeafletMarker } from "react-leaflet";
import { DivIcon } from "leaflet";
import { useEffect, useMemo } from "react";
import type { WindData } from "../../services/wind";
import { generateArrowGrid, windDegToArrowRotation, windSpeedToArrowScale } from "../../utils/wind-arrows";
import { WIND_ARROW_COLOR, WIND_ARROW_OPACITY, WIND_ARROW_GRID_COLS, WIND_ARROW_GRID_ROWS } from "../../config/map";
import styles from "./wind-layer.module.scss";

interface WindLayerProps {
    wind: WindData | null;
}

export const WindLayer = ({ wind }: WindLayerProps) => {
    const map = useMap();

    const positions = useMemo(() => {
        if (!map) return [];
        const bounds = map.getBounds();
        return generateArrowGrid(bounds, WIND_ARROW_GRID_COLS, WIND_ARROW_GRID_ROWS);
    }, [map]);

    useEffect(() => {
        if (!map) return;

        const handleMove = () => {
            // Force re-render by updating positions
            // This is handled by the useMemo dependency on map
        };

        map.on("moveend", handleMove);
        return () => {
            map.off("moveend", handleMove);
        };
    }, [map]);

    if (!wind) {
        return null;
    }

    const rotation = windDegToArrowRotation(wind.wind_direction_10m);
    const scale = windSpeedToArrowScale(wind.wind_speed_10m);

    const createArrowIcon = (): DivIcon => {
        const arrowSvg = (
            <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                style={{
                    transform: `rotate(${rotation}deg) scale(${scale})`,
                    transition: "transform 0.5s ease",
                }}
            >
                <path
                    d="M12 2L4 14l8 2 8-2-8-2z"
                    fill={WIND_ARROW_COLOR}
                    fillOpacity={WIND_ARROW_OPACITY}
                    stroke="none"
                />
            </svg>
        );

        return new DivIcon({
            html: `<div class="${styles.arrow}">${arrowSvg}</div>`,
            className: styles.arrowIcon,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });
    };

    return (
        <>
            {positions.map((position) => (
                <LeafletMarker
                    key={`${position.lat}-${position.lng}`}
                    position={position}
                    icon={createArrowIcon()}
                    interactive={false}
                    zIndexOffset={100}
                />
            ))}
        </>
    );
};
