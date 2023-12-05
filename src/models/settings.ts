import type { AppPage } from '~/enums/appEnums'

export interface Settings {
  language: string
  startupPage: AppPage
  enableHorizontalScrolling: boolean
  openLinkInCurrentTab: boolean
  enableVideoCtrlBarOnVideoCard: boolean
  isShowTopbar: boolean
  autoHideTopbar: boolean
  dockPosition: 'left' | 'right' | 'bottom'
  autoHideDock: boolean

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
