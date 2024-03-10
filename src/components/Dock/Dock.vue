<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { usePreferredDark } from '@vueuse/core'
import type { HoveringDockItem } from './types'
import { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'
import type { DockItem } from '~/stores/mainStore'
import { useMainStore } from '~/stores/mainStore'

defineProps<{ activatedPage: AppPage }>()

const emit = defineEmits(['change-page', 'settings-visibility-change'])
const { mainAppRef } = useBewlyApp()

const mainStore = useMainStore()

const hideDock = ref<boolean>(false)
const hoveringDockItem = reactive<HoveringDockItem>({
  themeMode: false,
  settings: false,
})
const currentDockItems = ref<DockItem[]>([])

const tooltipPlacement = computed(() => {
  if (settings.value.dockPosition === 'left')
    return 'right'
  else if (settings.value.dockPosition === 'right')
    return 'left'
  else if (settings.value.dockPosition === 'bottom')
    return 'top'
  return 'right'
})

const isPreferredDark = usePreferredDark()
const currentSystemColorScheme = computed(() => isPreferredDark.value ? 'dark' : 'light')

const currentAppColorScheme = computed((): 'dark' | 'light' => {
  if (settings.value.theme !== 'auto')
    return settings.value.theme
  else
    return currentSystemColorScheme.value
})

watch(() => settings.value.autoHideDock, (newValue) => {
  hideDock.value = newValue
})

// use Json stringify to watch the changes of the array item properties
watch(() => JSON.stringify(settings.value.dockItemVisibilityList), () => {
  currentDockItems.value = computeDockItem()
})

function computeDockItem(): DockItem[] {
  // if dockItemVisibilityList not fresh , set it to default
  if (!settings.value.dockItemVisibilityList.length || settings.value.dockItemVisibilityList.length !== mainStore.dockItems.length)
    settings.value.dockItemVisibilityList = mainStore.dockItems.map(dock => ({ page: dock.page, visible: true }))

  const targetDockItems: DockItem[] = []

  settings.value.dockItemVisibilityList.forEach((item) => {
    const foundItem = mainStore.dockItems.find(defaultItem => defaultItem.page === item.page)
    item.visible && targetDockItems.push({
      i18nKey: foundItem?.i18nKey || '',
      icon: foundItem?.icon || '',
      iconActivated: foundItem?.iconActivated || '',
      page: foundItem?.page || AppPage.Home,
    })
  })
  return targetDockItems
}

onMounted(() => {
  if (settings.value.autoHideDock)
    hideDock.value = true

  currentDockItems.value = computeDockItem()
})

function toggleDark(e: MouseEvent) {
  const updateThemeSettings = () => {
    if (currentAppColorScheme.value !== currentSystemColorScheme.value)
      settings.value.theme = 'auto'
    else
      settings.value.theme = isPreferredDark.value ? 'light' : 'dark'
  }

  const isAppearanceTransition = typeof document !== 'undefined'
  // @ts-expect-error: Transition API
    && document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isAppearanceTransition) {
    updateThemeSettings()
  }
  else {
    const x = e.clientX
    const y = e.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )
    // https://github.com/vueuse/vueuse/pull/3129
    const style = document.createElement('style')
    const styleString = `
    *, *::before, *::after
    {-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
    style.appendChild(document.createTextNode(styleString))
    document.head.appendChild(style)

    // Since the above normal dom style cannot be applied in shadow dom style
    // We need to add this style again to the shadow dom
    const shadowDomStyle = document.createElement('style')
    const shadowDomStyleString = `
    *, *::before, *::after
    {-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important; will-change: background}`
    shadowDomStyle.appendChild(document.createTextNode(shadowDomStyleString))
    mainAppRef.value.appendChild(shadowDomStyle)

    // @ts-expect-error: Transition API
    const transition = document.startViewTransition(async () => {
      updateThemeSettings()
      await nextTick()
    })

    transition.ready.then(() => {
      const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      const animation = document.documentElement.animate(
        {
          clipPath: currentAppColorScheme.value === 'dark'
            ? [...clipPath].reverse()
            : clipPath,
        },
        {
          duration: 300,
          easing: 'ease-in-out',
          pseudoElement: currentAppColorScheme.value === 'dark'
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        },
      )
      animation.addEventListener('finish', () => {
        document.head.removeChild(style!)
        mainAppRef.value.removeChild(shadowDomStyle!)
      }, { once: true })
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
    pos="absolute top-0" flex="~ col justify-center items-center" w-full h-full
    z-1 pointer-events-none
  >
    <!-- Edge div -->
    <div
      v-if="settings.autoHideDock"
      class="dock-edge"
      :class="`dock-edge-${settings.dockPosition}`"
      @mouseenter="toggleDockHide(false)"
      @mouseleave="toggleDockHide(true)"
    />

    <div
      class="dock-content"
      :class="{
        left: settings.dockPosition === 'left',
        right: settings.dockPosition === 'right',
        bottom: settings.dockPosition === 'bottom',
        hide: hideDock,
      }"
      style="backdrop-filter: var(--bew-filter-glass-1);"
      absolute duration-300 ease-in-out
      p-2 m-2 bg="$bew-content-1" flex="~ col gap-2 shrink-0"
      rounded="60px" border="1px $bew-border-color"
      shadow="$bew-shadow-2"
      @mouseenter="toggleDockHide(false)"
      @mouseleave="toggleDockHide(true)"
    >
      <template v-for="dockItem in currentDockItems" :key="dockItem.page">
        <Tooltip :content="$t(dockItem.i18nKey)" :placement="tooltipPlacement">
          <button
            class="dock-item"
            :class="{ active: activatedPage === dockItem.page }"
            @click="emit('change-page', dockItem.page)"
          >
            <Icon
              v-show="activatedPage !== dockItem.page"
              :icon="dockItem.icon"
            />
            <Icon
              v-show="activatedPage === dockItem.page"
              :icon="dockItem.iconActivated"
            />
          </button>
        </Tooltip>
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
  > * {
    --at-apply: pointer-events-auto;
  }
}

.dock-edge {
  &-left, &-right, &-bottom {
    --at-apply: absolute z--1;
  }

  &-left {
    --at-apply: left-0 top-0 w-14px h-full hover:w-60px;
  }

  &-right {
    --at-apply: right-0 top-0 w-14px h-full hover:w-60px;
  }

  &-bottom {
    --at-apply: left-0 bottom-0 w-full h-14px hover-h-60px;
  }
}

.dock-content {
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
    --at-apply: top-unset bottom-0 flex-row;
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
}

.dock-item {
  --shadow-dark: 0 0 30px 4px rgba(255, 255, 255, 0.6);
  --shadow-active: 0 0 20px var(--bew-theme-color-50);
  --shadow-dark-active: 0 0 20px rgba(255, 255, 255, 0.6);

  --at-apply: transform active:scale-90
    md:w-45px w-35px
    md:lh-45px lh-35px
    p-0 flex items-center justify-center
    aspect-square relative
    leading-0 duration-300
    rounded-60px
    bg-$bew-fill-1 cursor-pointer
    hover:bg-$bew-fill-3 hover:scale-110
    active:important-scale-100;

  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.05);

  &.active {
    --at-apply: bg-$bew-theme-color-auto text-$bew-text-auto
      shadow-$shadow-active  dark:shadow-$shadow-dark
      active:shadow-$shadow-active dark-active:shadow-$shadow-dark-active;
  }

  svg {
    --at-apply: md:w-22px w-18px md:h-22px h-18px block align-middle;
  }
}

.dark .dock-item {
  box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.08);
}
</style>
