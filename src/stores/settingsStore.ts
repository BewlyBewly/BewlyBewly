import { defineStore } from 'pinia'
import { useStorageLocal } from '~/composables/useStorageLocal'
import type { AppPage } from '~/enums/appEnums'
import type { HomeSubPage } from '~/contentScripts/views/Home/types'

interface Settings {
  language: string
  enableHorizontalScrolling: boolean
  openLinkInCurrentTab: boolean
  enableVideoCtrlBarOnVideoCard: boolean
  showTopBar: boolean
  autoHideTopBar: boolean
  dockPosition: 'left' | 'right' | 'bottom'
  autoHideDock: boolean
  dockItemVisibilityList: { page: AppPage, visible: boolean }[]

  theme: 'light' | 'dark' | 'auto'
  themeColor: string
  adaptToOtherPageStyles: boolean
  wallpaperMode: 'buildIn' | 'byUrl'
  wallpaper: string
  enableWallpaperMasking: boolean
  wallpaperMaskOpacity: number
  wallpaperBlurIntensity: number

  searchPageDarkenOnSearchFocus: boolean
  searchPageBlurredOnSearchFocus: boolean
  searchPageLogoColor: 'white' | 'themeColor'
  searchPageLogoGlow: boolean
  searchPageShowLogo: boolean
  searchPageSearchBarFocusCharacter: string
  individuallySetSearchPageWallpaper: boolean
  searchPageWallpaperMode: 'buildIn' | 'byUrl'
  searchPageWallpaper: string
  searchPageEnableWallpaperMasking: boolean
  searchPageWallpaperMaskOpacity: number
  searchPageWallpaperBlurIntensity: number

  recommendationMode: 'web' | 'app'
  useSearchPageModeOnHomePage: boolean
  searchPageModeWallpaperFixed: boolean
  homePageTabVisibilityList: { page: HomeSubPage, visible: boolean }[]
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = useStorageLocal('settings', ref<Settings>({
    language: '',
    enableHorizontalScrolling: false,
    openLinkInCurrentTab: false,
    enableVideoCtrlBarOnVideoCard: false,
    showTopBar: true,
    autoHideTopBar: false,
    dockPosition: 'right',
    autoHideDock: false,
    dockItemVisibilityList: [],

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
    homePageTabVisibilityList: [],
  }), { mergeDefaults: true })

  function updateSettingsItem<T extends keyof Settings>(key: T, value: Settings[T]) {
    settings.value[key] = value
  }
  return { settings, updateSettingsItem }
})
