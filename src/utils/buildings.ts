export type LatLng = [number, number];

export interface GeoJsonProperties {
    [key: string]: unknown;
}

export interface GeoJsonGeometry {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][];
}

export interface GeoJsonFeature {
    type: "Feature";
    id: string;
    properties: GeoJsonProperties;
    geometry: GeoJsonGeometry;
}

export interface Building {
    id: string;
    label: string;
    center: LatLng;
    feature: GeoJsonFeature;
}

function getAddressPart(props: GeoJsonProperties, ...keys: string[]): string {
    for (const key of keys) {
        const value = props[key];
        if (value) {
            return String(value).trim();
        }
    }

    return "";
}

function getSortKey(label: string) {
    const [village = "", street = "", houseNumber = ""] = label.split(", ").map((part) => part.trim());
    const numberMatch = houseNumber.match(/^(\d+)/);

    return {
        village,
        street,
        houseNumber,
        houseNumberValue: numberMatch ? Number.parseInt(numberMatch[1], 10) : Number.POSITIVE_INFINITY,
    };
}

export function getBuildingCenter(feature: GeoJsonFeature): LatLng {
    const geometry = feature.geometry;
    if (geometry.type !== "Polygon") {
        throw new Error(`Unsupported geometry type: ${geometry.type}`);
    }

    const coordinates = geometry.coordinates[0];
    let sumLat = 0;
    let sumLng = 0;
    let count = 0;

    for (const coord of coordinates) {
        sumLng += coord[0];
        sumLat += coord[1];
        count++;
    }

    return [sumLat / count, sumLng / count];
}

export function extractAddresses(features: GeoJsonFeature[]): Building[] {
    const buildings: Building[] = [];

    for (const feature of features) {
        const props = feature.properties;
        const hasHousenumber = "addr:housenumber" in props;
        const hasHouseNumber = "addr:house_number" in props;

        if (!hasHousenumber && !hasHouseNumber) {
            continue;
        }

        const houseNumber = hasHousenumber ? String(props["addr:housenumber"]).trim() : String(props["addr:house_number"]).trim();
        const street = getAddressPart(props, "addr:street");
        const village = getAddressPart(props, "addr:village", "addr:city", "addr:hamlet", "addr:suburb");

        const parts = [village, street, houseNumber].filter(Boolean);
        const label = parts.join(", ");

        const center = getBuildingCenter(feature);

        buildings.push({
            id: feature.id,
            label,
            center,
            feature,
        });
    }

    return buildings;
}

export function sortBuildingsByLabel(buildings: Building[]): Building[] {
    return [...buildings].sort((a, b) => {
        const sortKeyA = getSortKey(a.label);
        const sortKeyB = getSortKey(b.label);

        const villageComparison = sortKeyA.village.localeCompare(sortKeyB.village, undefined, { sensitivity: "base" });
        if (villageComparison !== 0) {
            return villageComparison;
        }

        const streetComparison = sortKeyA.street.localeCompare(sortKeyB.street, undefined, { sensitivity: "base" });
        if (streetComparison !== 0) {
            return streetComparison;
        }

        if (sortKeyA.houseNumberValue !== sortKeyB.houseNumberValue) {
            return sortKeyA.houseNumberValue - sortKeyB.houseNumberValue;
        }

        return sortKeyA.houseNumber.localeCompare(sortKeyB.houseNumber, undefined, {
            numeric: true,
            sensitivity: "base",
        });
    });
}
