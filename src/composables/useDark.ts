import { usePreferredDark } from '@vueuse/core'

import { settings } from '~/logic'

export function useDark() {
  const isPreferredDark = usePreferredDark()
  const currentSystemColorScheme = computed(() => isPreferredDark.value ? 'dark' : 'light')
  const currentAppColorScheme = computed((): 'dark' | 'light' => {
    if (settings.value.theme !== 'auto')
      return settings.value.theme
    else
      return currentSystemColorScheme.value
  })
  const isDark = computed(() => currentAppColorScheme.value === 'dark')

  // Watch for changes in the 'settings.value.theme' variable and add the 'dark' class to the 'mainApp' element
  // to prevent some Unocss dark-specific styles from failing to take effect
  watch(
    () => [settings.value.theme, isPreferredDark.value],
    () => {
      setAppAppearance()
    },
    { immediate: true },
  )

  /**
   * Watch for changes in the 'settings.value.theme' variable and add the 'dark' class to the 'mainApp' element
   * to prevent some Unocss dark-specific styles from failing to take effect
   */
  function setAppAppearance() {
    if (isDark.value) {
      document.querySelector('#bewly')?.classList.add('dark')
      document.documentElement.classList.add('dark')
    }
    else {
      document.querySelector('#bewly')?.classList.remove('dark')
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleDark(e: MouseEvent) {
    const updateThemeSettings = () => {
      if (currentAppColorScheme.value !== currentSystemColorScheme.value)
        settings.value.theme = 'auto'
      else
        settings.value.theme = isPreferredDark.value ? 'light' : 'dark'
    }

    const isAppearanceTransition = typeof document !== 'undefined'
    // @ts-expect-error: Transition API
      && document.startViewTransition
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isAppearanceTransition) {
      updateThemeSettings()
    }
    else {
      const x = e.clientX
      const y = e.clientY
      const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      )
      // https://github.com/vueuse/vueuse/pull/3129
      const style = document.createElement('style')
      const styleString = `
            *, *::before, *::after
            {-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
      style.appendChild(document.createTextNode(styleString))
      document.head.appendChild(style)

      // Since the above normal dom style cannot be applied in shadow dom style
      // We need to add this style again to the shadow dom
      const shadowDomStyle = document.createElement('style')
      const shadowDomStyleString = `
            *, *::before, *::after
            {-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important; will-change: background}`
      shadowDomStyle.appendChild(document.createTextNode(shadowDomStyleString))

      const bewlyShadowRoot = document.getElementById('bewly')?.shadowRoot
      const bewlyWrapper = bewlyShadowRoot?.getElementById('bewly-wrapper')
      if (!bewlyWrapper)
        throw new Error('mainAppRef is not found')

      bewlyWrapper.appendChild(shadowDomStyle)

      // @ts-expect-error: Transition API
      const transition = document.startViewTransition(async () => {
        updateThemeSettings()
        await nextTick()
      })

      transition.ready.then(() => {
        const clipPath = [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
        ]
        const animation = document.documentElement.animate(
          {
            clipPath: currentAppColorScheme.value === 'dark'
              ? [...clipPath].reverse()
              : clipPath,
          },
          {
            duration: 300,
            easing: 'ease-in-out',
            pseudoElement: currentAppColorScheme.value === 'dark'
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
          },
        )
        animation.addEventListener('finish', () => {
          document.head.removeChild(style!)
          bewlyWrapper.removeChild(shadowDomStyle!)
        }, { once: true })
      })
    }
  }

  return {
    isDark,
    toggleDark,
  }
}
