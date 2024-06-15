<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { settings } from '~/logic'

import OverlayScrollbarsComponent from '../OverlayScrollbarsComponent'
import type { MenuItem } from './types'
import { MenuType } from './types'

const emit = defineEmits(['close'])

const { t } = useI18n()

const settingsMenu = {
  [MenuType.General]: defineAsyncComponent(() => import('./components/General.vue')),
  [MenuType.Appearance]: defineAsyncComponent(() => import('./components/Appearance.vue')),
  [MenuType.SearchPage]: defineAsyncComponent(() => import('./components/SearchPage.vue')),
  [MenuType.Home]: defineAsyncComponent(() => import('./components/Home.vue')),
  [MenuType.Compatibility]: defineAsyncComponent(() => import('./components/Compatibility.vue')),
  // [MenuType.BilibiliSettings]: defineAsyncComponent(() => import('./components/BilibiliSettings.vue')),
  [MenuType.About]: defineAsyncComponent(() => import('./components/About.vue')),
}
const activatedMenuItem = ref<MenuType>(MenuType.General)
const title = ref<string>(t('settings.title'))
const preventCloseSettings = ref<boolean>(false)
const scrollbarRef = ref()

watch(
  () => activatedMenuItem.value,
  () => {
    const osInstance = scrollbarRef.value.osInstance()
    osInstance.elements().viewport.scrollTop = 0
  },
)

provide('preventCloseSettings', preventCloseSettings)

const settingsMenuItems = computed((): MenuItem[] => {
  return [
    {
      value: MenuType.General,
      icon: 'i-mingcute:settings-3-line',
      iconActivated: 'i-mingcute:settings-3-fill',
      title: t('settings.menu_general'),
    },
    {
      value: MenuType.Appearance,
      title: t('settings.menu_appearance'),
      icon: 'i-mingcute:paint-brush-line',
      iconActivated: 'i-mingcute:paint-brush-fill',
    },
    {
      value: MenuType.SearchPage,
      icon: 'i-mingcute:search-2-line',
      iconActivated: 'i-mingcute:search-2-fill',
      title: t('settings.menu_search_page'),
    },
    {
      value: MenuType.Home,
      icon: 'i-mingcute:home-5-line',
      iconActivated: 'i-mingcute:home-5-fill',
      title: t('settings.menu_home'),
    },
    {
      value: MenuType.Compatibility,
      icon: 'i-mingcute:polygon-line',
      iconActivated: 'i-mingcute:polygon-fill',
      title: t('settings.menu_compatibility'),
    },
    // {
    //   value: MenuType.BilibiliSettings,
    //   icon: 'ant-design:bilibili-outlined',
    //   iconActivated: 'ant-design:bilibili-outlined',
    //   title: 'Bilibili',
    // },
    {
      value: MenuType.About,
      icon: 'i-mingcute:information-line',
      iconActivated: 'i-mingcute:information-fill',
      title: t('settings.menu_about'),
    },
  ]
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
  <div class="fixed w-full h-full top-0 left-0">
    <div
      class="fixed w-full h-full top-0 left-0"
      @click="handleClose"
    />

    <div
      id="settings-window" pos="fixed top-1/2 left-1/2" w="90%" h="90%"
      max-w-1000px max-h-900px transform="~ translate-x--1/2 translate-y--1/2 gpu"
      flex justify-between items-center
    >
      <aside
        class="group"
        :style="{
          pointerEvents: preventCloseSettings ? 'none' : 'unset',
        }"
        shrink-0 p="x-4" pos="absolute left--84px" z-2
      >
        <ul
          style="
            --un-shadow: var(--bew-shadow-4), var(--bew-shadow-edge-glow-2);
            backdrop-filter: var(--bew-filter-glass-2);
          "
          flex="~ gap-2 col" rounded="30px hover:25px" p-2 shadow
          bg="$bew-content-2 hover:$bew-elevated-1 dark:$bew-elevated-1 dark-hover:$bew-elevated-2"
          scale="group-hover:105" duration-300 overflow-hidden antialiased transform-gpu
          border="1 $bew-border-color"
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
              <div
                v-show="menuItem.value !== activatedMenuItem"
                text="xl center" w-40px h-20px flex="~ shrink-0" justify-center
                :class="menuItem.icon"
              />
              <div
                v-show="menuItem.value === activatedMenuItem"
                text="xl center" w-40px h-20px flex="~ shrink-0" justify-center
                :class="menuItem.iconActivated"
              />
              <span shrink-0>{{ menuItem.title }}</span>
            </a>
          </li>
        </ul>
      </aside>

      <div
        class="settings-content"
        style="
          --un-shadow: var(--bew-shadow-4), var(--bew-shadow-edge-glow-2);
          backdrop-filter: var(--bew-filter-glass-2);
        "
        relative overflow="x-hidde" w-full h-full bg="$bew-content-2 dark:$bew-elevated-1"
        shadow rounded="$bew-radius" border="1 $bew-border-color" transform-gpu
      >
        <header
          flex justify-between items-center w-full h-80px
          pos="fixed top-0 left-0" p="x-11"
          z-1 rounded="t-$bew-radius"
          style="
            text-shadow: 0 0 10px var(--bew-elevated-solid-1), 0 0 15px var(--bew-elevated-solid-1)
          "
        >
          <!-- Mask -->
          <div
            pos="absolute top-0 left-0" w-inherit h-inherit pointer-events-none
            style="
              mask-image: linear-gradient(to bottom,  black 0, transparent 100%);
              -webkit-mask-image: linear-gradient(to bottom, black 0, transparent 100%);
              backdrop-filter: blur(6px);
            "
            z--1 rounded-inherit transform-gpu
          />
          <div text="3xl" fw-bold>
            {{ title }}
          </div>
          <div
            style="
              backdrop-filter: var(--bew-filter-glass-1);
              box-shadow: var(--bew-shadow-edge-glow-1), var(--bew-shadow-1);
            "
            text="!16px hover:$bew-theme-color" w="32px" h="32px"
            flex="~ items-center justify-center shrink-0"
            bg="$bew-fill-1 hover:$bew-theme-color-30"
            rounded-8 cursor="pointer" border="1 $bew-border-color" box-border
            duration-300
            @click="handleClose"
          >
            <div i-ic-baseline-clear />
          </div>
        </header>
        <OverlayScrollbarsComponent
          ref="scrollbarRef"
          style="
            mask-image: linear-gradient(to bottom, transparent 0%, black 80px 30%);
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 80px 30%);
          "
          element="div" defer
          h-inherit
        >
          <main
            pos="absolute top-80px left-0" w-full min-h="[calc(100%-80px)]" p="x-12 b-8"
          >
            <!-- <div h-80px mt--8 /> -->

            <Transition name="page-fade">
              <Component :is="settingsMenu[activatedMenuItem as keyof typeof settingsMenu]" />
            </Transition>
          </main>
        </OverlayScrollbarsComponent>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-item-activated {
  --uno: "text-white dark-text-black important-dark-bg-white important-bg-$bew-theme-color";
}
</style>
