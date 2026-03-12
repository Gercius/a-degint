import { Marker } from "react-leaflet";
import { DivIcon } from "leaflet";
import type { Building } from "../../utils/buildings";
import styles from "./home-marker.module.scss";

interface HomeMarkerProps {
    building: Building | null;
}

export const HomeMarker = ({ building }: HomeMarkerProps) => {
    if (!building) {
        return null;
    }

    const createHomeIcon = (): DivIcon => {
        const houseSvg = `
            <svg viewBox="0 0 24 24" width="28" height="28">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#16a34a" stroke="#15803d" stroke-width="1.5"/>
            </svg>
        `;

        return new DivIcon({
            html: `<div class="${styles.homeMarker}">${houseSvg}</div>`,
            className: styles.homeMarkerIcon,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28],
        });
    };

    return <Marker position={building.center} icon={createHomeIcon()} interactive={false} zIndexOffset={200} />;
};
