/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
 
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,
 
  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,
 
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
  
  // Add basePath
  basePath: '/Restourant',

  images: {
   remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yobel47.github.io',
        port: '',
        pathname: '/Restourant/**',
      },
    ],
  }
}

module.exports = nextConfig
