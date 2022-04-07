import { useStorageLocal } from '~/composables/useStorageLocal'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo', { listenToStorageChanges: true })
export const language = useStorageLocal('language', 'en', { listenToStorageChanges: true })
export const isShowTopbar = useStorageLocal('isShowTopbar', true, { listenToStorageChanges: true })
export const accessKey = useStorageLocal('accessKey', '', { listenToStorageChanges: true })
