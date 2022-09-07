import { createHotContext as __vite__createHotContext } from "/dist/mv3client.mjs";import.meta.hot = __vite__createHotContext("/components/Logo.vue");/* unplugin-vue-components disabled */import __unplugin_components_0 from '/@id/~icons/pixelarticons/power.js';
import { resolveComponent } from '/@fs/Coding Projects/Github Projects/BewlyBewly/node_modules/.vite/deps/vue.js';import IconAccessibility from '/@id/~icons/carbon/accessibility.js'
import IconAccountBox from '/@id/~icons/mdi/account-box.js'

const _sfc_main = {
  __name: 'Logo',
  setup(__props, { expose }) {
  expose();


const __returned__ = { IconAccessibility, IconAccountBox }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}
import { resolveComponent as _resolveComponent, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "/@fs/Coding Projects/Github Projects/BewlyBewly/node_modules/.vite/deps/vue.js"

const _hoisted_1 = {
  class: "icon-btn mx-2 text-2xl",
  rel: "noreferrer",
  href: "https://github.com/antfu/vitesse-webext",
  target: "_blank",
  title: "GitHub"
}

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_pixelarticons_power = __unplugin_components_0
  const _component_user_line = _resolveComponent("user-line")

  return (_openBlock(), _createElementBlock("a", _hoisted_1, [
    _createVNode(_component_pixelarticons_power),
    _createVNode(_component_user_line)
  ]))
}


_sfc_main.__hmrId = "05d4cbf4"
typeof __VUE_HMR_RUNTIME__ !== 'undefined' && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main)
import.meta.hot.accept(({ default: updated, _rerender_only }) => {
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)
  }
})
import _export_sfc from '/@id/plugin-vue.export-helper.js'
export default /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__file',"E:/Coding Projects/Github Projects/BewlyBewly/src/components/Logo.vue"]])