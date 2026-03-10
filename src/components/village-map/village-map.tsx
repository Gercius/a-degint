import { divIcon, type LatLngBoundsExpression, type PathOptions, type StyleFunction } from "leaflet";
import type { FeatureCollection, GeoJsonProperties, MultiPolygon, Polygon } from "geojson";
import { GeoJSON, MapContainer, Marker, ScaleControl, TileLayer } from "react-leaflet";
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
const HOUSE_NUMBER_CLASS = styles["house-number"];

type BuildingGeometry = Polygon | MultiPolygon;
type BuildingFeature = FeatureCollection<BuildingGeometry, GeoJsonProperties>["features"][number];

const getBuildingLabel = (feature: BuildingFeature) => {
    const houseNumber = feature.properties?.["addr:housenumber"];

    return typeof houseNumber === "string" ? houseNumber : null;
};

const getRingCenter = (coordinates: number[][]) => {
    const [firstPoint] = coordinates;

    if (!firstPoint) {
        return null;
    }

    let minLng = firstPoint[0];
    let maxLng = firstPoint[0];
    let minLat = firstPoint[1];
    let maxLat = firstPoint[1];

    for (const [lng, lat] of coordinates) {
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
    }

    return [(minLat + maxLat) / 2, (minLng + maxLng) / 2] as [number, number];
};

const getBuildingCenter = (feature: BuildingFeature) => {
    if (feature.geometry.type === "Polygon") {
        return getRingCenter(feature.geometry.coordinates[0] ?? []);
    }

    return getRingCenter(feature.geometry.coordinates[0]?.[0] ?? []);
};

const houseNumberMarkers = (villageBuildings as FeatureCollection<BuildingGeometry, GeoJsonProperties>).features
    .map((feature) => {
        const label = getBuildingLabel(feature);
        const position = getBuildingCenter(feature);

        if (!label || !position) {
            return null;
        }

        return {
            id: feature.id ?? feature.properties?.["@id"] ?? `${label}-${position[0]}-${position[1]}`,
            label,
            position,
        };
    })
    .filter((marker): marker is NonNullable<typeof marker> => marker !== null);

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
            {houseNumberMarkers.map((marker) => (
                <Marker
                    interactive={false}
                    key={marker.id}
                    position={marker.position}
                    
                    icon={divIcon({
                        className: HOUSE_NUMBER_CLASS,
                        html: marker.label,
                    })}
                />
            ))}
            <ScaleControl position="bottomright" />
        </MapContainer>
    );
};
