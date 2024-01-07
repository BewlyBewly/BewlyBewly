<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import type { CurrentDockItem, HoveringDockItem } from './types'
import type { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'
import type { DockItem } from '~/stores/mainStore'
import { useMainStore } from '~/stores/mainStore'

defineProps<{ activatedPage: AppPage }>()

const emit = defineEmits(['change-page', 'settings-visibility-change'])

const mainStore = useMainStore()

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

const currentDockItems = computed((): CurrentDockItem[] => {
  return mainStore.dockItems.map((e: DockItem) => {
    return {
      label: t(e.i18nKey),
      icon: e.icon,
      iconActivated: e.iconActivated,
      page: e.page,
    }
  })
})

watch(() => settings.value.autoHideDock, (newValue) => {
  hideDock.value = newValue
})

onMounted(() => {
  if (settings.value.autoHideDock)
    hideDock.value = true

  if (settings.value.dockItemVisibilityList.length < currentDockItems.value.length || settings.value.dockItemVisibilityList.length > currentDockItems.value.length) {
    const newDockItemVisibilityList = ref<{ page: AppPage; visible: boolean }[]>([])
    currentDockItems.value.forEach((item) => {
      newDockItemVisibilityList.value.push({ page: item.page, visible: true })
    })

    // Compare two arrays, get the differing elements, and delete or add them to the dockItemVisibilityList
    const notInNewDockItemVisibilityList = settings.value.dockItemVisibilityList.filter(obj1 =>
      !newDockItemVisibilityList.value.some(obj2 => obj1.page === obj2.page),
    )
    const notInDockItemVisibilityList = newDockItemVisibilityList.value.filter(obj1 =>
      !settings.value.dockItemVisibilityList.some(obj2 => obj1.page === obj2.page),
    )
    const allDifferences = [...notInDockItemVisibilityList, ...notInNewDockItemVisibilityList]

    if (settings.value.dockItemVisibilityList.length < currentDockItems.value.length) {
      settings.value.dockItemVisibilityList.push(...allDifferences)
    }
    else {
      allDifferences.forEach((obj1) => {
        settings.value.dockItemVisibilityList = settings.value.dockItemVisibilityList.filter(obj2 => obj2.page !== obj1.page)
      })
    }
  }
})

function toggleDark(e: MouseEvent) {
  const isAppearanceTransition = typeof document !== 'undefined'
  // @ts-expect-error: Transition API
  && document.startViewTransition
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isAppearanceTransition) {
    if (currentAppColorScheme.value === 'light')
      settings.value.theme = 'dark'
    else
      settings.value.theme = 'light'
  }
  else {
    const x = e.clientX
    const y = e.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )
    const isDark = currentAppColorScheme.value === 'dark'
    // @ts-expect-error: Transition API
    const transition = document.startViewTransition(async () => {
      if (currentAppColorScheme.value === 'light')
        settings.value.theme = 'dark'
      else
        settings.value.theme = 'light'
      await nextTick()
    })

    transition.ready.then(() => {
      const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: isDark
            ? [...clipPath].reverse()
            : clipPath,
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: isDark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        },
      )
    })
  }
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
    pos="absolute top-0" flex="~ col" h-full justify-center z-1
    pointer-events-none
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
      <template v-for="dockItemVisibility in settings.dockItemVisibilityList" :key="dockItemVisibility.page">
        <template v-if="dockItemVisibility.visible">
          <Tooltip :content="currentDockItems.find((item) => item.page === dockItemVisibility.page)?.label as string" :placement="tooltipPlacement">
            <button
              class="dock-item"
              :class="{ active: activatedPage === dockItemVisibility.page }"
              @click="emit('change-page', dockItemVisibility.page)"
            >
              <Icon :icon="currentDockItems.find((item) => item.page === dockItemVisibility.page)?.icon as string" />
            </button>
          </Tooltip>
        </template>
      </template>

      <!-- dividing line -->
      <div class="divider" />

      <Tooltip :content="currentAppColorScheme === 'dark' ? $t('dock.dark_mode') : $t('dock.light_mode')" :placement="tooltipPlacement">
        <button
          class="dock-item"
          @click="toggleDark"
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
