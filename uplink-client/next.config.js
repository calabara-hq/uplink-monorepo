/** @type {import('next').NextConfig} */

const edgeCacheHeader = {
  key: "Vercel-CDN-Cache-Control",
  value: "s-maxage=86400"
}

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: true,
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
  async headers() {
    return [
      {
        source: "/",
        headers: [edgeCacheHeader]
      },
      {
        source: "/spaces",
        headers: [edgeCacheHeader]
      },
      {
        source: "/:name",
        headers: [edgeCacheHeader]
      }
    ]
  }
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})




module.exports = withBundleAnalyzer(nextConfig);
