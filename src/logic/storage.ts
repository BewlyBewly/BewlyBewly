import { useStorageLocal } from '~/composables/useStorageLocal'
import type { wallpaperItem } from '~/constants/imgs'
import type { HomeSubPage } from '~/contentScripts/views/Home/types'
import type { AppPage } from '~/enums/appEnums'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const accessKey = useStorageLocal('accessKey', '')

export interface Settings {
  touchScreenOptimization: boolean
  enableGridLayoutSwitcher: boolean
  enableHorizontalScrolling: boolean

  language: string
  customizeFont: boolean
  fontFamily: string
  overrideDanmakuFont: boolean
  removeTheIndentFromChinesePunctuation: boolean
  disableFrostedGlass: boolean
  reduceFrostedGlassBlur: boolean

  enableVideoPreview: boolean

  // Link Opening Behavior
  videoCardLinkOpenMode: 'drawer' | 'newTab'
  topBarLinkOpenMode: 'currentTab' | 'currentTabIfNotHomepage' | 'newTab'
  searchBarLinkOpenMode: 'currentTab' | 'currentTabIfNotHomepage' | 'newTab'
  closeDrawerWithoutPressingEscAgain: boolean

  blockAds: boolean

  enableVideoCtrlBarOnVideoCard: boolean
  hoverVideoCardDelayed: boolean

  // Desktop & Dock
  useOldTopBar: boolean
  autoHideTopBar: boolean
  topBarIconBadges: 'number' | 'dot' | 'none'
  dockPosition: 'left' | 'right' | 'bottom'
  autoHideDock: boolean
  dockItemVisibilityList: { page: AppPage, visible: boolean }[]
  disableLightDarkModeSwitcherOnDock: boolean
  moveBackToTopOrRefreshButtonToDock: boolean
  sidebarPosition: 'left' | 'right'
  autoHideSidebar: boolean

  theme: 'light' | 'dark' | 'auto'
  themeColor: string
  useLinearGradientThemeColorBackground: boolean
  wallpaperMode: 'buildIn' | 'byUrl'
  wallpaper: string
  enableWallpaperMasking: boolean
  wallpaperMaskOpacity: number
  wallpaperBlurIntensity: number
  locallyUploadedWallpaper: wallpaperItem | null

  customizeCSS: boolean
  customizeCSSContent: string

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
  disableFilterForFollowedUser: boolean
  filterOutVerticalVideos: boolean
  enableFilterByViewCount: boolean
  filterByViewCount: number
  enableFilterByDuration: boolean
  filterByDuration: number
  enableFilterByTitle: boolean
  filterByTitle: { keyword: string, remark: string }[]
  enableFilterByUser: boolean
  filterByUser: { keyword: string, remark: string }[]

  homePageTabVisibilityList: { page: HomeSubPage, visible: boolean }[]
  alwaysShowTabsOnHomePage: boolean
  useSearchPageModeOnHomePage: boolean
  searchPageModeWallpaperFixed: boolean

  adaptToOtherPageStyles: boolean
  showTopBar: boolean
  useOriginalBilibiliTopBar: boolean
  useOriginalBilibiliHomepage: boolean
}

export const originalSettings: Settings = {
  touchScreenOptimization: false,
  enableGridLayoutSwitcher: true,
  enableHorizontalScrolling: false,

  language: '',
  customizeFont: false,
  fontFamily: '',
  overrideDanmakuFont: true,
  removeTheIndentFromChinesePunctuation: false,

  disableFrostedGlass: true,
  reduceFrostedGlassBlur: false,

  // Link Opening Behavior
  videoCardLinkOpenMode: 'newTab',
  topBarLinkOpenMode: 'currentTabIfNotHomepage',
  searchBarLinkOpenMode: 'currentTabIfNotHomepage',
  closeDrawerWithoutPressingEscAgain: false,

  blockAds: false,

  enableVideoPreview: true,
  enableVideoCtrlBarOnVideoCard: false,
  hoverVideoCardDelayed: false,

  // Desktop & Dock
  useOldTopBar: false,
  autoHideTopBar: false,
  topBarIconBadges: 'number',
  dockPosition: 'right',
  autoHideDock: false,
  dockItemVisibilityList: [],
  disableLightDarkModeSwitcherOnDock: false,
  moveBackToTopOrRefreshButtonToDock: true,
  sidebarPosition: 'right',
  autoHideSidebar: false,

  theme: 'auto',
  themeColor: '#00a1d6',
  useLinearGradientThemeColorBackground: false,
  wallpaperMode: 'buildIn',
  wallpaper: '',
  enableWallpaperMasking: false,
  wallpaperMaskOpacity: 80,
  wallpaperBlurIntensity: 0,
  locallyUploadedWallpaper: null,

  customizeCSS: false,
  customizeCSSContent: '',

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
  disableFilterForFollowedUser: false,
  filterOutVerticalVideos: false,
  enableFilterByViewCount: false,
  filterByViewCount: 10000,
  enableFilterByDuration: false,
  filterByDuration: 3600,
  enableFilterByTitle: false,
  filterByTitle: [],
  enableFilterByUser: false,
  filterByUser: [],

  homePageTabVisibilityList: [],
  alwaysShowTabsOnHomePage: false,
  useSearchPageModeOnHomePage: false,
  searchPageModeWallpaperFixed: false,

  adaptToOtherPageStyles: true,
  showTopBar: true,
  useOriginalBilibiliTopBar: false,
  useOriginalBilibiliHomepage: false,
}

export const settings = useStorageLocal('settings', ref<Settings>(originalSettings), { mergeDefaults: true })

export type GridLayoutType = 'adaptive' | 'twoColumns' | 'oneColumn'

export interface GridLayout {
  home: GridLayoutType
}

export const gridLayout = useStorageLocal('gridLayout', ref<GridLayout>({
  home: 'adaptive',
}), { mergeDefaults: true })

export const sidePanel = useStorageLocal('sidePanel', ref<{
  home: boolean
}>({
  home: true,
}), { mergeDefaults: true })
