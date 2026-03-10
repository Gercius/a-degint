declare module "*.geojson" {
    import type { GeoJsonObject } from "geojson";

    const data: GeoJsonObject;

    export default data;
}
