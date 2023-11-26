<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import type { DockItem, HoveringDockItem } from './types'
import { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'

defineProps<{ activatedPage: AppPage }>()

const emit = defineEmits(['change-page', 'settings-visibility-change'])

const { t } = useI18n()

const hideDock = ref<boolean>(false)

const hoveringDockItem = reactive<HoveringDockItem>({
  themeMode: false,
  settings: false,
})

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
    { label: t('dock.search'), icon: 'mingcute:search-2-line', iconActivated: 'mingcute:search-2-fill', page: AppPage.Search },
    { label: t('dock.home'), icon: 'mingcute:home-5-line', iconActivated: 'mingcute:home-5-fill', page: AppPage.Home },
    { label: t('dock.anime'), icon: 'mingcute:tv-2-line', iconActivated: 'mingcute:tv-2-fill', page: AppPage.Anime },
    { label: t('dock.favorites'), icon: 'mingcute:star-line', iconActivated: 'mingcute:star-fill', page: AppPage.Favorites },
    { label: t('dock.history'), icon: 'mingcute:time-line', iconActivated: 'mingcute:time-fill', page: AppPage.History },
    { label: t('dock.watch_later'), icon: 'mingcute:carplay-line', iconActivated: 'mingcute:carplay-fill', page: AppPage.WatchLater },
  ]
})

onMounted(() => {
  if (settings.value.autoHideDock)
    hideDock.value = true
})

function toggleDark() {
  if (currentAppColorScheme.value === 'light')
    settings.value.theme = 'dark'
  else
    settings.value.theme = 'light'
}

function toggleDockHide(hide: boolean) {
  if (settings.value.autoHideDock)
    hideDock.value = hide
  else
    hideDock.value = false
}
</script>

<template>
  <aside
    class="dock-wrap"
    :class="{
      left: settings.dockPosition === 'left',
      right: settings.dockPosition === 'right',
      bottom: settings.dockPosition === 'bottom',
      hide: hideDock,
    }"
    pos="absolute top-0" flex="~ col" h-full justify-center z-1 pointer-events-none
    @mouseenter="toggleDockHide(false)"
    @mouseleave="toggleDockHide(true)"
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

            <!-- <Icon v-if="activatedPage === dock.page" :icon="dock.iconActivated" />
            <Icon v-else :icon="dock.icon" /> -->
          </button>
        </Tooltip>
      </template>

      <!-- dividing line -->
      <div class="divider" />

      <Tooltip :content="currentAppColorScheme === 'dark' ? $t('dock.dark_mode') : $t('dock.light_mode')" :placement="tooltipPlacement">
        <button
          class="dock-item"
          @click="toggleDark()"
          @mouseenter="hoveringDockItem.themeMode = true"
          @mouseleave="hoveringDockItem.themeMode = false"
        >
          <Transition name="fade">
            <div v-show="hoveringDockItem.themeMode" absolute>
              <line-md:sunny-outline-to-moon-loop-transition v-if="currentAppColorScheme === 'dark'" />
              <line-md:moon-alt-to-sunny-outline-loop-transition v-else />
            </div>
          </Transition>
          <Transition name="fade">
            <div v-show="!hoveringDockItem.themeMode" absolute>
              <line-md:sunny-outline-to-moon-transition v-if="currentAppColorScheme === 'dark'" />
              <line-md:moon-to-sunny-outline-transition v-else />
            </div>
          </Transition>
        </button>
      </Tooltip>

      <Tooltip :content="$t('dock.settings')" :placement="tooltipPlacement">
        <button class="dock-item" @click="emit('settings-visibility-change')">
          <mingcute:settings-3-line />
        </button>
      </Tooltip>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.dock-wrap {
  --at-apply: duration-300 ease-in-out
    after:content-empty after:absolute
    after:w-[calc(100%+14px)] after:h-[calc(100%+14px)] after:z--1
    after:pointer-events-auto;

  svg {
    --at-apply: block align-middle;
  }

  &.left {
    --at-apply: left-2 after:right--4px;
  }
  &.left.hide {
    --at-apply: opacity-0 translate-x--100%;
  }

  &.right {
    --at-apply: right-2 after:left--4px;
  }
  &.right.hide {
    --at-apply: opacity-0 translate-x-100%;
  }

  &.bottom {
    --at-apply: top-unset bottom-0 items-center w-full h-[fit-content]
      after:top--10px after:w-full;

    .dock-content {
      --at-apply: flex-row;
    }
  }
  &.bottom.hide {
    --at-apply: opacity-0 translate-y-100%;
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
