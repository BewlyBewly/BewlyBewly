<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import General from './components/General.vue'
import Appearance from './components/Appearance.vue'
import SearchPage from './components/SearchPage.vue'
import Home from './components/Home.vue'
import About from './components/About.vue'
import { MenuType } from './types'
import { settings } from '~/logic'

const emit = defineEmits(['close'])

const { t } = useI18n()

const settingsMenu = { General, Appearance, SearchPage, Home, About }
const activatedMenuItem = ref<MenuType>(MenuType.General)
const title = ref<string>(t('settings.title'))

const settingsMenuItems = computed(() => {
  return [
    {
      value: MenuType.General,
      label: t('settings.menu_general'),
    },
    {
      value: MenuType.Appearance,
      label: t('settings.menu_appearance'),
    },
    {
      value: MenuType.SearchPage,
      label: t('settings.menu_search_page'),
    },
    {
      value: MenuType.Home,
      label: t('settings.menu_home'),
    },
    {
      value: MenuType.About,
      label: t('settings.menu_about'),
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
  emit('close')
}

function changeMenuItem(menuItem: MenuType) {
  activatedMenuItem.value = menuItem
  setCurrentTitle()
}

function setCurrentTitle() {
  settingsMenuItems.value.forEach((item) => {
    if (item.value === activatedMenuItem.value)
      title.value = item.label
  })
}
</script>

<template>
  <div class="fixed w-full h-full top-0 left-0" z="9998" opacity-60 :style="{ backgroundColor: isHomePage ? '' : 'var(--bew-bg)' }" @click="handleClose" />

  <div
    id="settings-window" pos="fixed top-1/2 left-1/2" w="90%" h="90%"
    max-w-900px max-h-800px transform="~ translate-x--1/2 translate-y--1/2"
    z-9999 flex justify-between items-center
  >
    <aside class="group" shrink-0 p="x-4" pos="absolute left--42px" z-2>
      <ul
        flex="~ gap-2 col" rounded="30px hover:25px" bg="$bew-elevated-2" p-2 shadow="$bew-shadow-3"
        scale="group-hover:105" duration-300
        backdrop-glass
      >
        <li v-for="item in settingsMenuItems" :key="item.value">
          <a
            cursor-pointer w="40px group-hover:150px" h-40px
            rounded-30px flex items-center overflow-x-hidden
            duration-300 un-text="hover:white dark-hover:!black" bg="dark-hover:white hover:$bew-theme-color"
            :class="{ 'menu-item-activated': item.value === activatedMenuItem }"
            @click="changeMenuItem(item.value)"
          >
            <i w-40px text="xl center" flex="~ shrink-0" justify-center>
              <tabler:settings v-if="item.value === MenuType.General" />
              <tabler:brush v-else-if="item.value === MenuType.Appearance" />
              <tabler:search v-else-if="item.value === MenuType.SearchPage" />
              <tabler:home v-else-if="item.value === MenuType.Home" />
              <tabler:info-circle v-else-if="item.value === MenuType.About" />
            </i>
            <span shrink-0>{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </aside>

    <div
      relative overflow-hidden w-full h-full bg="$bew-elevated-solid-1"
      shadow="$bew-shadow-3" rounded="$bew-radius"
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
        <div text="3xl">
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

      <main relative h-full py-8 p="x-12" overflow-y-overlay>
        <!-- <header
          flex justify-between items-center w-full h-60px
          pos="fixed top-0 left-0"
          px-10
          bg="$bew-content-1" z-1 rounded="t-$bew-radius"
        >
          <div text="3xl">
            {{ $t('settings.title') }}
          </div>
          <div
            text-2xl leading-0 bg="$bew-fill-1" w="32px" h="32px" p="1" rounded-8 shadow="md" cursor="pointer"
            @click="handleClose"
          >
            <ic-baseline-clear />
          </div>
        </header> -->

        <div h-80px mt--8 />

        <Component :is="settingsMenu[activatedMenuItem]" />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-item-activated {
  --at-apply: text-white dark-text-black
    dark-bg-white bg-$bew-theme-color
}
</style>
