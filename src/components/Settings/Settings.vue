<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import General from './components/General.vue'
import Appearance from './components/Appearance.vue'
import SearchPage from './components/SearchPage.vue'
import Home from './components/Home.vue'
import About from './components/About.vue'
import type { MenuItem } from './types'
import { MenuType } from './types'
import { settings } from '~/logic'

const emit = defineEmits(['close'])

const { t } = useI18n()

const settingsMenu = { General, Appearance, SearchPage, Home, About }
const activatedMenuItem = ref<MenuType>(MenuType.General)
const title = ref<string>(t('settings.title'))
const preventCloseSettings = ref<boolean>(false)

provide('preventCloseSettings', preventCloseSettings)

const settingsMenuItems = computed((): MenuItem[] => {
  return [
    {
      value: MenuType.General,
      icon: 'tabler:settings',
      title: t('settings.menu_general'),
    },
    {
      value: MenuType.Appearance,
      title: t('settings.menu_appearance'),
      icon: 'tabler:brush',

    },
    {
      value: MenuType.SearchPage,
      icon: 'tabler:search',
      title: t('settings.menu_search_page'),
    },
    {
      value: MenuType.Home,
      icon: 'tabler:home',
      title: t('settings.menu_home'),
    },
    {
      value: MenuType.About,
      icon: 'tabler:info-circle',
      title: t('settings.menu_about'),
    },
  ]
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

/**
 * When changing language, set current title again to ensure it switches to the corresponding language
 */
watch(() => settings.value.language, () => {
  setCurrentTitle()
})

onMounted(() => {
  setCurrentTitle()
})

function handleClose() {
  if (preventCloseSettings.value)
    return
  emit('close')
}

function changeMenuItem(menuItem: MenuType) {
  activatedMenuItem.value = menuItem
  setCurrentTitle()
}

function setCurrentTitle() {
  settingsMenuItems.value.forEach((item) => {
    if (item.value === activatedMenuItem.value)
      title.value = item.title
  })
}
</script>

<template>
  <div class="fixed w-full h-full top-0 left-0" z="9998">
    <div
      class="fixed w-full h-full top-0 left-0" opacity-60 :style="{ backgroundColor: isHomePage ? '' : 'var(--bew-bg)' }"
      @click="handleClose"
    />

    <div
      id="settings-window" pos="fixed top-1/2 left-1/2" w="90%" h="90%"
      max-w-900px max-h-800px transform="~ translate-x--1/2 translate-y--1/2"
      z-9999 flex justify-between items-center
    >
      <aside
        class="group" shrink-0 p="x-4" pos="absolute left--42px" z-2
        :style="{
          pointerEvents: preventCloseSettings ? 'none' : 'unset'
        }"
      >
        <ul
          flex="~ gap-2 col" rounded="30px hover:25px" bg="$bew-elevated-2" p-2 shadow="$bew-shadow-3"
          scale="group-hover:105" duration-300 overflow-hidden
          backdrop-glass
        >
          <!-- mask -->
          <div v-if="preventCloseSettings" pos="absolute top-0 left-0" w-full h-full bg="black opacity-20 dark:opacity-40" />

          <li v-for="menuItem in settingsMenuItems" :key="menuItem.value">
            <a
              cursor-pointer w="40px group-hover:150px" h-40px
              rounded-30px flex items-center overflow-x-hidden
              duration-300 bg="hover:$bew-fill-2"
              :class="{ 'menu-item-activated': menuItem.value === activatedMenuItem }"
              @click="changeMenuItem(menuItem.value)"
            >
              <Icon :icon="menuItem.icon" text="xl center" w-40px h-20px flex="~ shrink-0" justify-center />
              <span shrink-0>{{ menuItem.title }}</span>
            </a>
          </li>
        </ul>
      </aside>

      <div
        relative overflow-hidden w-full h-full bg="$bew-elevated-solid-1"
        shadow="$bew-shadow-4" rounded="$bew-radius"
      >
        <header
          flex justify-between items-center w-full h-80px
          pos="fixed top-0 left-0" p="x-12"
          z-1 rounded="t-$bew-radius"
          style="
            background: linear-gradient(var(--bew-elevated-solid-1), transparent);
            text-shadow: 0 0 15px var(--bew-elevated-solid-1), 0 0 20px var(--bew-elevated-solid-1)
          "
        >
          <div text="3xl" fw-bold>
            {{ title }}
          </div>
          <div
            text-2xl leading-0 bg="$bew-fill-1 hover:$bew-theme-color-30" w="32px" h="32px" p="1" rounded-8 cursor="pointer" backdrop-glass
            hover:ring="2 $bew-theme-color" hover:text="$bew-theme-color" duration-300
            @click="handleClose"
          >
            <ic-baseline-clear />
          </div>
        </header>

        <main relative h-full py-8 p="x-13" overflow-y-overlay>
          <div h-80px mt--8 />

          <Transition name="page-fade">
            <Component :is="settingsMenu[activatedMenuItem]" />
          </Transition>
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-item-activated {
  --at-apply: text-white dark-text-black
    important-dark-bg-white important-bg-$bew-theme-color;
}
</style>
