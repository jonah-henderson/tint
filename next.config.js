/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/boards", permanent: false }
    ]
  }
}

module.exports = nextConfig
