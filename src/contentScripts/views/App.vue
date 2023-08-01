<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
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
import Video from './Video/Video.vue'
import { accessKey, activatedPage, settings } from '~/logic'
import '~/styles/index.ts'
import { AppPage, LanguageType } from '~/enums/appEnums'
import { getUserID, hexToRGBA } from '~/utils/main'
import emitter from '~/utils/mitt'

const { locale } = useI18n()
const [showSettings, toggle] = useToggle(false)
const isDark = useDark({
  onChanged: (isDark: boolean) => {
    if (isDark) {
      document.querySelector('html')?.classList.add('dark')
      document.querySelector('#bewly')?.classList.add('dark')
    }
    else {
      document.querySelector('html')?.classList.remove('dark')
      document.querySelector('#bewly')?.classList.remove('dark')
    }
  },
})
const toggleDark = useToggle(isDark)
const pages = { Home, Search, Anime, History, WatchLater, Favorites, Video }
const isVideoPage = ref<boolean>(false)
const mainAppRef = ref<HTMLElement>() as Ref<HTMLElement>
const mainAppOpacity = ref<number>(0)
const showTopbarMask = ref<boolean>(false)

const tooltipPlacement = computed(() => {
  if (settings.value.dockPosition === 'left')
    return 'right'
  else if (settings.value.dockPosition === 'right')
    return 'left'
  else if (settings.value.dockPosition === 'bottom')
    return 'top'
  return 'right'
})

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

// Watch for changes in the 'isDark' variable and add the 'dark' class to the 'mainApp' element
// to prevent some Unocss dark-specific styles from failing to take effect
watch(() => isDark.value, () => {
  setAppAppearance()
})

watch(() => settings.value.language, () => {
  setAppLanguage()
})

watch(() => accessKey.value, () => {
  // Clear accessKey if not logged in
  if (!getUserID())
    accessKey.value = ''
})

watch(() => settings.value.wallpaper, () => {
  setAppWallpaper()
})

watch(() => settings.value.searchPageWallpaper, () => {
  if (activatedPage.value === AppPage.Search)
    setAppWallpaper()
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
  if (settings.value.individuallySetSearchPageWallpaper && (newValue === AppPage.Search || oldValue === AppPage.Search)) {
    setAppWallpaper()
    setAppWallpaperMaskingOpacity()
  }
})

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      mainAppOpacity.value = 1
    }, 800)
  })

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

  if (/https?:\/\/(www.)?bilibili.com\/video\/.*/.test(location.href))
    isVideoPage.value = true
  setAppAppearance()
  setAppLanguage()
  setAppThemeColor()
  setAppWallpaper()
  setAppWallpaperMaskingOpacity()
})

function changeActivatePage(pageName: AppPage) {
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
 * Watch for changes in the 'isDark' variable and add the 'dark' class to the 'mainApp' element
 * to prevent some Unocss dark-specific styles from failing to take effect
 */
function setAppAppearance() {
  if (isDark.value)
    mainAppRef.value?.classList.add('dark')

  else
    mainAppRef.value?.classList.remove('dark')

  // Override Bilibili Evolved background color
  document.body.style.setProperty('background-color', 'unset', 'important')
  document.documentElement.style.setProperty('background-color', 'var(--bew-bg)', 'important')
}

function setAppThemeColor() {
  const bewlyElement = document.querySelector('#bewly') as HTMLElement
  if (bewlyElement) {
    bewlyElement.style.setProperty('--bew-theme-color', settings.value.themeColor)
    for (let i = 0; i < 9; i++)
      bewlyElement.style.setProperty(`--bew-theme-color-${i + 1}0`, hexToRGBA(settings.value.themeColor, i * 0.1 + 0.1))
  }
}

function setAppWallpaper() {
  nextTick(() => {
    if (settings.value.individuallySetSearchPageWallpaper && activatedPage.value === AppPage.Search)
      document.documentElement.style.backgroundImage = `url(${settings.value.searchPageWallpaper})`
    else
      document.documentElement.style.backgroundImage = `url(${settings.value.wallpaper})`

    document.documentElement.style.backgroundSize = 'cover'
    document.documentElement.style.backgroundPosition = 'center'
    document.documentElement.style.transition = 'backgroundImage .5s ease-in-out'
  })
}

function setAppWallpaperMaskingOpacity() {
  const bewlyElement = document.querySelector('#bewly') as HTMLElement
  if (settings.value.individuallySetSearchPageWallpaper && activatedPage.value === AppPage.Search)
    bewlyElement.style.setProperty('--bew-bg-mask-opacity', `${settings.value.searchPageWallpaperMaskOpacity}%`)
  else
    bewlyElement.style.setProperty('--bew-bg-mask-opacity', `${settings.value.wallpaperMaskOpacity}%`)
}
</script>

<template>
  <!-- background mask -->
  <div
    v-if="(!settings.individuallySetSearchPageWallpaper && settings.enableWallpaperMasking) || (activatedPage !== AppPage.Search && settings.enableWallpaperMasking)"
    pos="absolute top-0 left-0" w-full h-full pointer-events-none bg="$bew-bg-mask" z--1
    :style="{
      backdropFilter: `blur(${settings.wallpaperBlurIntensity}px)`,
    }"
  />
  <div
    v-else-if="settings.individuallySetSearchPageWallpaper && activatedPage === AppPage.Search && settings.searchPageEnableWallpaperMasking"
    pos="absolute top-0 left-0" w-full h-full pointer-events-none bg="$bew-bg-mask" z--1
    :style="{
      backdropFilter: `blur(${settings.searchPageWallpaperBlurIntensity}px)`,
    }"
  />

  <div ref="mainAppRef" text="$bew-text-1" transition="opacity duration-300" h-100vh overflow-y-scroll :style="{ opacity: mainAppOpacity }">
    <div m-auto max-w="$bew-page-max-width" :style="{ opacity: showSettings ? 0.4 : 1 }">
      <Transition name="topbar">
        <Topbar
          v-show="settings.isShowTopbar"
          :show-search-bar="activatedPage !== AppPage.Search"
          :show-topbar-mask="showTopbarMask"
          class="absolute top-0 left-0 z-50"
        />
      </Transition>

      <div flex="~" max-w="$bew-page-max-width">
        <aside
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
                :class="{ active: activatedPage === AppPage.Search && !isVideoPage }"
                @click="changeActivatePage(AppPage.Search)"
              >
                <tabler:search />
              </button>
            </Tooltip>

            <Tooltip :content="$t('dock.home')" :placement="tooltipPlacement">
              <button
                class="dock-item"
                :class="{ active: activatedPage === AppPage.Home && !isVideoPage }"
                @click="changeActivatePage(AppPage.Home)"
              >
                <tabler:home />
              </button>
            </Tooltip>

            <Tooltip :content="$t('dock.anime')" :placement="tooltipPlacement">
              <button
                class="dock-item"
                :class="{ active: activatedPage === AppPage.Anime && !isVideoPage }"
                @click="changeActivatePage(AppPage.Anime)"
              >
                <tabler:device-tv />
              </button>
            </Tooltip>

            <Tooltip :content="$t('dock.history')" :placement="tooltipPlacement">
              <button
                class="dock-item"
                :class="{ active: activatedPage === AppPage.History && !isVideoPage }"
                @click="changeActivatePage(AppPage.History)"
              >
                <tabler:clock />
              </button>
            </Tooltip>

            <Tooltip :content="$t('dock.watch_later')" :placement="tooltipPlacement">
              <button
                class="dock-item"
                :class="{ active: activatedPage === AppPage.WatchLater && !isVideoPage }"
                @click="changeActivatePage(AppPage.WatchLater)"
              >
                <iconoir:playlist-play />
              </button>
            </Tooltip>

            <!-- <div
            class="dock-item"
            :class="{ active: activatedPage === AppPage.Favorites }"
            @click="changeActivatePage(AppPage.Favorites)"
          >
            <tabler:star />
          </div> -->

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

            <Tooltip :content="isDark ? $t('dock.dark_mode') : $t('dock.light_mode')" :placement="tooltipPlacement">
              <button class="dock-item" @click="toggleDark()">
                <tabler:moon-stars v-if="isDark" />
                <tabler:sun v-else />
              </button>
            </Tooltip>

            <Tooltip :content="$t('dock.settings')" :placement="tooltipPlacement">
              <button class="dock-item" @click="toggle()">
                <tabler:settings />
              </button>
            </Tooltip>
          </div>
        </aside>

        <main
          ref="main"
          p="t-80px" m-auto
          relative
          :w="isVideoPage ? '[calc(100%-160px)]' : 'lg:85% md:[calc(90%-60px)] [calc(100%-140px)]'"
        >
          <Transition name="fade">
            <Component :is="pages[activatedPage]" absolute w-full />
            <!-- <Video v-else /> -->
          </Transition>
        </main>
      </div>
    </div>
    <!-- settings dialog -->
    <Settings v-if="showSettings" @close="showSettings = false" />
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
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  --at-apply: opacity-0;
}
</style>
