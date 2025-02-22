import browser from 'webextension-polyfill'

import { injectCSS } from '~/utils/main'

injectCSS(`
  @font-face {
    font-family: "Onest";
    src: url(${browser.runtime.getURL('/assets/fonts/Onest-VF.ttf')}) format("truetype-variations");
  }

  @font-face {
    font-family: "ShangguSans";
    src: url(${browser.runtime.getURL('/assets/fonts/ShangguSansHWSC-VF.ttf')}) format("truetype-variations");
  }
`)
