import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetTypography, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        'width': '1.2em',
        'height': '1.2em',
      },
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
