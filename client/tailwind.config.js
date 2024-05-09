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
                customDarkYellow: '#FFD66B',
                customPink: '#FCEAE9',
                customPurple: '#CA54C9',
                customGreen: '#A0D468',
                customLigntGreen: '#E9FFE5',
                customRed: '#DC2823',
                customGray: '#807A7A',
                customBlue: '#F3F4FF',
                customOrange: '#F5AD35',
                customBlueBorder: '#B5B8FF',
            },
            fontFamily: {
                ourFont: ['TTHakgyoansimMonggeulmonggeulR'],
                storyFont: ['GowunDodumRegular'],
            },
            boxShadow: {
                customShadow: '0 2px 2px 0 #C4B6B5',
            },
        },
    },
    plugins: [daisyui],
}
