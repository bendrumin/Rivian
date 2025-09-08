/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['rivian.com', 'scoutmotors.com'],
  },
}

module.exports = nextConfig
