import { defineStore } from 'pinia'
import { useStorageLocal } from '~/composables/useStorageLocal'
import { AppPage } from '~/enums/appEnums'
import type { Settings } from '~/models/settings'

export const useSettingsStore = defineStore('settings', () => {
  const settings = useStorageLocal('settings', reactive<Settings>({
    language: '',
    startupPage: AppPage.Home,
    enableHorizontalScrolling: false,
    openLinkInCurrentTab: false,
    enableVideoCtrlBarOnVideoCard: false,
    isShowTopbar: true,
    autoHideTopbar: false,
    dockPosition: 'right',
    autoHideDock: false,

    theme: 'auto',
    themeColor: '#00a1d6',
    adaptToOtherPageStyles: true,
    wallpaperMode: 'buildIn',
    wallpaper: '',
    enableWallpaperMasking: false,
    wallpaperMaskOpacity: 0,
    wallpaperBlurIntensity: 0,

    searchPageDarkenOnSearchFocus: true,
    searchPageBlurredOnSearchFocus: false,
    searchPageLogoColor: 'themeColor',
    searchPageLogoGlow: true,
    searchPageShowLogo: true,
    searchPageSearchBarFocusCharacter: '',
    individuallySetSearchPageWallpaper: false,
    searchPageWallpaperMode: 'buildIn',
    searchPageWallpaper: '',
    searchPageEnableWallpaperMasking: false,
    searchPageWallpaperMaskOpacity: 0,
    searchPageWallpaperBlurIntensity: 0,

    recommendationMode: 'web',
    useSearchPageModeOnHomePage: false,
    searchPageModeWallpaperFixed: false,
  }), { mergeDefaults: true })

  function updateSettingsItem(key: string, value: any) {
    (settings as any)[key] = value
  }
})
