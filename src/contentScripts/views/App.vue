<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import 'uno.css'
import { useI18n } from 'vue-i18n'
import browser from 'webextension-polyfill'
import Home from './Home/Home.vue'
import Search from './Search/Search.vue'
import Anime from './Anime/Anime.vue'
import History from './History/History.vue'
import Favorites from './Favorites/Favorites.vue'
import Video from './Video/Video.vue'
import { activatedPage, settings } from '~/logic'
import '~/styles/index.ts'
import { AppPage, LanguageType } from '~/enums/appEnums'
import { hexToRGBA } from '~/utils'

const { locale } = useI18n()
const [showSettings, toggle] = useToggle(false)
const isDark = useDark({
  // selector: '#bewly',
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
const pages = { Home, Search, Anime, History, Favorites, Video }
const isVideoPage = ref<boolean>(false)
const mainApp = ref<HTMLElement>()

watch(
  () => activatedPage.value,
  (newValue, oldValue) => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 500)
  },
)
watch(
  () => settings.value.themeColor,
  (newValue) => {
    const bewlyElement = document.querySelector('#bewly') as HTMLElement
    if (bewlyElement) {
      bewlyElement.style.setProperty('--bew-theme-color', newValue)
      for (let i = 0; i < 9; i++)
        bewlyElement.style.setProperty(`--bew-theme-color-${i + 1}0`, hexToRGBA(newValue, i * 0.1 + 0.1))
    }
  },
)

// Watch for changes in the 'isDark' variable and add the 'dark' class to the 'mainApp' element
// to prevent some Unocss dark-specific styles from failing to take effect
watch(() => isDark.value, (newValue, oldValue) => {
  setAppAppearance()
})

watch(() => settings.value.language, (newValue, oldValue) => {
  setAppLanguage()
})

onMounted(() => {
  if (/https?:\/\/(www.)?bilibili.com\/video\/.*/.test(location.href))
    isVideoPage.value = true
  setAppAppearance()
  setAppLanguage()
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
    mainApp.value?.classList.add('dark')

  else
    mainApp.value?.classList.remove('dark')
}
</script>

<template>
  <div ref="mainApp" bg="$bew-bg" text="$bew-text-1" min-h-100vh>
    <div m-auto max-w="$bew-page-max-width">
      <Transition name="topbar">
        <Topbar
          v-show="settings.isShowTopbar"
          :show-search-bar="activatedPage !== AppPage.Search"
          class="fixed top-0 left-0 z-50"
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
          pos="fixed top-0" flex="~ col" h-100vh justify-center z-999
        >
          <div
            class="dock-content"
            p-2
            m-2
            bg="$bew-content-1"
            flex="~ col gap-2 shrink-0"
            rounded="$bew-radius"
            shadow="$bew-shadow-2"
            style="backdrop-filter: var(--bew-filter-glass)"
          >
            <div
              class="dock-item"
              :class="{ active: activatedPage === AppPage.Search && !isVideoPage }"
              @click="changeActivatePage(AppPage.Search)"
            >
              <tabler:search />
            </div>

            <div
              class="dock-item"
              :class="{ active: activatedPage === AppPage.Home && !isVideoPage }"
              @click="changeActivatePage(AppPage.Home)"
            >
              <tabler:home />
            </div>

            <div
              class="dock-item"
              :class="{ active: activatedPage === AppPage.Anime && !isVideoPage }"
              @click="changeActivatePage(AppPage.Anime)"
            >
              <tabler:device-tv />
            </div>

            <div
              class="dock-item"
              :class="{ active: activatedPage === AppPage.History && !isVideoPage }"
              @click="changeActivatePage(AppPage.History)"
            >
              <tabler:clock />
            </div>

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
              <div class="dock-item video active">
                <tabler:player-play />
              </div>
            </template>

            <!-- dividing line -->
            <div class="divider" />

            <div class="dock-item" @click="toggleDark()">
              <tabler:moon-stars v-if="isDark" />
              <tabler:sun v-else />
            </div>

            <div class="dock-item" @click="toggle()">
              <tabler:settings />
            </div>
          </div>
        </aside>

        <main
          p="t-80px" m-auto
          :w="isVideoPage ? '[calc(100%-160px)]' : 'lg:85% md:[calc(90%-60px)] [calc(100%-120px)]'"
          relative
        >
          <Transition name="fade">
            <Component :is="pages[activatedPage]" v-if="!isVideoPage" absolute w-full />
            <Video v-else />
          </Transition>
        </main>
      </div>
      <!-- settings dialog -->
      <Settings v-if="showSettings" @close="showSettings = false" />
    </div>
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
    --at-apply: left-0;
  }

  &.right {
    --at-apply: right-0;
  }

  &.bottom {
    --at-apply: top-unset bottom-0 items-center w-full h-[fit-content];

    .dock-content {
      --at-apply: flex-row;
    }
  }

  .divider {
    --at-apply: my-2 w-full h-2px bg-$bew-fill-3;
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
      aspect-square
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
