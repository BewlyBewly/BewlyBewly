import { presetAttributify, presetIcons, presetTypography, presetUno, transformerDirectives } from 'unocss'
import { defineConfig } from 'unocss/vite'

const remRE = /(-?[.\d]+)rem/g

export default defineConfig({
  content: {
    pipeline: {
      include: [
        '**/*.{js,ts}',
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
      ],
    },
  },
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

    {
      name: 'text-size-transformer',
      postprocess: (util) => {
        util.entries.forEach((i) => {
          const value = i[1]

          if (typeof value === 'string' && remRE.test(value)) {
            i[1] = value.replace(remRE, (_, num: number) => {
              return `calc(var(--bew-base-font-size) * ${num})`
            })
          }
        })
      },
    },
  ],
  transformers: [
    transformerDirectives(),
  ],
})
