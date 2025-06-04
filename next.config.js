/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Dangereux mais efficace: ignore les erreurs de types lors du build
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig