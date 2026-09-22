// @ts-check
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
    trailingSlash: "always",
    output: "static",
    integrations: [icon()],
    vite: {
        plugins: [tailwindcss()],
    },
    fonts: [
        {
            provider: fontProviders.bunny(),
            name: "M PLUS Rounded 1c",
            cssVariable: "--font-m-plus-rounded-1c",
            fallbacks: ["Arial", "Helvetica Neue", "Helvetica", "sans-serif"],
            weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        },
    ],
    build: {
        assets: "assets",
    },
});
