const daisyui = require('daisyui')
const plugin = require('tailwindcss/plugin')

module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                customYellow: '#FCF4DB',
                customDarkYellow: '#FFD66B',
                customPink: '#FCEAE9',
                customPurple: '#CA54C9',
                customGreen: '#A0D468',
                customLightGreen: '#E9FFE5',
                customRed: '#DC2823',
                customGray: '#807A7A',
                customBlue: '#F3F4FF',
                customOrange: '#F5AD35',
                customBlueBorder: '#B5B8FF',
            },
            fontFamily: {
                ourFont: ['TTHakgyoansimMonggeulmonggeulR'],
                storyFont: ['Nanum Myeongjo', 'serif'],
            },
            boxShadow: {
                customShadow: '0 2px 2px 0 #C4B6B5',
                customDeepShadow: '4px 4px 4px 0 #C4B6B5',
                innerShadow: 'inset -8px -8px 8px rgba(0, 0, 0, 0.3)',
            },
            animation: {
                wiggle: 'wiggle 1s ease-in-out infinite',
                bounce: 'bounce 0.8s infinite',
                autoPlay: 'autoPlay 10s linear infinite',
            },
        },
        keyframes: {
            wiggle: {
                '0%, 100%': { transform: 'rotate(-6deg)' },
                '50%': { transform: 'rotate(6deg)' },
            },
            bounce: {
                '0%, 100%': {
                    transform: 'translateY(-10%)',
                    'animation-timing-function': 'cubic-bezier(0.8,0,1,1)',
                },
                '50%': {
                    transform: 'none',
                    'animation-timing-function': 'cubic-bezier(0,0,0.2,1)',
                },
            },
            autoPlay: {
                '0%': {
                    transition: 'translateX(0)',
                },
                '100%': {
                    transform: 'translateX(calc(-250px * 7))',
                },
            },
        },
    },
    plugins: [daisyui],
}
