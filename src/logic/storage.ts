import { useStorageLocal } from '~/composables/useStorageLocal'
import { AppPage } from '~/enums/appEnums'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const language = useStorageLocal('language', '')
export const isShowTopbar = useStorageLocal('isShowTopbar', ref<boolean>(true))
export const accessKey = useStorageLocal('accessKey', '')
export const activatedPage = useStorageLocal('activatedPage', ref<AppPage>(AppPage.Home))
