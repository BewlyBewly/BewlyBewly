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
}
