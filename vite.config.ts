import { readFile } from "node:fs/promises";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const geoJsonPlugin = () => ({
    load: async (id: string) => {
        if (!id.endsWith(".geojson")) {
            return null;
        }

        const source = await readFile(id, "utf8");

        return `export default ${source};`;
    },
    name: "geojson-loader",
});

// https://vite.dev/config/
export default defineConfig({
    base: "./",
    plugins: [react(), geoJsonPlugin()],
});
