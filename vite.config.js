import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import reactRefresh from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            // Disable forced full page refresh; rely on Vite's HMR for React components
            refresh: false,
        }),
        tailwindcss(),
        reactRefresh(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
        },
    },
});
