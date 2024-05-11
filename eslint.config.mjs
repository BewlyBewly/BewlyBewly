import antfu from '@antfu/eslint-config'

export default antfu({
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
    'no-alert': 'off',
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
