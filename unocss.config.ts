import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetTypography, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
  ],
  shortcuts: {
    'backdrop-glass': 'backdrop-blur-20px backdrop-saturate-180%',
  },
})
