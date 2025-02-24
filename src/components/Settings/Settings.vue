<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import { settings } from '~/logic'
import { createTransformer } from '~/utils/transformer'

import type { MenuItem } from './types'
import { MenuType } from './types'

const emit = defineEmits(['close'])

const { t } = useI18n()

const settingsMenu = {
  [MenuType.General]: defineAsyncComponent(() => import('./General/General.vue')),
  [MenuType.DesktopAndDock]: defineAsyncComponent(() => import('./DesktopAndDock/DesktopAndDock.vue')),
  [MenuType.Appearance]: defineAsyncComponent(() => import('./Appearance/Appearance.vue')),
  [MenuType.BewlyPages]: defineAsyncComponent(() => import('./BewlyPages/BewlyPages.vue')),
  [MenuType.Compatibility]: defineAsyncComponent(() => import('./Compatibility/Compatibility.vue')),
  // [MenuType.BilibiliSettings]: defineAsyncComponent(() => import('./BilibiliSettings/BilibiliSettings.vue')),
  [MenuType.About]: defineAsyncComponent(() => import('./About/About.vue')),
}
const activatedMenuItem = ref<MenuType>(MenuType.General)
const title = ref<string>(t('settings.title'))
const settingsWindow = ref<HTMLDivElement>()

useEventListener(window, 'resize', () => {
  createTransformer(settingsWindow, {
    x: '50%',
    y: '50%',
    notrigger: true,
    centerTarget: {
      x: true,
      y: true,
    },
  })
})

const scrollbarRef = ref()

watch(
  () => activatedMenuItem.value,
  () => {
    const osInstance = scrollbarRef.value.osInstance()
    osInstance.elements().viewport.scrollTop = 0
  },
)

const settingsMenuItems = computed((): MenuItem[] => {
  return [
    {
      value: MenuType.General,
      icon: 'i-mingcute:settings-3-line',
      iconActivated: 'i-mingcute:settings-3-fill',
      title: t('settings.menu_general'),
    },
    {
      value: MenuType.DesktopAndDock,
      icon: 'i-mingcute:imac-line',
      iconActivated: 'i-mingcute:imac-fill',
      title: t('settings.menu_desktop_and_dock'),
    },
    {
      value: MenuType.Appearance,
      title: t('settings.menu_appearance'),
      icon: 'i-mingcute:paint-brush-line',
      iconActivated: 'i-mingcute:paint-brush-fill',
    },
    {
      value: MenuType.BewlyPages,
      icon: 'i-mingcute:table-2-line',
      iconActivated: 'i-mingcute:table-2-fill',
      title: t('settings.menu_bewly_pages'),
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
      id="settings-window"
      ref="settingsWindow"
      pos="fixed top-1/2 left-1/2" w="90%" h="90%"
      max-w-1000px max-h-900px transform="~ translate-x--1/2 translate-y--1/2 gpu"
      flex="~ justify-between items-center"
    >
      <aside
        :class="{ group: !settings.touchScreenOptimization }"
        shrink-0 p="x-4" pos="absolute xl:left--84px left--44px" z-2
      >
        <ul
          style="
            box-shadow: var(--bew-shadow-4);
          "
          relative flex="~ gap-2 col" rounded="30px group-hover:25px" p-2
          bg="$bew-content-alt group-hover:$bew-elevated dark:$bew-elevated dark-group-hover:$bew-elevated"
          scale="group-hover:105" duration-300 overflow-hidden antialiased transform-gpu
        >
          <!-- frosted glass background -->
          <!-- https://github.com/BewlyBewly/BewlyBewly/issues/1162 -->
          <div
            style="
              box-shadow: var(--bew-shadow-edge-glow-2);
              backdrop-filter: var(--bew-filter-glass-2);
            "
            pos="absolute top-0 left-0" z--1
            w-full h-full pointer-events-none
            border="1 $bew-border-color" transform-gpu
            rounded-inherit duration-inherit
          />

          <li v-for="menuItem in settingsMenuItems" :key="menuItem.value">
            <a
              cursor-pointer w="40px group-hover:190px" h-40px
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
        relative overflow="x-hidden" w-full h-full bg="$bew-elevated-alt"
        shadow rounded="$bew-radius" border="1 $bew-border-color" transform-gpu
      >
        <header
          flex justify-between items-center w-full h-80px
          pos="fixed top-0 left-0" p="x-11"
          z-1 rounded="t-$bew-radius"
          style="
            text-shadow: 0 0 10px var(--bew-elevated-solid), 0 0 15px var(--bew-elevated-solid)
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
              box-shadow: var(--bew-shadow-edge-glow-1), var(--bew-shadow-2);
            "
            text="!16px hover:$bew-theme-color" w="32px" h="32px"
            flex="~ items-center justify-center shrink-0"
            bg="$bew-elevated dark:$bew-fill-1 hover:$bew-theme-color-30"
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
            pos="absolute top-80px left-0" w-full min-h="[calc(100%-80px)]" p="x-12 b-10"
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
  --uno: "text-$bew-text-auto bg-$bew-theme-color-auto";
}
</style>
