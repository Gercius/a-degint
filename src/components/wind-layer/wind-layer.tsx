import { useMap, Marker as LeafletMarker } from "react-leaflet";
import { DivIcon } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import type { WindData } from "../../services/wind";
import { generateArrowGrid, windDegToArrowRotation, windSpeedToArrowScale } from "../../utils/wind-arrows";
import { WIND_ARROW_COLOR, WIND_ARROW_OPACITY, WIND_ARROW_GRID_COLS, WIND_ARROW_GRID_ROWS } from "../../config/map";
import styles from "./wind-layer.module.scss";

interface WindLayerProps {
    wind: WindData | null;
}

export const WindLayer = ({ wind }: WindLayerProps) => {
    const map = useMap();
    const [boundsVersion, setBoundsVersion] = useState(0);

    const positions = useMemo(() => {
        if (!map) return [];
        const bounds = map.getBounds();
        return generateArrowGrid(bounds, WIND_ARROW_GRID_COLS, WIND_ARROW_GRID_ROWS);
    }, [map, boundsVersion]);

    useEffect(() => {
        if (!map) return;

        const handleMove = () => {
            setBoundsVersion((v) => v + 1);
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
        const arrowSvg = `
            <svg viewBox="0 0 32 32" width="32" height="32">
                <path d="M14 15H9.5v-2.5L16 5l6.5 7.5V15H18v17h-4V15z" fill="${WIND_ARROW_COLOR}" fill-opacity="${WIND_ARROW_OPACITY}" />
            </svg>
        `;

        return new DivIcon({
            html: `<div class="${styles.arrowRotator}" style="transform: rotate(${rotation}deg) scale(${scale});"><div class="${styles.arrowMover}">${arrowSvg}</div></div>`,
            className: styles.arrowIcon,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
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
