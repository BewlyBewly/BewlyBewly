import { useStorageLocal } from "/composables/useStorageLocal.ts.js";
export const storageDemo = useStorageLocal("webext-demo", "Storage Demo", { listenToStorageChanges: true });
export const language = useStorageLocal("language", "", { listenToStorageChanges: true });
export const isShowTopbar = useStorageLocal("isShowTopbar", true, { listenToStorageChanges: true });
export const accessKey = useStorageLocal("accessKey", "", { listenToStorageChanges: true });
