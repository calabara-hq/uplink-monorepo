/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'calabara.mypinata.cloud',
        port: '',
      }
    ]
  }
}



module.exports = nextConfig
