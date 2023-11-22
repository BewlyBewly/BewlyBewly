import { useStorageLocal } from '~/composables/useStorageLocal'
import { AppPage } from '~/enums/appEnums'
import type { Settings } from '~/models/models'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const accessKey = useStorageLocal('accessKey', '')

export const settings = useStorageLocal('settings', ref<Settings>({
  language: '',
  startupPage: AppPage.Home,
  isShowTopbar: true,
  dockPosition: 'right',
  enableHorizontalScrolling: false,
  openLinkInCurrentTab: false,

  autoHideTopbar: false,

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
