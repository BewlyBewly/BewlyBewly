import { useStorageLocal } from '~/composables/useStorageLocal'
import type { AppPage } from '~/enums/appEnums'
import type { HomeSubPage } from '~/contentScripts/views/Home/types'

// TODO: refactor: implement storage functionality using pinia + useStorageLocal()

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const accessKey = useStorageLocal('accessKey', '')

export interface Settings {
  language: string
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
  homePageTabVisibilityList: { page: HomeSubPage, visible: boolean }[]
  useSearchPageModeOnHomePage: boolean
  searchPageModeWallpaperFixed: boolean
  alwaysShowTheTopBarLogoOnSearchPageMode: boolean

  adaptToOtherPageStyles: boolean
  showTopBar: boolean
  useOriginalBilibiliHomepage: boolean
}
export const settings = useStorageLocal('settings', ref<Settings>({
  language: '',
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
  disableFrostedGlass: false,
  reduceFrostedGlassBlur: false,
  dockItemVisibilityList: [],

  theme: 'auto',
  themeColor: '#00a1d6',
  wallpaperMode: 'buildIn',
  wallpaper: '',
  enableWallpaperMasking: false,
  wallpaperMaskOpacity: 80,
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
  homePageTabVisibilityList: [],
  useSearchPageModeOnHomePage: false,
  searchPageModeWallpaperFixed: false,
  alwaysShowTheTopBarLogoOnSearchPageMode: false,

  adaptToOtherPageStyles: true,
  showTopBar: true,
  useOriginalBilibiliHomepage: false,
}), { mergeDefaults: true })

export type GridLayout = 'adaptive' | 'twoColumns' | 'oneColumn'
export const homePageGridLayout = useStorageLocal('homePageGridLayout', ref<GridLayout>('adaptive'), { mergeDefaults: true })
