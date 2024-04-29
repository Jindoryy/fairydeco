const daisyui = require('daisyui')

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
                customPink: '#FCEAE9',
                customPurple: '#CA54C9',
                customGreen: '#A1C09F',
                customRed: '#DC2823',
                customGray: '#807A7A',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            fontFamily: {
                ourFont: ['TTHakgyoansimMonggeulmonggeulR'],
            },
        },
    },
    plugins: [daisyui],
}
