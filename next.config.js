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
    loader: "custom",
  },

  // images: {
  //   domains: ["restaurant-api.dicoding.dev/images/large"],
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "restaurant-api.dicoding.dev",
  //       port: "",
  //       pathname: "/images/large/**",
  //     },
  //   ],
  // },
  // https://restaurant-api.dicoding.dev/images/large/1
  exportPathMap: async function () {
    return {
      // "/tes": { page: "/" },
      // "/login": { page: "/auth/login" },
    };
  },
};

module.exports = nextConfig;
