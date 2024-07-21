import { useStorageLocal } from '~/composables/useStorageLocal'
import type { wallpaperItem } from '~/constants/imgs'
import type { HomeSubPage } from '~/contentScripts/views/Home/types'
import type { AppPage } from '~/enums/appEnums'

// TODO: refactor: implement storage functionality using pinia + useStorageLocal()

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const accessKey = useStorageLocal('accessKey', '')

export interface Settings {
  language: string
  enableGridLayoutSwitcher: boolean
  enableHorizontalScrolling: boolean
  openLinkInCurrentTab: boolean
  enableVideoPreview: boolean
  enableVideoCtrlBarOnVideoCard: boolean
  hoverVideoCardDelayed: boolean
  autoHideTopBar: boolean
  topBarIconBadges: 'number' | 'dot' | 'none'
  blockAds: boolean
  disableFrostedGlass: boolean
  reduceFrostedGlassBlur: boolean
  dockPosition: 'left' | 'right' | 'bottom'
  autoHideDock: boolean
  dockItemVisibilityList: { page: AppPage, visible: boolean }[]
  disableLightDarkModeSwitcherOnDock: boolean
  moveBackToTopOrRefreshButtonToDock: boolean

  theme: 'light' | 'dark' | 'auto'
  themeColor: string
  wallpaperMode: 'buildIn' | 'byUrl'
  wallpaper: string
  enableWallpaperMasking: boolean
  wallpaperMaskOpacity: number
  wallpaperBlurIntensity: number
  locallyUploadedWallpaper: wallpaperItem | null

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
  // filter setting
  enableFilterByViewCount: boolean
  filterByViewCount: number
  enableFilterByDuration: boolean
  filterByDuration: number
  homePageTabVisibilityList: { page: HomeSubPage, visible: boolean }[]
  alwaysShowTabsOnHomePage: boolean
  useSearchPageModeOnHomePage: boolean
  searchPageModeWallpaperFixed: boolean

  adaptToOtherPageStyles: boolean
  showTopBar: boolean
  useOriginalBilibiliHomepage: boolean
}
export const settings = useStorageLocal('settings', ref<Settings>({
  language: '',
  enableGridLayoutSwitcher: true,
  enableHorizontalScrolling: false,
  openLinkInCurrentTab: false,
  enableVideoPreview: true,
  enableVideoCtrlBarOnVideoCard: false,
  hoverVideoCardDelayed: false,
  autoHideTopBar: false,
  topBarIconBadges: 'number',
  dockPosition: 'right',
  autoHideDock: false,
  blockAds: false,
  disableFrostedGlass: true,
  reduceFrostedGlassBlur: false,
  dockItemVisibilityList: [],
  disableLightDarkModeSwitcherOnDock: false,
  moveBackToTopOrRefreshButtonToDock: false,

  theme: 'auto',
  themeColor: '#00a1d6',
  wallpaperMode: 'buildIn',
  wallpaper: '',
  enableWallpaperMasking: false,
  wallpaperMaskOpacity: 80,
  wallpaperBlurIntensity: 0,
  locallyUploadedWallpaper: null,

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
  // filter setting
  enableFilterByViewCount: false,
  filterByViewCount: 10000,
  enableFilterByDuration: false,
  filterByDuration: 3600,

  homePageTabVisibilityList: [],
  alwaysShowTabsOnHomePage: false,
  useSearchPageModeOnHomePage: false,
  searchPageModeWallpaperFixed: false,

  adaptToOtherPageStyles: true,
  showTopBar: true,
  useOriginalBilibiliHomepage: false,
}), { mergeDefaults: true })

export type GridLayout = 'adaptive' | 'twoColumns' | 'oneColumn'
export const homePageGridLayout = useStorageLocal('homePageGridLayout', ref<GridLayout>('adaptive'), { mergeDefaults: true })
