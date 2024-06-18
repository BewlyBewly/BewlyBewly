import { defineConfig } from 'tsup'

import { isDev, isFirefox } from './scripts/utils'

export default defineConfig(() => ({
  entry: {
    'background/index': './src/background/index.ts',
    ...(isDev ? { mv3client: './scripts/client.ts' } : {}),
  },
  outDir: isFirefox ? 'extension-firefox/dist' : 'extension/dist',
  format: ['esm'],
  target: 'esnext',
  ignoreWatch: ['**/extension/**', '**/extension-firefox/**'],
  splitting: false,
  sourcemap: false, // https://github.com/vitejs/vite-plugin-vue/issues/35
  define: {
    '__DEV__': JSON.stringify(isDev),
    'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
    'process.env.FIREFOX': isFirefox ? 'true' : 'false',
  },
  platform: 'browser',
  minifyWhitespace: !isDev,
  minifySyntax: !isDev,
}))
