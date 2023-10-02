<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import { useI18n } from 'vue-i18n'
import browser from 'webextension-polyfill'
import type { Ref } from '@vue/runtime-dom'
import Home from './Home/Home.vue'
import Search from './Search/Search.vue'
import Anime from './Anime/Anime.vue'
import History from './History/History.vue'
import WatchLater from './WatchLater/WatchLater.vue'
import Favorites from './Favorites/Favorites.vue'
import { accessKey, settings } from '~/logic'
import '~/styles/index.ts'
import { AppPage, LanguageType } from '~/enums/appEnums'
import { getUserID, hexToRGBA, smoothScrollToTop } from '~/utils/main'
import emitter from '~/utils/mitt'

const activatedPage = ref<AppPage>(settings.value.startupPage ?? AppPage.Home)
const { locale } = useI18n()
const [showSettings, toggleSettings] = useToggle(false)
const pages = { Home, Search, Anime, History, WatchLater, Favorites }
const mainAppRef = ref<HTMLElement>() as Ref<HTMLElement>
const mainAppOpacity = ref<number>(0)
const showTopbarMask = ref<boolean>(false)
const dynamicComponentKey = ref<string>(`dynamicComponent${Number(new Date())}`)

const tooltipPlacement = computed(() => {
  if (settings.value.dockPosition === 'left')
    return 'right'
  else if (settings.value.dockPosition === 'right')
    return 'left'
  else if (settings.value.dockPosition === 'bottom')
    return 'top'
  return 'right'
})

const isHomePage = computed(() => {
  if (
    /https?:\/\/bilibili.com\/?$/.test(location.href)
  || /https?:\/\/www.bilibili.com\/?$/.test(location.href)
  || /https?:\/\/www.bilibili.com\/index.html$/.test(location.href)
  || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(location.href)
  || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(location.href)
  )
    return true
  return false
})

const isVideoPage = computed(() => {
  if (/https?:\/\/(www.)?bilibili.com\/video\/.*/.test(location.href))
    return true
  return false
})

const isTopbarFixed = computed(() => {
  if (
    // home page
    /https?:\/\/bilibili.com\/?$/.test(location.href)
    || /https?:\/\/www.bilibili.com\/?$/.test(location.href)
    || /https?:\/\/www.bilibili.com\/index.html$/.test(location.href)
    || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(location.href)
    || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(location.href)

    // // search page
    // || /https?:\/\/search.bilibili.com\/.*$/.test(location.href)
    // video page
    || /https?:\/\/(www.)?bilibili.com\/video\/.*/.test(location.href)
    // anime playback & movie page
    || /https?:\/\/(www.)?bilibili.com\/bangumi\/play\/.*/.test(location.href)
    // moment page
    || /https?:\/\/t.bilibili.com.*/.test(location.href)
  )
    return true
  return false
})
const currentAppColorScheme = computed((): 'dark' | 'light' => {
  if (settings.value.theme !== 'auto')
    return settings.value.theme
  else
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
})

// const isSearchPage = computed(() => {
//   if (
//     /https?:\/\/search.bilibili.com\/.*$/.test(location.href)
//   )
//     return true
//   return false
// })

watch(
  () => activatedPage.value,
  () => {
    setTimeout(() => {
      mainAppRef.value.scrollTop = 0
    }, 500)
  },
)

watch(
  () => settings.value.themeColor,
  () => {
    setAppThemeColor()
  },
)

// Watch for changes in the 'settings.value.theme' variable and add the 'dark' class to the 'mainApp' element
// to prevent some Unocss dark-specific styles from failing to take effect
watch(() => settings.value.theme, () => {
  setAppAppearance()
})

watch(() => settings.value.language, () => {
  setAppLanguage()
})

watch(() => accessKey.value, () => {
  handleChangeAccessKey()
})

watch(() => settings.value.wallpaperMaskOpacity, () => {
  setAppWallpaperMaskingOpacity()
})

watch(() => settings.value.searchPageWallpaperMaskOpacity, () => {
  setAppWallpaperMaskingOpacity()
})

watch(() => activatedPage.value, (newValue, oldValue) => {
  // If u have set the `individuallySetSearchPageWallpaper`, reapply the wallpaper when the new page is search page
  // or when switching from a search page to another page, since search page has its own wallpaper.
  if (settings.value.individuallySetSearchPageWallpaper && (newValue === AppPage.Search || oldValue === AppPage.Search))
    setAppWallpaperMaskingOpacity()
})

watch(() => settings.value.adaptToOtherPageStyles, () => {
  handleAdaptToOtherPageStylesChange()
})

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      mainAppOpacity.value = 1
    }, 1200)
  })

  if (isHomePage.value) {
    // Force overwrite Bilibili Evolved body tag & html tag background color
    document.body.style.setProperty('background-color', 'unset', 'important')
  }
  document.documentElement.style.setProperty('font-size', '14px')

  if (mainAppRef.value) {
    mainAppRef.value.addEventListener('scroll', () => {
      if (
        mainAppRef.value.clientHeight + mainAppRef.value.scrollTop
          >= mainAppRef.value.scrollHeight - 20
      ) {
        nextTick(() => {
          emitter.emit('reachBottom')
        })
      }

      if (mainAppRef.value.scrollTop === 0)
        showTopbarMask.value = false
      else
        showTopbarMask.value = true
    })
  }

  document.addEventListener('scroll', () => {
    if (window.scrollY > 0)
      showTopbarMask.value = true
    else showTopbarMask.value = false
  })

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setAppAppearance)

  handleChangeAccessKey()
  setAppAppearance()
  setAppLanguage()
  setAppThemeColor()
  setAppWallpaperMaskingOpacity()
  handleAdaptToOtherPageStylesChange()
})

function handleChangeAccessKey() {
  // Clear accessKey if not logged in
  if (!getUserID())
    accessKey.value = ''
}

function changeActivatePage(pageName: AppPage) {
  if (activatedPage.value === pageName) {
    if (activatedPage.value !== AppPage.Search) {
      if (mainAppRef.value.scrollTop === 0)
        handleRefresh()
      else
        handleBackToTop()
    }
    return
  }
  activatedPage.value = pageName
}

async function setAppLanguage() {
  // if there is first-time load extension, set the default language by browser display language
  if (!settings.value.language) {
    if (browser.i18n.getUILanguage() === 'zh-CN') {
      settings.value.language = LanguageType.Mandarin_CN
    }
    else if (browser.i18n.getUILanguage() === 'zh-TW') {
      // Since getUILanguage() cannot get the zh-HK language code
      // use getAcceptLanguages() to get the language code
      const languages: string[] = await browser.i18n.getAcceptLanguages()
      if (languages.includes('zh-HK'))
        settings.value.language = LanguageType.Cantonese
      else settings.value.language = LanguageType.Mandarin_TW
    }
    else {
      settings.value.language = LanguageType.English
    }
  }

  locale.value = settings.value.language
}

/**
 * Watch for changes in the 'settings.value.theme' variable and add the 'dark' class to the 'mainApp' element
 * to prevent some Unocss dark-specific styles from failing to take effect
 */
function setAppAppearance() {
  const currentColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (settings.value.theme === 'dark') {
    mainAppRef.value?.classList.add('dark')
    document.querySelector('#bewly')?.classList.add('dark')
    document.documentElement.classList.add('dark')
  }
  else if (settings.value.theme === 'light') {
    mainAppRef.value?.classList.remove('dark')
    document.querySelector('#bewly')?.classList.remove('dark')
    document.documentElement.classList.remove('dark')
  }
  else if (settings.value.theme === 'auto') {
    if (currentColorScheme) {
      mainAppRef.value?.classList.add('dark')
      document.querySelector('#bewly')?.classList.add('dark')
      document.documentElement.classList.add('dark')
    }
    else {
      mainAppRef.value?.classList.remove('dark')
      document.querySelector('#bewly')?.classList.remove('dark')
      document.documentElement.classList.remove('dark')
    }
  }
}

function toggleDark() {
  if (currentAppColorScheme.value === 'light')
    settings.value.theme = 'dark'
  else
    settings.value.theme = 'light'
}

function setAppThemeColor() {
  const bewlyElement = document.querySelector('#bewly') as HTMLElement
  if (bewlyElement) {
    bewlyElement.style.setProperty('--bew-theme-color', settings.value.themeColor)
    for (let i = 0; i < 9; i++)
      bewlyElement.style.setProperty(`--bew-theme-color-${i + 1}0`, hexToRGBA(settings.value.themeColor, i * 0.1 + 0.1))
  }

  document.documentElement.style.setProperty('--bew-theme-color', settings.value.themeColor)
  for (let i = 0; i < 9; i++)
    document.documentElement.style.setProperty(`--bew-theme-color-${i + 1}0`, hexToRGBA(settings.value.themeColor, i * 0.1 + 0.1))
}

function setAppWallpaperMaskingOpacity() {
  const bewlyElement = document.querySelector('#bewly') as HTMLElement
  if (settings.value.individuallySetSearchPageWallpaper && activatedPage.value === AppPage.Search)
    bewlyElement.style.setProperty('--bew-homepage-bg-mask-opacity', `${settings.value.searchPageWallpaperMaskOpacity}%`)
  else
    bewlyElement.style.setProperty('--bew-homepage-bg-mask-opacity', `${settings.value.wallpaperMaskOpacity}%`)
}

function handleRefresh() {
  emitter.emit('pageRefresh')
  if (activatedPage.value === AppPage.Anime)
    dynamicComponentKey.value = `dynamicComponent${Number(new Date())}`
}

function handleBackToTop() {
  smoothScrollToTop(mainAppRef.value, 300)
}

function handleAdaptToOtherPageStylesChange() {
  if (settings.value.adaptToOtherPageStyles)
    document.documentElement.classList.add('bewly-design')
  else
    document.documentElement.classList.remove('bewly-design')
}
</script>

<template>
  <template v-if="isHomePage">
    <Transition name="fade">
      <div v-if="activatedPage === AppPage.Search">
        <!-- background -->
        <div
          pos="absolute top-0 left-0" w-full h-full duration-300 bg="cover center $bew-homepage-bg" z--1
          :style="{ backgroundImage: `url(${settings.individuallySetSearchPageWallpaper ? settings.searchPageWallpaper : settings.wallpaper})` }"
        />
        <!-- background mask -->
        <transition name="fade">
          <div
            v-if="(!settings.individuallySetSearchPageWallpaper && settings.enableWallpaperMasking) || (settings.searchPageEnableWallpaperMasking)"
            pos="absolute top-0 left-0" w-full h-full pointer-events-none bg="$bew-homepage-bg-mask" duration-300 z--1
            :style="{
              backdropFilter: `blur(${settings.individuallySetSearchPageWallpaper ? settings.searchPageWallpaperBlurIntensity : settings.wallpaperBlurIntensity}px)`,
            }"
          />
        </transition>
      </div>
      <div v-else>
        <!-- background -->
        <div
          pos="absolute top-0 left-0" w-full h-full duration-300 bg="cover center $bew-homepage-bg" z--1
          :style="{ backgroundImage: `url(${settings.wallpaper})` }"
        />
        <!-- background mask -->
        <transition name="fade">
          <div
            v-if="settings.enableWallpaperMasking"
            pos="absolute top-0 left-0" w-full h-full pointer-events-none bg="$bew-homepage-bg-mask" duration-300 z--1
            :style="{
              backdropFilter: `blur(${settings.wallpaperBlurIntensity}px)`,
            }"
          />
        </transition>
      </div>
    </Transition>
  </template>

  <div
    ref="mainAppRef" class="bewly-wrapper" text="$bew-text-1" transition="opacity duration-300" overflow-y-scroll z-60
    :style="{ opacity: mainAppOpacity, height: isHomePage ? '100vh' : '0' }"
  >
    <!-- Home search page mode background -->
    <div
      v-if="activatedPage === AppPage.Home && settings.useSearchPageModeOnHomePage && settings.individuallySetSearchPageWallpaper"
      :style="{ opacity: showSettings ? 0.4 : 1 }"
    >
      <div
        pos="relative left-0 top-0" w-full h-580px mb--580px bg="cover center" z-1
        :style="{
          backgroundImage: `url(${settings.searchPageWallpaper})`,
        }"
      />
      <!-- background mask -->
      <transition name="fade">
        <div
          v-if="(!settings.individuallySetSearchPageWallpaper && settings.enableWallpaperMasking) || (settings.searchPageEnableWallpaperMasking)"
          pos="relative left-0 top-0" w-full h-580px mb--580px pointer-events-none duration-300 z-1 bg="$bew-homepage-bg-mask"
          :style="{
            backdropFilter: `blur(${settings.individuallySetSearchPageWallpaper ? settings.searchPageWallpaperBlurIntensity : settings.wallpaperBlurIntensity}px)`,
          }"
        >
          <div
            bg="$bew-homepage-bg" pos="absolute top-0 left-0" w-full h-full
            :style="{
              opacity: `${settings.searchPageWallpaperMaskOpacity}%`,
            }"
          />
        </div>
      </transition>
    </div>

    <div m-auto max-w="$bew-page-max-width" :style="{ opacity: showSettings ? 0.4 : 1 }">
      <Transition name="topbar">
        <Topbar
          v-if="settings.isShowTopbar && !isHomePage"
          :show-topbar-mask="showTopbarMask && isTopbarFixed"
          pos="top-0 left-0" z-9999 w="[calc(100%)]"
          :style="{ position: isTopbarFixed ? 'fixed' : 'absolute' }"
        />
        <Topbar
          v-else-if="settings.isShowTopbar && isHomePage"
          :show-search-bar="showTopbarMask && settings.useSearchPageModeOnHomePage || (!settings.useSearchPageModeOnHomePage || activatedPage !== AppPage.Home && activatedPage !== AppPage.Search)"
          :show-logo="showTopbarMask && settings.useSearchPageModeOnHomePage || (!settings.useSearchPageModeOnHomePage || activatedPage !== AppPage.Home)"
          :show-topbar-mask="showTopbarMask && isTopbarFixed"
          pos="fixed top-0 left-0" z-9999 w="[calc(100%)]"
        />
      </Transition>

      <div flex="~" max-w="$bew-page-max-width">
        <aside
          v-if="isHomePage"
          class="dock-wrap"
          :class="{
            left: settings.dockPosition === 'left',
            right: settings.dockPosition === 'right',
            bottom: settings.dockPosition === 'bottom',
          }"
          pos="absolute top-0" flex="~ col" h-100vh justify-center z-10 pointer-events-none
        >
          <div
            class="dock-content"
            p-2 m-2 bg="$bew-content-1" flex="~ col gap-2 shrink-0"
            rounded="$bew-radius" border="1px $bew-border-color"
            shadow="$bew-shadow-2"
            backdrop-glass pointer-events-auto
          >
            <Tooltip :content="$t('dock.search')" :placement="tooltipPlacement">
              <button
                class="dock-item"
                :class="{ active: activatedPage === AppPage.Search }"
                @click="changeActivatePage(AppPage.Search)"
              >
                <tabler:search />
              </button>
            </Tooltip>

            <Tooltip :content="$t('dock.home')" :placement="tooltipPlacement">
              <button
                class="dock-item"
                :class="{ active: activatedPage === AppPage.Home }"
                @click="changeActivatePage(AppPage.Home)"
              >
                <tabler:home />
              </button>
            </Tooltip>

            <Tooltip :content="$t('dock.anime')" :placement="tooltipPlacement">
              <button
                class="dock-item"
                :class="{ active: activatedPage === AppPage.Anime }"
                @click="changeActivatePage(AppPage.Anime)"
              >
                <tabler:device-tv />
              </button>
            </Tooltip>

            <Tooltip :content="$t('dock.history')" :placement="tooltipPlacement">
              <button
                class="dock-item"
                :class="{ active: activatedPage === AppPage.History }"
                @click="changeActivatePage(AppPage.History)"
              >
                <tabler:clock />
              </button>
            </Tooltip>

            <Tooltip :content="$t('dock.favorites')" :placement="tooltipPlacement">
              <div
                class="dock-item"
                :class="{ active: activatedPage === AppPage.Favorites }"
                @click="changeActivatePage(AppPage.Favorites)"
              >
                <tabler:star />
              </div>
            </Tooltip>

            <Tooltip :content="$t('dock.watch_later')" :placement="tooltipPlacement">
              <button
                class="dock-item"
                :class="{ active: activatedPage === AppPage.WatchLater }"
                @click="changeActivatePage(AppPage.WatchLater)"
              >
                <iconoir:playlist-play />
              </button>
            </Tooltip>

            <template v-if="isVideoPage">
              <!-- dividing line -->
              <div class="divider" />

              <!-- video page -->
              <button class="dock-item video active">
                <tabler:player-play />
              </button>
            </template>

            <!-- dividing line -->
            <div class="divider" />

            <Tooltip :content="currentAppColorScheme === 'dark' ? $t('dock.dark_mode') : $t('dock.light_mode')" :placement="tooltipPlacement">
              <button class="dock-item" @click="toggleDark()">
                <tabler:moon-stars v-if="currentAppColorScheme === 'dark'" />
                <tabler:sun v-else />
              </button>
            </Tooltip>

            <Tooltip :content="$t('dock.settings')" :placement="tooltipPlacement">
              <button class="dock-item" @click="toggleSettings()">
                <tabler:settings />
              </button>
            </Tooltip>
          </div>
        </aside>
        <aside v-else pos="fixed top-0 right-6px" h-full flex items-center z-10 pointer-events-none>
          <div flex="~ gap-2 col" pointer-events-auto>
            <Tooltip :content="currentAppColorScheme === 'dark' ? $t('dock.dark_mode') : $t('dock.light_mode')" placement="left">
              <Button size="small" round shadow="$bew-shadow-1" w-45px h-45px @click="toggleDark()">
                <tabler:moon-stars v-if="currentAppColorScheme === 'dark'" text-xl shrink-0 lh-0 />
                <tabler:sun v-else text-xl shrink-0 lh-0 />
              </Button>
            </Tooltip>
            <Tooltip :content="$t('dock.settings')" placement="left">
              <Button size="small" round shadow="$bew-shadow-1" w-45px h-45px @click="toggleSettings">
                <tabler:settings text-xl shrink-0 lh-0 />
              </Button>
            </Tooltip>
          </div>
        </aside>

        <main
          v-if="isHomePage"
          p="t-80px" m-auto
          :w="isVideoPage ? '[calc(100%-160px)]' : 'lg:85% md:[calc(90%-60px)] [calc(100%-140px)]'"
        >
          <!-- control button group -->
          <div
            v-if="activatedPage !== AppPage.Search"
            pos="fixed right-24 bottom-4" z-4
          >
            <!-- refresh button -->
            <Button
              v-if="!showTopbarMask"
              size="small"
              frosted-glass shadow="$bew-shadow-1" w-45px h-45px
              @click="handleRefresh"
            >
              <tabler:refresh text-lg shrink-0 />
            </Button>
            <!-- back to top button -->
            <Button
              v-else
              size="small"
              frosted-glass shadow="$bew-shadow-1" w-45px h-45px mt-2
              @click="handleBackToTop"
            >
              <tabler:arrow-big-up text-lg shrink-0 />
            </Button>
          </div>

          <Transition name="page-fade">
            <Component :is="pages[activatedPage]" :key="dynamicComponentKey" />
          </Transition>
        </main>
      </div>
    </div>
    <!-- settings dialog -->
    <KeepAlive>
      <Settings v-if="showSettings" @close="showSettings = false" />
    </KeepAlive>
  </div>
</template>

<style lang="scss" scoped>
.topbar-enter-active,
.topbar-leave-active {
  transition: all 0.5s ease;
}

.topbar-enter-from,
.topbar-leave-to {
  --at-apply: opacity-0 transform -translate-y-full;
}

.dock-wrap {
  svg {
    --at-apply: block align-middle;
  }

  &.left {
    --at-apply: left-2;
  }

  &.right {
    --at-apply: right-2;
  }

  &.bottom {
    --at-apply: top-unset bottom-0 items-center w-full h-[fit-content];

    .dock-content {
      --at-apply: flex-row;
    }
  }

  .divider {
    --at-apply: my-2 w-full h-2px bg-$bew-fill-2;
  }

  &.bottom .divider {
    --at-apply: w-2px h-auto my-0 mx-2;
  }

  .dock-item {
    --shadow: 0 0 30px 4px var(--bew-theme-color-50);
    --shadow-dark: 0 0 30px 4px rgba(255, 255, 255, 0.6);
    --shadow-active: 0 0 20px var(--bew-theme-color-50);
    --shadow-dark-active: 0 0 20px rgba(255, 255, 255, 0.6);

    --at-apply: transform active:scale-90
      md:w-45px w-35px
      md:p-3 p-2
      md:text-2xl text-xl
      aspect-square relative
      text-$bew-text-1 leading-0 duration-300
      rounded-$bew-radius
      bg-$bew-fill-2 cursor-pointer
      hover:bg-$bew-theme-color hover:text-white hover:shadow-$shadow
      active:shadow-$shadow-active dark-active:shadow-$shadow-dark-active
      dark-hover:bg-white dark-hover:text-black dark-hover:shadow-$shadow-dark;

    &.active {
      --at-apply: bg-$bew-theme-color dark-bg-white
        text-white dark-text-black
        shadow-$shadow dark:shadow-$shadow-dark
        active:shadow-$shadow-active dark-active:shadow-$shadow-dark-active;
    }

    &.active.video {
      --shadow: 0 0 30px 4px var(--bew-warning-color-50);
      --shadow-dark: var(--shadow);
      --shadow-active: 0 0 20px var(--bew-warning-color-50);
      --shadow-dark-active: var(--shadow-active);

      --at-apply: bg-$bew-warning-color text-black;
    }

  }
}
</style>

<style lang="scss">
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.5s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  --at-apply: opacity-0;
}
.page-fade-leave-to {
  --at-apply: hidden
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  --at-apply: opacity-0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  --at-apply: opacity-0 transform translate-y-6 transform-gpu;
}
.list-leave-to {
  --at-apply: hidden
}
</style>
