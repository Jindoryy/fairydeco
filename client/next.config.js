const nextConfig = {
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://fairydeco.site/api",
    },
  };

module.exports = nextConfig
