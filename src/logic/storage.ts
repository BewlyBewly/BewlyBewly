import { useStorageLocal } from '~/composables/useStorageLocal'
import { AppPage } from '~/enums/appEnums'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo', { listenToStorageChanges: true })
export const language = useStorageLocal('language', '', { listenToStorageChanges: true })
export const isShowTopbar = useStorageLocal('isShowTopbar', ref<boolean>(true), { listenToStorageChanges: true })
export const accessKey = useStorageLocal('accessKey', '', { listenToStorageChanges: true })
export const activatedPage = useStorageLocal('activatedPage', ref<AppPage>(AppPage.Home), { listenToStorageChanges: true })
