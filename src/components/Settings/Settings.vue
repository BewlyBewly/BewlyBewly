<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import General from './components/General.vue'
import Appearance from './components/Appearance.vue'
import Home from './components/Home.vue'
import { MenuType } from './types'

const emit = defineEmits(['close'])

const { t } = useI18n()

const settingsMenu = { General, Appearance, Home }
const activatedMenuItem = ref<MenuType>(MenuType.General)

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
      value: MenuType.Home,
      label: t('settings.menu_home'),
    },
  ]
})

function handleClose() {
  emit('close')
}

function changeMenuItem(menuItem: MenuType) {
  activatedMenuItem.value = menuItem
}
</script>

<template>
  <div class="fixed w-full h-full top-0 left-0" z="9998" @click="handleClose" />

  <div
    id="settings-window" pos="fixed md:top-1/5 top-0 left-1/2" w="full lg:1/2 md:2/3" h="full md:1/2"
    max-w-800px transform="~ translate-x--1/2"
    z-9999 flex justify-between items-center
  >
    <aside shrink-0 px-4 pos="absolute left--82px" class="group" z-1>
      <ul
        flex="~ gap-4 col" rounded="30px hover:25px" bg="$bew-content-1" p-2 shadow="$bew-shadow-3"
        group-hover:scale-105 duration-300
        style="backdrop-filter: var(--bew-filter-glass);"
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
              <tabler:home v-else-if="item.value === MenuType.Home" />
            </i>
            <span shrink-0>{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </aside>
    <div
      relative overflow-y-scroll overflow-x-hidden w-full h-full p-8 bg="$bew-content-solid-1"
      shadow="$bew-shadow-3" rounded="$bew-radius"
    >
      <main relative>
        <header
          flex justify-between items-center w-full h-80px
          pos="fixed right-0 top-0" p-8
          bg="$bew-content-1" z-1 rounded="t-$bew-radius"
          style="backdrop-filter: var(--bew-filter-glass)"
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
        </header>

        <div h-60px />

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
