import { defineStore } from 'pinia'
import { useStorageLocal } from '~/composables/useStorageLocal'
import { AppPage } from '~/enums/appEnums'

interface Settings {
  language: string
  enableHorizontalScrolling: boolean
  openLinkInCurrentTab: boolean
  enableVideoCtrlBarOnVideoCard: boolean
  isShowTopbar: boolean
  autoHideTopbar: boolean
  dockPosition: 'left' | 'right' | 'bottom'
  autoHideDock: boolean
  dockItemVisibilityList: { page: AppPage; visible: boolean }[]

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
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = useStorageLocal('settings', ref<Settings>({
    language: '',
    startupPage: AppPage.Home,
    enableHorizontalScrolling: false,
    openLinkInCurrentTab: false,
    enableVideoCtrlBarOnVideoCard: false,
    isShowTopbar: true,
    autoHideTopbar: false,
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
  }), { mergeDefaults: true })

  function updateSettingsItem<T extends keyof Settings>(key: T, value: Settings[T]) {
    settings.value[key] = value
  }
  return { settings, updateSettingsItem }
})
