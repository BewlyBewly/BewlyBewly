import { useStorageLocal } from '~/composables/useStorageLocal'
import { AppPage } from '~/enums/appEnums'
import { PageDockItem } from '~/models/dock'
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
}), { mergeDefaults: true })


export const pageDockItems = useStorageLocal('docks', ref<PageDockItem[]>([
  {
    i18nkey: 'dock.search',
    page: AppPage.Search,
    icon: 'tabler:search',
    visible: true
  },
  {
    i18nkey: 'dock.home',
    page: AppPage.Home,
    icon: 'tabler:home',
    visible: true
  },
  {
    i18nkey: 'dock.anime',
    page: AppPage.Anime,
    icon: 'tabler:device-tv',
    visible: true
  },
  {
    i18nkey: 'dock.history',
    page: AppPage.History,
    icon: 'tabler:clock',
    visible: true
  },
  {
    i18nkey: 'dock.favorites',
    page: AppPage.Favorites,
    icon: 'tabler:star',
    visible: true
  },
  {
    i18nkey: 'dock.watch_later',
    page: AppPage.WatchLater,
    icon: 'iconoir:playlist-play',
    visible: true
  }
]))