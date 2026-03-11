import { useEffect } from "react";
import { type LatLng, type Layer, type PathOptions, type StyleFunction } from "leaflet";
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry, MultiPolygon, Polygon } from "geojson";
import { GeoJSON, MapContainer, ScaleControl, TileLayer, useMapEvents } from "react-leaflet";
import villageBuildings from "../../data/village-buildings.geojson";
import styles from "./village-map.module.scss";
import {
    VILLAGE_BOUNDS,
    VILLAGE_CENTER,
    MAP_MIN_ZOOM,
    MAP_MAX_ZOOM,
    MAP_DEFAULT_ZOOM,
    TILE_LAYER_URL,
    TILE_LAYER_ATTRIBUTION,
} from "../../config/map";

const HOUSE_NUMBER_MIN_ZOOM = 16;
const BUILDING_STYLE: PathOptions = {
    color: "#4c5b4f",
    fillColor: "#8fa691",
    fillOpacity: 0.35,
    weight: 1,
};

const buildingStyle: StyleFunction = () => BUILDING_STYLE;
const HOUSE_NUMBER_TOOLTIP_CLASS = styles.houseNumberTooltip;

type BuildingGeometry = Polygon | MultiPolygon;
type BuildingFeature = FeatureCollection<BuildingGeometry, GeoJsonProperties>["features"][number];
type BuildingCollection = FeatureCollection<BuildingGeometry, GeoJsonProperties>;

const buildingData = villageBuildings as BuildingCollection;

const getBuildingLabel = (feature: BuildingFeature) => {
    const houseNumber = feature.properties?.["addr:housenumber"];

    return typeof houseNumber === "string" ? houseNumber : null;
};

const isBuildingFeature = (feature: Feature<Geometry, GeoJsonProperties>): feature is BuildingFeature => {
    return feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon";
};

const getBuildingCenter = (_feature: BuildingFeature, layer: Layer): LatLng | null => {
    if (!("getBounds" in layer) || typeof layer.getBounds !== "function") {
        return null;
    }

    const bounds = layer.getBounds();

    if (!bounds.isValid()) {
        return null;
    }

    return bounds.getCenter();
};

const updateTooltipVisibility = (mapContainer: HTMLElement, zoomLevel: number) => {
    mapContainer.classList.toggle(styles.labelsHidden, zoomLevel < HOUSE_NUMBER_MIN_ZOOM);
};

const onEachBuilding = (feature: Feature<Geometry, GeoJsonProperties> | undefined, layer: Layer) => {
    if (!feature || !isBuildingFeature(feature)) {
        return;
    }

    const label = getBuildingLabel(feature);
    const center = getBuildingCenter(feature, layer);

    if (!label || !center) {
        return;
    }

    layer.bindTooltip(label, {
        className: HOUSE_NUMBER_TOOLTIP_CLASS,
        direction: "center",
        interactive: false,
        permanent: true,
        opacity: 1,
    });

    if ("getTooltip" in layer && typeof layer.getTooltip === "function") {
        layer.getTooltip()?.setLatLng(center);
    }
};

const TooltipVisibilityController = () => {
    const map = useMapEvents({
        zoomend: (event) => {
            updateTooltipVisibility(event.target.getContainer(), event.target.getZoom());
        },
    });

    useEffect(() => {
        updateTooltipVisibility(map.getContainer(), map.getZoom());
    }, [map]);

    return null;
};

interface VillageMapProps {
    children?: React.ReactNode;
}

export const VillageMap = ({ children }: VillageMapProps) => {
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
            <TileLayer attribution={TILE_LAYER_ATTRIBUTION} url={TILE_LAYER_URL} />
            <GeoJSON data={buildingData} onEachFeature={onEachBuilding} style={buildingStyle} />
            <TooltipVisibilityController />
            {children}
            <ScaleControl position="bottomright" />
        </MapContainer>
    );
};
