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

        const housenumber = hasHousenumber ? String(props["addr:housenumber"]) : String(props["addr:house_number"]);
        const street = props["addr:street"] || "";
        const city = props["addr:city"] || "";
        const postcode = props["addr:postcode"] || "";

        const parts = [housenumber, street, city, postcode].filter(Boolean);
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
        const extractNumber = (label: string): number => {
            const match = label.match(/^(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
        };

        const numA = extractNumber(a.label);
        const numB = extractNumber(b.label);

        if (numA !== numB) {
            return numA - numB;
        }

        return a.label.localeCompare(b.label);
    });
}
