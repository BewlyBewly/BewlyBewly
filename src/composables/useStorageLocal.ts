import { storage } from 'webextension-polyfill'
import {
  useStorageAsync,
  StorageLikeAsync,
  MaybeRef,
  StorageAsyncOptions,
  RemovableRef,
} from '@vueuse/core'

const storageLocal: StorageLikeAsync = {
  removeItem(key: string) {
    return storage.local.remove(key)
  },

  setItem(key: string, value: string) {
    return storage.local.set({ [key]: value })
  },

  async getItem(key: string) {
    return (await storage.local.get(key))[key]
  },
}

export const useStorageLocal = <T>(
  key: string,
  initialValue: MaybeRef<T>,
  options?: StorageAsyncOptions<T>,
): RemovableRef<T> => useStorageAsync(key, initialValue, storageLocal, options)
