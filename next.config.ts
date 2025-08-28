import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: '500mb',
  },
  experimental: {
    // This is to allow the development server to accept requests from the preview window.
    // In a future major version of Next.js, this will be the default behavior.
    allowedDevOrigins: [
        'https://*.cloudworkstations.dev',
        'https://*.firebase.studio'
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
