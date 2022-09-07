import { createHotContext as __vite__createHotContext } from "/dist/mv3client.mjs";import.meta.hot = __vite__createHotContext("/styles/reset.scss");import { updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle } from "/dist/mv3client.mjs"
const __vite__id = "E:/Coding Projects/Github Projects/BewlyBewly/src/styles/reset.scss"
const __vite__css = "html, body {\n  font-size: 14px;\n  min-width: unset;\n}\na, a:hover {\n  color: unset;\n}\nbutton {\n  border: unset;\n  background: unset;\n}\nbutton:focus, button:active {\n  background: currentColor;\n}\n.login-tip {\n  display: none;\n}\nbody > #i_cecream, #i_cecream * {\n  position: absolute;\n  top: 200vh;\n  visibility: hidden !important;\n  width: 0;\n  height: 0;\n  overflow: hidden !important;\n  pointer-events: none !important;\n}"
__vite__updateStyle(__vite__id, __vite__css)
import.meta.hot.accept()
export default __vite__css
import.meta.hot.prune(() => __vite__removeStyle(__vite__id))