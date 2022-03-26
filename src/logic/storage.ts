import { useStorageLocal } from '~/composables/useStorageLocal'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo', { listenToStorageChanges: true })
export const isShowTopbar = useStorageLocal('isShowTopbar', true, { listenToStorageChanges: true })
export const apperance = useStorageLocal('apperance', 'automatic', { listenToStorageChanges: true })
export const accessKey = useStorageLocal('accessKey', '', { listenToStorageChanges: true })
