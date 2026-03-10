import type { LatLngBoundsExpression, PathOptions, StyleFunction } from "leaflet";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import villageBuildings from "../../data/village-buildings.geojson";
import styles from "./village-map.module.scss";

const VILLAGE_CENTER: [number, number] = [54.8746054, 24.51654165];
const VILLAGE_BOUNDS: LatLngBoundsExpression = [
    [54.8684759, 24.5071891],
    [54.8807349, 24.5268942],
];

const MAP_MIN_ZOOM = 15;
const MAP_MAX_ZOOM = 18;
const MAP_DEFAULT_ZOOM = MAP_MIN_ZOOM;
const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_LAYER_ATTRIBUTION =
    "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors";
const BUILDING_STYLE: PathOptions = {
    color: "#4c5b4f",
    fillColor: "#8fa691",
    fillOpacity: 0.35,
    weight: 1,
};

const buildingStyle: StyleFunction = () => BUILDING_STYLE;

export const VillageMap = () => {
    return (
        <MapContainer
            center={VILLAGE_CENTER}
            className={styles.map}
            maxBounds={VILLAGE_BOUNDS}
            maxBoundsViscosity={1}
            maxZoom={MAP_MAX_ZOOM}
            minZoom={MAP_MIN_ZOOM}
            scrollWheelZoom
            zoom={MAP_DEFAULT_ZOOM}
        >
            <TileLayer
                attribution={TILE_LAYER_ATTRIBUTION}
                url={TILE_LAYER_URL}
            />
            <GeoJSON data={villageBuildings} style={buildingStyle} />
        </MapContainer>
    );
};
