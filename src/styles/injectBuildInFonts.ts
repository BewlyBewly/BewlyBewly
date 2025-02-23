import browser from 'webextension-polyfill'

import { injectCSS } from '~/utils/main'

injectCSS(`
  @font-face {
    font-family: "Numbers";
    unicode-range: U+0030-0039;
    src: url(${browser.runtime.getURL('/assets/fonts/Geist[wght].woff2')}) format("woff2-variations");
  }

  @font-face {
    font-family: "Onest";
    src: url(${browser.runtime.getURL('/assets/fonts/Onest[wght].woff2')}) format("woff2-variations");
  }

  @font-face {
    font-family: "ShangguSansSCVF";
    src: url(${browser.runtime.getURL('/assets/fonts/ShangguSansSC-VF.ttf')}) format("truetype-variations");
  }

  @font-face {
    font-family: "CJKEmDash";
    unicode-range: U+2014, U+2E3A-2E3B;
    src: url(${browser.runtime.getURL('/assets/fonts/ZhudouSansVF-subset.woff2')}) format("woff2-variations");
  }
`)
