import { createHotContext as __vite__createHotContext } from "/dist/mv3client.mjs";import.meta.hot = __vite__createHotContext("/options/Options.vue");/* unplugin-vue-components disabled */import __unplugin_components_1 from '/@id/~icons/pixelarticons/zap.js';
import __unplugin_components_0 from '/@id/~icons/pixelarticons/sliders.js';
import { defineComponent, resolveComponent } from '/@fs/Coding Projects/Github Projects/BewlyBewly/node_modules/.vite/deps/vue.js';import { defineComponent as _defineComponent } from "/@fs/Coding Projects/Github Projects/BewlyBewly/node_modules/.vite/deps/vue.js";
import { storageDemo } from "/logic/storage.ts.js";
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "Options",
  setup(__props, { expose }) {
    expose();
    const __returned__ = { storageDemo };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
import { resolveComponent as _resolveComponent, createVNode as _createVNode, createElementVNode as _createElementVNode, vModelText as _vModelText, withDirectives as _withDirectives, createTextVNode as _createTextVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "/@fs/Coding Projects/Github Projects/BewlyBewly/node_modules/.vite/deps/vue.js";
const _hoisted_1 = { class: "px-4 py-10 text-center text-gray-700 dark:text-gray-200" };
const _hoisted_2 = /* @__PURE__ */ _createElementVNode("div", null, "Options", -1);
const _hoisted_3 = /* @__PURE__ */ _createElementVNode("p", { class: "mt-2 opacity-50" }, " This is the options page ", -1);
const _hoisted_4 = { class: "mt-4" };
const _hoisted_5 = /* @__PURE__ */ _createTextVNode(" Powered by Vite ");
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_pixelarticons_sliders = __unplugin_components_0;
  const _component_pixelarticons_zap = __unplugin_components_1;
  return _openBlock(), _createElementBlock("main", _hoisted_1, [
    _createVNode(_component_pixelarticons_sliders, { class: "icon-btn mx-2 text-2xl" }),
    _hoisted_2,
    _hoisted_3,
    _withDirectives(_createElementVNode("input", {
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.storageDemo = $event),
      class: "border border-gray-400 rounded px-2 py-1 mt-2"
    }, null, 512), [
      [_vModelText, $setup.storageDemo]
    ]),
    _createElementVNode("div", _hoisted_4, [
      _hoisted_5,
      _createVNode(_component_pixelarticons_zap, { class: "align-middle" })
    ])
  ]);
}
_sfc_main.__hmrId = "0a1a4722";
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main);
import.meta.hot.accept(({ default: updated, _rerender_only }) => {
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render);
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated);
  }
});
import _export_sfc from "/@id/plugin-vue.export-helper.js";
export default /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/Coding Projects/Github Projects/BewlyBewly/src/options/Options.vue"]]);
