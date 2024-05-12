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
        {
          protocol: 'https',
          hostname: 'contents.kyobobook.co.kr',
          port: '',
          pathname: '/sih/**'
        },
        {
          protocol: 'https',
          hostname: 'cdn.crowdpic.net',
          port: '',
          pathname: '/**'
        },
        {
          protocol: 'https',
          hostname: 'bookthumb-phinf.pstatic.net',
          port: '',
          pathname: '/**'
        },
      ],
    }
  };

module.exports = nextConfig
