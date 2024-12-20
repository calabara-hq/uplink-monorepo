/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  experimental: {
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
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
}



const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})




module.exports = withBundleAnalyzer(nextConfig);