import { useStorageLocal } from '~/composables/useStorageLocal'
import type { AppPage } from '~/enums/appEnums'

// TODO: refactor: implement storage functionality using pinia + useStorageLocal()

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const accessKey = useStorageLocal('accessKey', '')

export interface Settings {
  language: string
  enableHorizontalScrolling: boolean
  openLinkInCurrentTab: boolean
  enableVideoCtrlBarOnVideoCard: boolean
  autoHideTopBar: boolean
  dockPosition: 'left' | 'right' | 'bottom'
  autoHideDock: boolean
  dockItemVisibilityList: { page: AppPage; visible: boolean }[]

  theme: 'light' | 'dark' | 'auto'
  themeColor: string
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

  adaptToOtherPageStyles: boolean
  showTopBar: boolean
  useOriginalBilibiliHomepage: boolean
}
export const settings = useStorageLocal('settings', ref<Settings>({
  language: '',
  enableHorizontalScrolling: false,
  openLinkInCurrentTab: false,
  enableVideoCtrlBarOnVideoCard: false,
  autoHideTopBar: false,
  dockPosition: 'right',
  autoHideDock: false,
  dockItemVisibilityList: [],

  theme: 'auto',
  themeColor: '#00a1d6',
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

  adaptToOtherPageStyles: true,
  showTopBar: true,
  useOriginalBilibiliHomepage: false,
}), { mergeDefaults: true })
