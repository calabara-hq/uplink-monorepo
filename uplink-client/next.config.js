/** @type {import('next').NextConfig} */

// https://vercel.com/docs/edge-network/caching#how-to-cache-responses
const edgeCacheHeader = {
  // key: "Vercel-CDN-Cache-Control",
  // value: "s-maxage=86400"
  key: 'dummy',
  value: 'dummy'
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
        source: "/submission/:submissionId",
        headers: [edgeCacheHeader]
      },
      {
        source: "/:name",
        headers: [edgeCacheHeader]
      },
      {
        source: "/:name/contest/:id",
        headers: [edgeCacheHeader]
      },
      {
        source: "/:name/contest/:id/submission/:submissionId",
        headers: [edgeCacheHeader]
      },
      {
        source: "/:name/contest/:id/studio",
        headers: [edgeCacheHeader]
      },
      {
        source: "/:name/contest/:id/vote",
        headers: [edgeCacheHeader]
      },
      {
        source: "/:name/contest/create",
        headers: [edgeCacheHeader]
      },
      {
        source: "/spacebuilder/create",
        headers: [edgeCacheHeader]
      },
      {
        source: "/spacebuilder/edit/[name]",
        headers: [edgeCacheHeader]
      },
      {
        source: "/spaces",
        headers: [edgeCacheHeader]
      },
    ]
  }
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})




module.exports = withBundleAnalyzer(nextConfig);
