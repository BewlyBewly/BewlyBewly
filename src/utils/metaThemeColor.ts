import { isHomePage } from './main'

export const isSafari
  = navigator.userAgent.includes('Safari')
  && !navigator.userAgent.includes('Chrome')

const metaTheme = document.createElement('meta')

export function updateMetaThemeColor(isDark: boolean) {
  if (isSafari && isHomePage()) {
    if (!document.head.contains(metaTheme)) {
      document.head.appendChild(metaTheme)
      metaTheme.name = 'theme-color'
    }
    metaTheme.content = isDark ? '#101112' : '#f2f2f8'
  }
}
