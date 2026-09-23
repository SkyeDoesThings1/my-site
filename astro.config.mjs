// @ts-check
import vercel from "@astrojs/vercel";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import { cacheVercel } from "@astrojs/vercel/cache";

// https://astro.build/config
export default defineConfig({
    site: "https://skyedoesthings1.github.io/",
    base: "/",
    trailingSlash: "always",
    integrations: [icon()],
    output: "server",
    adapter: vercel(),
    cache: {
        provider: cacheVercel(),
    },
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
    image: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.scdn.co",
            },
        ],
    },
});
