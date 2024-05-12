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
        {
          protocol: 'https',
          hostname: 'i.ytimg.com',
          port: '',
          pathname: '/**'
        },
        {
          protocol: 'https',
          hostname: 'thumbnail6.coupangcdn.com',
          port: '',
          pathname: '/**'
        },
        {
          protocol: 'https',
          hostname: 'mblogthumb-phinf.pstatic.net',
          port: '',
          pathname: '/**'
        },
        {
          protocol: 'https',
          hostname: 'www.book21.com',
          port: '',
          pathname: '/**'
        },
        {
          protocol: 'https',
          hostname: 'image.aladin.co.kr',
          port: '',
          pathname: '/**'
        },
        {
          protocol: 'https',
          hostname: 'kkoma.net',
          port: '',
          pathname: '/**'
        },
        {
          protocol: 'https',
          hostname: 'image.yes24.com',
          port: '',
          pathname: '/**'
        },
        
      ],
    }
  };

module.exports = nextConfig
