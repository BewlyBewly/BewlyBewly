import { useStorageLocal } from '~/composables/useStorageLocal'
import { AppPage } from '~/enums/appEnums'
import type { Settings } from '~/models/models'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const accessKey = useStorageLocal('accessKey', '')
export const activatedPage = useStorageLocal('activatedPage', ref<AppPage>(AppPage.Home))

export const settings = useStorageLocal('settings', ref<Settings>({
  language: '',
  isShowTopbar: true,
  dockPosition: 'right',
  enableHorizontalScrolling: false,
  themeColor: '#00a1d6',
  recommendationMode: 'web',
  wallpaperMode: 'buildIn',
  wallpaper: '',
  enableWallpaperMasking: false,
  wallpaperMaskOpacity: 0,
  wallpaperBlurIntensity: 0,

  searchPageLogoColor: 'themeColor',
  searchPageShowLogo: true,
  individuallySetSearchPageWallpaper: false,
  searchPageWallpaperMode: 'buildIn',
  searchPageWallpaper: '',
  searchPageEnableWallpaperMasking: false,
  searchPageWallpaperMaskOpacity: 0,
  searchPageWallpaperBlurIntensity: 0,
}), { mergeDefaults: true })
