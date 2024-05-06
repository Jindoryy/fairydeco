const nextConfig = {
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'fairydecos3.s3.ap-northeast-2.amazonaws.com',
          port: '',
          pathname: '/storybook-images/**',
        },
      ],
    }
  };

module.exports = nextConfig
