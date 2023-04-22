export const resetCss = `
/**
  * this stylesheet is used to reset the styles of the bilibili default style
  */

:root {
  --bew-bg: hsl(220, 14%, 96%);

  // --band_blue: var(--bew-theme-color);
  // --text1: var(--bew-text-1);
  // --text2: var(--bew-text-2);
  // --text3: var(--bew-text-3);
  // --bg1: var(--bew-content-1);
  // --bg2: var(--bew-content-1);
  // --bg3: var(--bew-content-1);
  // --line-light: var(--bew-fill-2);
  // --line_regular: var(--bew-fill-3);
  // --line_bold: var(--bew-fill-4);
}

:root.dark {
  --bew-bg: hsl(230 12% 6%);
}

html,
body {
  font-size: 14px !important;
  min-width: unset !important;
}

html, body {
  background-color: var(--bew-bg);
}
a,
a:hover {
  color: unset;
}

/*
// button {
//   border: unset;
//   background: unset;

//   &:focus,
//   &:active {
//     background: currentColor;
//   }
// }*/

/* hide the original home page */
.login-tip {
  display: none;
}

body > #i_cecream,
#i_cecream *,
#app {
  position: absolute;
  top: 200vh;
  visibility: hidden !important;
  width: 0;
  height: 0;
  overflow: hidden !important;
  pointer-events: none !important;
  display: none;
}
`
