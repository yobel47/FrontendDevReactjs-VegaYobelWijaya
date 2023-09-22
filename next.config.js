const { env } = require("process");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',

  // Add basePath
  basePath: env.production && "/Restourant",

  images: {
    unoptimized: true,
  },
  // https://restaurant-api.dicoding.dev/images/large/1
};

module.exports = nextConfig;
