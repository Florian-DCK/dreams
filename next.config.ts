import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Autoriser HTTP
        hostname: 'books.google.com', // Domaine de l'API Google Books
        pathname: '/books/content/**', // Chemin des images
      },
      {
        protocol: 'https', // Autoriser HTTPS
        hostname: 'books.google.com',
        pathname: '/books/content/**',
      },
    ],
  },
};

export default nextConfig;
