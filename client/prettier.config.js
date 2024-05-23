const config = {
    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
    singleQuote: true,
}

module.exports = {
    ...config,
    plugins: ['prettier-plugin-tailwindcss'],
}
