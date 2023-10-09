<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import type { DockItem } from './types'
import { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'

defineProps<{ activatedPage: AppPage }>()

const emit = defineEmits(['change-page', 'settings-visibility-change'])

const { t } = useI18n()

const tooltipPlacement = computed(() => {
  if (settings.value.dockPosition === 'left')
    return 'right'
  else if (settings.value.dockPosition === 'right')
    return 'left'
  else if (settings.value.dockPosition === 'bottom')
    return 'top'
  return 'right'
})

const currentAppColorScheme = computed((): 'dark' | 'light' => {
  if (settings.value.theme !== 'auto')
    return settings.value.theme
  else
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
})

const dockItems = computed((): DockItem[] => {
  return [
    { label: t('dock.search'), icon: 'tabler:search', page: AppPage.Search },
    { label: t('dock.home'), icon: 'tabler:home', page: AppPage.Home },
    { label: t('dock.anime'), icon: 'tabler:device-tv', page: AppPage.Anime },
    { label: t('dock.history'), icon: 'tabler:clock', page: AppPage.History },
    { label: t('dock.favorites'), icon: 'tabler:star', page: AppPage.Favorites },
    { label: t('dock.watch_later'), icon: 'iconoir:playlist-play', page: AppPage.WatchLater },
  ]
})

function toggleDark() {
  if (currentAppColorScheme.value === 'light')
    settings.value.theme = 'dark'
  else
    settings.value.theme = 'light'
}
</script>

<template>
  <aside
    class="dock-wrap"
    :class="{
      left: settings.dockPosition === 'left',
      right: settings.dockPosition === 'right',
      bottom: settings.dockPosition === 'bottom',
    }"
    pos="absolute top-0" flex="~ col" h-full justify-center z-1 pointer-events-none
  >
    <div
      class="dock-content"
      p-2 m-2 bg="$bew-content-1" flex="~ col gap-2 shrink-0"
      rounded="$bew-radius" border="1px $bew-border-color"
      shadow="$bew-shadow-2"
      backdrop-glass pointer-events-auto
    >
      <template v-for="dock in dockItems" :key="dock.page">
        <Tooltip :content="dock.label" :placement="tooltipPlacement">
          <button
            class="dock-item"
            :class="{ active: activatedPage === dock.page }"
            @click="emit('change-page', dock.page)"
          >
            <Icon :icon="dock.icon" />
          </button>
        </Tooltip>
      </template>

      <!-- dividing line -->
      <div class="divider" />

      <Tooltip :content="currentAppColorScheme === 'dark' ? $t('dock.dark_mode') : $t('dock.light_mode')" :placement="tooltipPlacement">
        <button class="dock-item" @click="toggleDark()">
          <tabler:moon-stars v-if="currentAppColorScheme === 'dark'" />
          <tabler:sun v-else />
        </button>
      </Tooltip>

      <Tooltip :content="$t('dock.settings')" :placement="tooltipPlacement">
        <button class="dock-item" @click="emit('settings-visibility-change')">
          <tabler:settings />
        </button>
      </Tooltip>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.dock-wrap {
  svg {
    --at-apply: block align-middle;
  }

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
      md:lh-45px lh-35px
      p-0 flex items-center justify-center
      aspect-square relative
      leading-0 duration-300
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

    svg {
      --at-apply: md:w-22px w-18px md:h-22px h-18px;
    }
  }
}
</style>
