import { defineConfig } from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
    { ignores: ["dist"] },

    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: ["./tsconfig.app.json", "./tsconfig.node.json"],
                tsconfigRootDir: import.meta.dirname,
            },
            globals: globals.browser,
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "react-x": reactX,
            "react-dom": reactDom,
        },
        extends: [
            tseslint.configs.recommendedTypeChecked,
            reactX.configs["recommended-typescript"],
            reactDom.configs.recommended,
            react.configs.recommended,
            reactHooks.configs.recommended,
            prettier,
        ],
        rules: {
            "react/react-in-jsx-scope": "off",
            "react-refresh/only-export-components": "warn",
        },
        settings: {
            react: { version: "detect" },
        },
    },
]);
