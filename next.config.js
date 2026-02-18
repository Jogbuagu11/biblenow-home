/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Allow importing assets from outside the `web/` directory (monorepo).
    externalDir: true,
  },
  images: {
    domains: [
      'localhost',
      'supabase.co',
      '*.supabase.co',
      '*.supabase.in',
      // Add your Supabase project domain here
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: '/api/:path*' },
      { source: '/favicon.png', destination: '/roundlogo.png' },
      { source: '/favicon.ico', destination: '/roundlogo.png' },
    ];
  },
};

module.exports = nextConfig;
