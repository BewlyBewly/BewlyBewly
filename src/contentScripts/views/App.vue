<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import 'uno.css'
import { useI18n } from 'vue-i18n'
import browser from 'webextension-polyfill'
import Home from './Home/Home.vue'
import Search from './Search/Search.vue'
import { activatedPage, isShowTopbar } from '~/logic/storage'
import { language } from '~/logic'
import '~/styles/index.ts'
import { AppPage, LanguageType } from '~/enums/appEnums'

const { locale } = useI18n()
const [showSettings, toggle] = useToggle(false)
const isDark = useDark()
const toggleDark = useToggle(isDark)

window.onload = async () => {
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
}

function changeActivatePage(pageName: AppPage) {
  activatedPage.value = pageName
}
</script>

<template>
  <Transition>
    <Topbar
      v-show="isShowTopbar"
      :show-search-bar="activatedPage !== AppPage.Search"
      class="fixed z-50"
    />
  </Transition>

  <div flex="~">
    <aside pos="fixed left-0 top-0" flex="~ col" h-100vh justify-center>
      <div
        p-2
        bg="$bew-content-1"
        flex="~ col gap-2"
        rounded="r-$bew-radius"
        shadow="$bew-shadow-2"
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
      </div>
    </aside>

    <main p="t-80px x-5" m="l-60px r-60px" w-full>
      <KeepAlive>
        <Home v-if="activatedPage === 'home'" />
        <Search v-else-if="activatedPage === 'search'" />
      </KeepAlive>
    </main>

    <!-- button -->
    <div flex="~ col" pos="fixed bottom-5 lg:right-5 <lg:right-3">
      <button
        class="transform active:scale-90"
        w="lg:45px <lg:40px"
        h="lg:45px <lg:40px"
        p="lg:3 <lg:2"
        m="b-3"
        bg="$bew-content-1"
        text="2xl $bew-text-1"
        font="leading-0"
        duration="300"
        rounded="$bew-radius"
        style="
          box-shadow: var(--bew-shadow-2);
          backdrop-filter: var(--bew-filter-glass);
        "
        @click="toggleDark()"
      >
        <tabler:moon-stars v-if="isDark" />
        <tabler:sun v-else />
      </button>

      <button
        class="leading-none transform active:scale-90"
        w="lg:45px <lg:40px"
        h="lg:45px <lg:40px"
        p="lg:3 <lg:2"
        bg="$bew-content-1"
        text="2xl $bew-text-1"
        font="leading-0"
        duration="300"
        rounded="$bew-radius"
        style="
          box-shadow: var(--bew-shadow-2);
          backdrop-filter: var(--bew-filter-glass);
        "
        @click="toggle()"
      >
        <tabler:settings />
      </button>
    </div>
  </div>
  <!-- settings dialog -->
  <Settings v-if="showSettings" @close="showSettings = false" />
</template>

<style lang="scss" scoped>
.tab-item {
  --at-apply: transform active:scale-90 lg:w-45px <lg:w-40px
    aspect-square lg:p-3 <lg:p-2
    text-2xl text-$bew-text-1 leading-0 duration-300
    rounded-$bew-radius
    hover:bg-$bew-fill-2;
  backdrop-filter: var(--bew-filter-glass);

  &.active {
    --at-apply: bg-$bew-fill-2;
  }
}
</style>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  @apply opacity-0 transform -translate-y-full;
}
</style>
