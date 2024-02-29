const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  jsonc: false,
  rules: {
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 5,
        },
        multiline: {
          max: 5,
        },
      },
    ],
    'style/quote-props': 'off',
  },
  eslint: {
    ignorePatterns: [
      'dist',
      'node_modules',
      'public',
      'extension',
      'extension-firefox',
    ],
  },
})
