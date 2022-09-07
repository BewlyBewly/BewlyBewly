import { createHotContext as __vite__createHotContext } from "/dist/mv3client.mjs";import.meta.hot = __vite__createHotContext("/popup/Popup.vue");/* unplugin-vue-components disabled */import __unplugin_components_0 from '/components/Logo.vue.js';
import { defineComponent, resolveComponent } from '/@fs/Coding Projects/Github Projects/BewlyBewly/node_modules/.vite/deps/vue.js';import __vite__cjsImport2_webextensionPolyfill from "/@fs/Coding Projects/Github Projects/BewlyBewly/node_modules/.vite/deps/webextension-polyfill.js"; const browser = __vite__cjsImport2_webextensionPolyfill;import { storageDemo, isShowTopbar } from "/logic/storage.ts.js";
const _sfc_main = defineComponent({
  data() {
    return {
      isShowTopbar,
      storageDemo
    };
  },
  methods: {
    openOptionsPage() {
      browser.runtime.openOptionsPage();
    }
  }
});
import { resolveComponent as _resolveComponent, createVNode as _createVNode, createElementVNode as _createElementVNode, vModelCheckbox as _vModelCheckbox, withDirectives as _withDirectives, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, openBlock as _openBlock, createElementBlock as _createElementBlock, pushScopeId as _pushScopeId, popScopeId as _popScopeId } from "/@fs/Coding Projects/Github Projects/BewlyBewly/node_modules/.vite/deps/vue.js";
const _withScopeId = (n) => (_pushScopeId("data-v-261aa4cb"), n = n(), _popScopeId(), n);
const _hoisted_1 = { class: "w-[300px] px-4 py-5 text-center text-gray-700" };
const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ _createElementVNode("div", null, "BewlyBewly", -1));
const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ _createElementVNode("p", { class: "mt-2 opacity-50" }, " This is the popup page ", -1));
const _hoisted_4 = /* @__PURE__ */ _createTextVNode(" Disable topbar (Compatible with bilibili evolved) ");
const _hoisted_5 = { class: "mt-2" };
const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ _createElementVNode("span", { class: "opacity-50" }, "Storage:", -1));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Logo = __unplugin_components_0;
  return _openBlock(), _createElementBlock("main", _hoisted_1, [
    _createVNode(_component_Logo),
    _hoisted_2,
    _hoisted_3,
    _createElementVNode("div", null, [
      _hoisted_4,
      _withDirectives(_createElementVNode("input", {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.isShowTopbar = $event),
        type: "checkbox"
      }, null, 512), [
        [_vModelCheckbox, _ctx.isShowTopbar]
      ]),
      _createTextVNode(" " + _toDisplayString(_ctx.isShowTopbar), 1)
    ]),
    _createElementVNode("button", {
      class: "btn mt-2",
      onClick: _cache[1] || (_cache[1] = (...args) => _ctx.openOptionsPage && _ctx.openOptionsPage(...args))
    }, " Open Options "),
    _createElementVNode("div", _hoisted_5, [
      _hoisted_6,
      _createTextVNode(" " + _toDisplayString(_ctx.storageDemo), 1)
    ])
  ]);
}
import "/popup/Popup.vue.js_vue&type=style&index=0&scoped=true&lang.scss.js";
_sfc_main.__hmrId = "261aa4cb";
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main);
import.meta.hot.accept(({ default: updated, _rerender_only }) => {
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render);
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated);
  }
});
import _export_sfc from "/@id/plugin-vue.export-helper.js";
export default /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-261aa4cb"], ["__file", "E:/Coding Projects/Github Projects/BewlyBewly/src/popup/Popup.vue"]]);
