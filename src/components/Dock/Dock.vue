<script setup lang="ts">
import { useDark } from '~/composables/useDark'
import { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'
import type { DockItem } from '~/stores/mainStore'
import { useMainStore } from '~/stores/mainStore'

import Tooltip from '../Tooltip.vue'
import type { HoveringDockItem } from './types'

defineProps<{ activatedPage: AppPage }>()

const emit = defineEmits(['change-page', 'settings-visibility-change'])

const mainStore = useMainStore()
const { isDark, toggleDark } = useDark()

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
      v-if="settings.autoHideDock && hideDock"
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
      absolute duration-300 ease-in-out transform-gpu
      p-2 m-2 bg="$bew-content-2 dark:$bew-elevated-1" flex="~ col gap-2 shrink-0"
      rounded="60px" border="1px $bew-border-color"
      shadow="$bew-shadow-2"
      @mouseenter="toggleDockHide(false)"
      @mouseleave="toggleDockHide(true)"
    >
      <template v-for="dockItem in currentDockItems" :key="dockItem.page">
        <Tooltip :content="$t(dockItem.i18nKey)" :placement="tooltipPlacement">
          <button
            class="dock-item group"
            :class="{ active: activatedPage === dockItem.page }"
            @click="emit('change-page', dockItem.page)"
          >
            <div
              v-show="activatedPage !== dockItem.page"
              :class="dockItem.icon"
              text-xl
            />
            <div
              v-show="activatedPage === dockItem.page"
              :class="dockItem.iconActivated"
              text-xl
            />
          </button>
        </Tooltip>
      </template>

      <!-- dividing line -->
      <div class="divider" />

      <Tooltip :content="isDark ? $t('dock.dark_mode') : $t('dock.light_mode')" :placement="tooltipPlacement">
        <button
          class="dock-item"
          @click="toggleDark"
          @mouseenter="hoveringDockItem.themeMode = true"
          @mouseleave="hoveringDockItem.themeMode = false"
        >
          <Transition name="fade">
            <div v-show="hoveringDockItem.themeMode" absolute>
              <div v-if="isDark" i-line-md:sunny-outline-to-moon-loop-transition text-xl />
              <div v-else i-line-md:moon-alt-to-sunny-outline-loop-transition text-xl />
            </div>
          </Transition>
          <Transition name="fade">
            <div v-show="!hoveringDockItem.themeMode" absolute>
              <div v-if="isDark" i-line-md:sunny-outline-to-moon-transition text-xl />
              <div v-else i-line-md:moon-to-sunny-outline-transition text-xl />
            </div>
          </Transition>
        </button>
      </Tooltip>

      <Tooltip :content="$t('dock.settings')" :placement="tooltipPlacement">
        <button class="dock-item" @click="emit('settings-visibility-change')">
          <div i-mingcute:settings-3-line text-xl />
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
  --shadow-dark: 0 4px 30px 4px rgba(255, 255, 255, 0.6);
  --shadow-active: 0 4px 30px var(--bew-theme-color-70);
  --shadow-dark-active: 0 4px 20px rgba(255, 255, 255, 0.8);
  --shadow-active-active: 0 4px 20px var(--bew-theme-color-90);

  --at-apply: transform active:important-scale-90 hover:scale-110
    md:w-45px w-35px
    md:lh-45px lh-35px
    p-0 flex items-center justify-center
    aspect-square relative
    leading-0
    rounded-60px antialiased
    bg-$bew-content-1 hover:bg-$bew-fill-2 cursor-pointer
    dark:bg-$bew-fill-1 dark-hover:bg-$bew-fill-4;

  box-shadow: var(--bew-shadow-edge-glow-1), var(--bew-shadow-1);
  transition: transform 300ms cubic-bezier(0.34, 2, 0.6, 1), background 300ms ease, color 300ms ease, box-shadow 600ms ease;

  &:hover {
    box-shadow: var(--bew-shadow-edge-glow-1), 0 0 0 2px var(--bew-fill-2), var(--bew-shadow-2);
  }

  &.active {
    --at-apply: important-bg-$bew-theme-color-auto text-$bew-text-auto
      shadow-$shadow-active  dark:shadow-$shadow-dark
      active:shadow-$shadow-active-active dark-active:shadow-$shadow-dark-active;
  }

  svg {
    --at-apply: md:w-22px w-18px md:h-22px h-18px block align-middle;
  }
}
</style>
