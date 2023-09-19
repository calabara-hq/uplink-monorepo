/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },

  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'calabara.mypinata.cloud',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'uplink.mypinata.cloud',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
        port: '',
      }
    ]
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
}



module.exports = nextConfig
