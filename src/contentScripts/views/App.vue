<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import 'uno.css'
import { useI18n } from 'vue-i18n'
import browser from 'webextension-polyfill'
import Home from './Home/Home.vue'
import { isShowTopbar } from '~/logic/storage'
import { language } from '~/logic'
import '~/styles/index.ts'
import { LanguageType } from '~/enums/appEnums'

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
</script>

<template>
  <Transition>
    <Topbar v-show="isShowTopbar" class="fixed z-50" />
  </Transition>
  <!-- is home page -->
  <Home />
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
  <Settings v-if="showSettings" @close="showSettings = false" />
</template>

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
