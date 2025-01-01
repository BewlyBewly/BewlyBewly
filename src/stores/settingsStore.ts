import { defineStore } from 'pinia'

import type { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'

export interface DockItemConfig {
  page: AppPage
  visible: boolean
  openInNewTab: boolean
  useOriginalBiliPage: boolean
}

export const useSettingsStore = defineStore('settings', () => {
  function getDockItemConfigByPage(page: AppPage): DockItemConfig | undefined {
    return settings.value.dockItemsConfig.find(e => e.page === page)
  }

  function getDockItemIsUseOriginalBiliPage(page: AppPage): boolean {
    return settings.value.dockItemsConfig.find(e => e.page === page)?.useOriginalBiliPage || false
  }

  return { getDockItemConfigByPage, getDockItemIsUseOriginalBiliPage }
})
