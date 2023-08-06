export interface Settings {
  language: string
  isShowTopbar: boolean
  dockPosition: 'left' | 'right' | 'bottom'
  enableHorizontalScrolling: boolean
  themeColor: string
  recommendationMode: 'web' | 'app'
  wallpaperMode: 'buildIn' | 'byUrl'
  wallpaper: string
  enableWallpaperMasking: boolean
  wallpaperMaskOpacity: number
  wallpaperBlurIntensity: number

  searchPageDarkenOnSearchFocus: boolean
  searchPageLogoColor: 'white' | 'themeColor'
  searchPageShowLogo: boolean
  individuallySetSearchPageWallpaper: boolean
  searchPageWallpaperMode: 'buildIn' | 'byUrl'
  searchPageWallpaper: string
  searchPageEnableWallpaperMasking: boolean
  searchPageWallpaperMaskOpacity: number
  searchPageWallpaperBlurIntensity: number
}
