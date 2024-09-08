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
  videoCardLinkOpenMode: 'drawer' | 'newTab'
  enableVideoPreview: boolean
  enableVideoCtrlBarOnVideoCard: boolean
  hoverVideoCardDelayed: boolean
  blockAds: boolean
  disableFrostedGlass: boolean
  reduceFrostedGlassBlur: boolean

  // Desktop & Dock
  useOldTopBar: boolean
  topBarLinkOpenMode: 'currentTab' | 'currentTabIfNotHomepage' | 'newTab'
  autoHideTopBar: boolean
  topBarIconBadges: 'number' | 'dot' | 'none'
  dockPosition: 'left' | 'right' | 'bottom'
  autoHideDock: boolean
  dockItemVisibilityList: { page: AppPage, visible: boolean }[]
  disableLightDarkModeSwitcherOnDock: boolean
  moveBackToTopOrRefreshButtonToDock: boolean

  theme: 'light' | 'dark' | 'auto'
  themeColor: string
  useLinearGradientThemeColorBackground: boolean
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
  disableFilterForFollowedUser: boolean
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
export const settings = useStorageLocal('settings', ref<Settings>({
  language: '',
  enableGridLayoutSwitcher: true,
  enableHorizontalScrolling: false,

  disableFrostedGlass: true,
  reduceFrostedGlassBlur: false,

  blockAds: false,

  videoCardLinkOpenMode: 'newTab',
  enableVideoPreview: true,
  enableVideoCtrlBarOnVideoCard: false,
  hoverVideoCardDelayed: false,

  // Desktop & Dock
  useOldTopBar: false,
  topBarLinkOpenMode: 'currentTabIfNotHomepage',
  autoHideTopBar: false,
  topBarIconBadges: 'number',
  dockPosition: 'right',
  autoHideDock: false,
  dockItemVisibilityList: [],
  disableLightDarkModeSwitcherOnDock: false,
  moveBackToTopOrRefreshButtonToDock: true,

  theme: 'auto',
  themeColor: '#00a1d6',
  useLinearGradientThemeColorBackground: false,
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
  disableFilterForFollowedUser: false,
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
}), { mergeDefaults: true })

export type GridLayout = 'adaptive' | 'twoColumns' | 'oneColumn'
export const homePageGridLayout = useStorageLocal('homePageGridLayout', ref<GridLayout>('adaptive'), { mergeDefaults: true })
