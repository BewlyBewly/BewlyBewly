import __vite__cjsImport0_webextensionPolyfill from "/@fs/Coding Projects/Github Projects/BewlyBewly/node_modules/.vite/deps/webextension-polyfill.js"; const storage = __vite__cjsImport0_webextensionPolyfill["storage"];
import {
  useStorageAsync
} from "/@fs/Coding Projects/Github Projects/BewlyBewly/node_modules/.vite/deps/@vueuse_core.js";
const storageLocal = {
  removeItem(key) {
    return storage.local.remove(key);
  },
  setItem(key, value) {
    return storage.local.set({ [key]: value });
  },
  async getItem(key) {
    return (await storage.local.get(key))[key];
  }
};
export const useStorageLocal = (key, initialValue, options) => useStorageAsync(key, initialValue, storageLocal, options);
