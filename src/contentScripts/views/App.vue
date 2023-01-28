<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import 'uno.css'
import { useI18n } from 'vue-i18n'
import browser from 'webextension-polyfill'
import Home from './Home/Home.vue'
import Search from './Search/Search.vue'
import Anime from './Anime/Anime.vue'
import { activatedPage, isShowTopbar } from '~/logic/storage'
import { language } from '~/logic'
import '~/styles/index.ts'
import { AppPage, LanguageType } from '~/enums/appEnums'

const { locale } = useI18n()
const [showSettings, toggle] = useToggle(false)
const isDark = useDark()
const toggleDark = useToggle(isDark)
const pages = { Home, Search, Anime }

watch(() => activatedPage.value, (newValue, oldValue) => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

onUpdated(async () => {
  // if there is first-time load extension, set the default language by browser display language
  if (!language.value) {
    if (browser.i18n.getUILanguage() === 'zh-CN') {
      language.value = LanguageType.Mandarin_CN
    }
    else if (browser.i18n.getUILanguage() === 'zh-TW') {
      // Since getUILanguage() cannot get the zh-HK language code
      // use getAcceptLanguages() to get the language code
      const languages: string[] = await browser.i18n.getAcceptLanguages()
      if (languages.includes('zh-HK'))
        language.value = LanguageType.Cantonese
      else language.value = LanguageType.Mandarin_TW
    }
    else {
      language.value = LanguageType.English
    }
  }

  locale.value = language.value
})

function changeActivatePage(pageName: AppPage) {
  activatedPage.value = pageName
}
</script>

<template>
  <Transition name="topbar">
    <Topbar
      v-show="isShowTopbar"
      :show-search-bar="activatedPage !== AppPage.Search"
      class="fixed z-50"
    />
  </Transition>

  <div flex="~">
    <aside pos="fixed left-0 top-0" flex="~ col" h-100vh justify-center z-999>
      <div
        p-2
        bg="$bew-content-1"
        flex="~ col gap-2 shrink-0"
        rounded="r-$bew-radius"
        shadow="$bew-shadow-2"
        style="backdrop-filter: var(--bew-filter-glass)"
      >
        <button
          class="tab-item"
          :class="{ active: activatedPage === AppPage.Search }"
          @click="changeActivatePage(AppPage.Search)"
        >
          <tabler:search />
        </button>

        <button
          class="tab-item"
          :class="{ active: activatedPage === AppPage.Home }"
          @click="changeActivatePage(AppPage.Home)"
        >
          <tabler:home />
        </button>

        <button
          class="tab-item"
          :class="{ active: activatedPage === AppPage.Anime }"
          @click="changeActivatePage(AppPage.Anime)"
        >
          <tabler:device-tv />
        </button>

        <!-- dividing line -->
        <div my-4 w-full h-2px bg="$bew-fill-2" />

        <button class="tab-item" @click="toggleDark()">
          <tabler:moon-stars v-if="isDark" />
          <tabler:sun v-else />
        </button>

        <button class="tab-item" @click="toggle()">
          <tabler:settings />
        </button>
      </div>
    </aside>

    <main p="t-80px lg:x-36 md:x-22 x-18" w-full>
      <Transition name="fade">
        <Component :is="pages[activatedPage]" />
      </Transition>
    </main>
  </div>
  <!-- settings dialog -->
  <Settings v-if="showSettings" @close="showSettings = false" />
</template>

<style lang="scss" scoped>
.topbar-enter-active,
.topbar-leave-active {
  transition: all 0.5s ease;
}

.topbar-enter-from,
.topbar-leave-to {
  @apply opacity-0 transform -translate-y-full;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}

.tab-item {
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
    bg-$bew-fill-1
    hover:bg-$bew-theme-color hover:text-white hover:shadow-$shadow
    active:shadow-$shadow-active dark-active:shadow-$shadow-dark-active
    dark-hover:bg-white dark-hover:text-black dark-hover:shadow-$shadow-dark;

  &.active {
    --at-apply: bg-$bew-theme-color dark-bg-white
      text-white dark-text-black
      shadow-$shadow dark:shadow-$shadow-dark
      active:shadow-$shadow-active dark-active:shadow-$shadow-dark-active;
  }
}
</style>
