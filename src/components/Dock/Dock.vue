<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { computed, ref } from 'vue'

import { useBewlyApp } from '~/composables/useAppProvider'
import { useDark } from '~/composables/useDark'
import { useDelayedHover } from '~/composables/useDelayedHover'
import { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'
import type { DockItem } from '~/stores/mainStore'
import { useMainStore } from '~/stores/mainStore'
import { isHomePage, openLinkToNewTab } from '~/utils/main'

import Tooltip from '../Tooltip.vue'
import type { HoveringDockItem } from './types'

const props = defineProps<{
  activatedPage: AppPage
}>()

// const emit = defineEmits(['pageChange', 'settingsVisibilityChange', 'refresh', 'backToTop'])
const emit = defineEmits<{
  (e: 'dockItemClick', dockItem: DockItem): void
  (e: 'dockItemMiddleClick', dockItem: DockItem): void
  (e: 'settingsVisibilityChange'): void
  (e: 'refresh'): void
  (e: 'backToTop'): void
}>()

const mainStore = useMainStore()
const { isDark, toggleDark } = useDark()
const { reachTop } = useBewlyApp()

const hideDock = ref<boolean>(false)
const dockContentHover = ref<boolean>(false)
const dockContentRef = useDelayedHover({
  enterDelay: 100,
  leaveDelay: 600,
  enter: () => {
    dockContentHover.value = true
    toggleHideDock(false)
  },
  leave: () => {
    dockContentHover.value = false
    toggleHideDock(true)
  },
})

const hoveringDockItem = reactive<HoveringDockItem>({
  themeMode: false,
  settings: false,
})
const currentDockItems = ref<DockItem[]>([])
const activatedDockItem = ref<DockItem>()

const tooltipPlacement = computed(() => {
  if (settings.value.dockPosition === 'left')
    return 'right'
  else if (settings.value.dockPosition === 'right')
    return 'left'
  else if (settings.value.dockPosition === 'bottom')
    return 'top'
  return 'right'
})

/**
 * Whether to show the back to top or refresh button
 */
const showBackToTopOrRefreshButton = computed((): boolean => {
  const dockItemConfig = settings.value.dockItemsConfig.find(e => e.page === props.activatedPage)
  if (dockItemConfig && dockItemConfig.useOriginalBiliPage) {
    return false
  }

  return props.activatedPage !== AppPage.Search && isHomePage()
})

watch(() => settings.value.autoHideDock, (newValue) => {
  hideDock.value = newValue
}, { immediate: true })

// use Json stringify to watch the changes of the array item properties
watch(() => JSON.stringify(settings.value.dockItemsConfig), () => {
  currentDockItems.value = computeDockItem()
}, { immediate: true })

function computeDockItem(): DockItem[] {
  // Transfer the data from dockItemVisibilityList into dockItemsConfig
  if (settings.value.dockItemVisibilityList.length > 0 && settings.value.dockItemsConfig.length === 0) {
    settings.value.dockItemsConfig = settings.value.dockItemVisibilityList.map(item =>
      ({
        page: item.page,
        visible: item.visible,
        openInNewTab: false,
        useOriginalBiliPage: false,
      }))
  }

  if (Array.isArray(settings.value.dockItemsConfig) && settings.value.dockItemsConfig.length < mainStore.dockItems.length) {
    // Add missing items to dockItemsConfig
    const missingItems = mainStore.dockItems.filter(dock => !settings.value.dockItemsConfig.some(item => item.page === dock.page))
    settings.value.dockItemsConfig = [
      ...settings.value.dockItemsConfig,
      ...missingItems.map(dock => ({ page: dock.page, visible: true, openInNewTab: false, useOriginalBiliPage: false })),
    ]
  }
  // if dockItemVisibilityList not fresh , set it to default
  else if (!Array.isArray(settings.value.dockItemsConfig) || settings.value.dockItemsConfig.length !== mainStore.dockItems.length) {
    settings.value.dockItemsConfig = mainStore.dockItems.map(dock =>
      ({ page: dock.page, visible: true, openInNewTab: false, useOriginalBiliPage: false }),
    )
  }

  const targetDockItems: DockItem[] = []

  settings.value.dockItemsConfig.forEach((item) => {
    const foundItem = mainStore.dockItems.find(defaultItem => defaultItem.page === item.page)
    // If the dock item does not have Bewly page, then use the original BiliBili page
    if (!foundItem?.hasBewlyPage)
      item.useOriginalBiliPage = true

    item.visible && targetDockItems.push({
      i18nKey: foundItem?.i18nKey || '',
      icon: foundItem?.icon || '',
      iconActivated: foundItem?.iconActivated || '',
      page: foundItem?.page || AppPage.Home,
      openInNewTab: item.openInNewTab,
      useOriginalBiliPage: item.useOriginalBiliPage || !foundItem?.hasBewlyPage,
      url: foundItem?.url || '',
      hasBewlyPage: foundItem?.hasBewlyPage || false,
    })
  })
  return targetDockItems
}

function toggleHideDock(hide: boolean) {
  if (settings.value.autoHideDock)
    hideDock.value = hide
  else
    hideDock.value = false
}

function handleDockItemClick($event: MouseEvent, dockItem: DockItem) {
  if ($event.ctrlKey || $event.metaKey) {
    openDockItemInNewTab(dockItem)
    return
  }

  activatedDockItem.value = dockItem
  emit('dockItemClick', dockItem)
}

function openDockItemInNewTab(dockItem: DockItem) {
  activatedDockItem.value = dockItem
  openLinkToNewTab(`https://www.bilibili.com/?page=${dockItem.page}`)
}

function handleBackToTopOrRefresh(action: 'backToTop' | 'refresh' | 'auto' = 'auto') {
  if (action === 'backToTop') {
    emit('backToTop')
  }
  else if (action === 'refresh') {
    emit('refresh')
    emit('backToTop')
  }
  else {
    if (reachTop.value)
      emit('refresh')
    else
      emit('backToTop')
  }
}

function isDockItemActivated(dockItem: DockItem): boolean {
  return props.activatedPage === dockItem.page && isHomePage()
}

const { width: windowWidth, height: windowHeight } = useWindowSize()
const { width: dockWidth, height: dockHeight } = useElementSize(dockContentRef)

const dockScale = computed((): number => {
  if (!dockHeight.value || !dockWidth.value)
    return 1

  const maxAllowedHeight = windowHeight.value - 180
  const maxAllowedWidth = windowWidth.value - 180

  // Calculate scale factors for both dimensions
  const heightScale = dockHeight.value > maxAllowedHeight
    ? maxAllowedHeight / dockHeight.value
    : 1

  const widthScale = dockWidth.value > maxAllowedWidth
    ? maxAllowedWidth / dockWidth.value
    : 1

  // Use the smaller scale to ensure dock fits in both dimensions
  return Math.min(heightScale, widthScale)
})

const dockTransformStyle = computed((): { transform: string, transformOrigin: string } => {
  const position = settings.value.dockPosition
  const scale = dockScale.value
  dockContentRef.value?.style.setProperty('--scale', `${scale}`)

  // Adjust origin based on dock position
  const origin = {
    left: 'left center',
    right: 'right center',
    bottom: 'center bottom',
  }[position] || 'center center'

  return {
    transform: `scale(${scale})`,
    transformOrigin: origin,
  }
})
</script>

<template>
  <aside
    class="dock-wrap"
    pos="fixed top-0" z-100 flex="~ col justify-center items-center" w-full h-full
    z-10 pointer-events-none
  >
    <!-- Edge Div -->
    <div
      v-if="settings.autoHideDock && hideDock"
      class="dock-edge"
      :class="`dock-edge-${settings.dockPosition}`"
      @mouseenter="toggleHideDock(false)"
      @mouseleave="toggleHideDock(true)"
    />

    <!-- Dock Content -->
    <div
      ref="dockContentRef"
      class="dock-content"
      :class="{
        'left': settings.dockPosition === 'left',
        'right': settings.dockPosition === 'right',
        'bottom': settings.dockPosition === 'bottom',
        'hide': hideDock,
        'half-hide': settings.halfHideDock,
        'hover': dockContentHover,
      }"
      :style="dockTransformStyle"
      @mouseenter="toggleHideDock(false)"
      @mouseleave="toggleHideDock(true)"
    >
      <div
        class="dock-content-inner"
      >
        <template v-for="dockItem in currentDockItems" :key="dockItem.page">
          <Tooltip :content="$t(dockItem.i18nKey)" :placement="tooltipPlacement">
            <button
              class="dock-item group"
              :class="{
                'active': isDockItemActivated(dockItem),
                'inactive': hoveringDockItem.themeMode && isDark,
                'disable-glowing-effect': settings.disableDockGlowingEffect,
              }"
              @click="handleDockItemClick($event, dockItem)"
              @click.middle="openDockItemInNewTab(dockItem)"
            >
              <div
                v-show="!isDockItemActivated(dockItem)"
                :class="dockItem.icon"
                text-xl
              />
              <div
                v-show="isDockItemActivated(dockItem)"
                :class="dockItem.iconActivated"
                text-xl
              />
            </button>
          </Tooltip>
        </template>

        <!-- dividing line -->
        <div class="divider" />

        <Tooltip
          v-if="!settings.disableLightDarkModeSwitcherOnDock"
          :content="isDark ? $t('dock.dark_mode') : $t('dock.light_mode')" :placement="tooltipPlacement"
          class="group"
          pointer-events-none
        >
          <!-- moon -->
          <div
            v-if="isDark"
            pos="absolute top-0 left-0 group-hover:top-2px group-hover:left--4px"
            w-full h-full bg-white rounded="1/2"
            z--2 pointer-events-none
            :shadow="
              settings.disableDockGlowingEffect
                ? 'none'
                : 'group-hover:[-8px_4px_160px_20px_hsla(226deg,85%,77%,1),-8px_4px_100px_12px_hsla(226deg,85%,77%,0.8),-8px_4px_60px_10px_hsla(226deg,85%,77%,0.6),-8px_4px_20px_4px_hsla(226deg,85%,77%,0.4),-4px_2px_8px_0_hsla(226deg,85%,77%,0.8)]'"
            opacity-0 group-hover:opacity-100
            duration-600
          />

          <button
            class="dock-item"
            bg="!dark-hover:$bew-bg" transform="!dark-hover:scale-100"
            :shadow="settings.disableDockGlowingEffect ? 'none' : '!dark-hover:[inset_4px_-2px_8px_hsla(226deg,85%,77%,1)]'"
            pointer-events-auto
            @click="toggleDark"
            @mouseenter="hoveringDockItem.themeMode = true"
            @mouseleave="hoveringDockItem.themeMode = false"
          >
            <Transition name="fade">
              <div v-show="hoveringDockItem.themeMode" absolute>
                <Icon v-if="isDark" icon="line-md:sunny-outline-to-moon-loop-transition" />
                <Icon v-else icon="line-md:moon-alt-to-sunny-outline-loop-transition" />
              </div>
            </Transition>
            <Transition name="fade">
              <div v-show="!hoveringDockItem.themeMode" absolute>
                <Icon v-if="isDark" icon="line-md:sunny-outline-to-moon-transition" />
                <Icon v-else icon="line-md:moon-to-sunny-outline-transition" />
              </div>
            </Transition>
          </button>
        </Tooltip>

        <Tooltip :content="$t('dock.settings')" :placement="tooltipPlacement">
          <button
            class="dock-item group"
            :class="{
              inactive: hoveringDockItem.themeMode && isDark,
            }"
            @click="emit('settingsVisibilityChange')"
          >
            <div i-mingcute:settings-3-line text-xl group-hover:rotate-180 transition="all 2000 ease-out" />
          </button>
        </Tooltip>
      </div>

      <!-- Back to top & refresh buttons -->
      <div
        v-if="showBackToTopOrRefreshButton"
        :style="{
          bottom: settings.dockPosition === 'bottom' ? 'unset' : 0,
          right: settings.dockPosition === 'bottom' ? 0 : 'unset',
          transform: settings.dockPosition === 'bottom' ? 'translate(100%, 0)' : 'translateY(100%)',
          flexDirection: settings.dockPosition === 'bottom' ? 'row' : 'column',
        }"
        pos="absolute"
        flex="~ gap-2"
      >
        <template
          v-if="settings.backToTopAndRefreshButtonsAreSeparated"
        >
          <template v-for="key in 2" :key="key">
            <Transition name="fade">
              <button
                v-if="key === 1 || key === 2 && !reachTop"
                class="back-to-top-or-refresh-btn"
                :class="{
                  inactive: hoveringDockItem.themeMode && isDark,
                }"
                @click="handleBackToTopOrRefresh(key === 1 ? 'refresh' : 'backToTop')"
              >
                <Icon
                  v-if="key === 1"
                  icon="line-md:rotate-270"
                  shrink-0 rotate-90 absolute text-2xl
                />
                <Icon
                  v-else
                  icon="line-md:arrow-small-up"
                  shrink-0 absolute text-2xl
                />
              </button>
            </Transition>
          </template>
        </template>
        <template v-else>
          <button
            class="back-to-top-or-refresh-btn"
            :class="{
              inactive: hoveringDockItem.themeMode && isDark,
            }"
            @click="handleBackToTopOrRefresh('auto')"
          >
            <Transition name="fade">
              <Icon
                v-if="reachTop"
                icon="line-md:rotate-270"
                shrink-0 rotate-90 absolute text-2xl
              />
              <Icon
                v-else
                icon="line-md:arrow-small-up"
                shrink-0 absolute text-2xl
              />
            </Transition>
          </button>
        </template>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.dock-wrap {
  > * {
    --uno: "pointer-events-auto";
  }
}

.dock-edge {
  &-left,
  &-right,
  &-bottom {
    --uno: "absolute z--1";
  }

  &-left {
    --uno: "left-0 top-0 w-14px h-full hover:w-60px";
  }

  &-right {
    --uno: "right-0 top-0 w-14px h-full hover:w-60px";
  }

  &-bottom {
    --uno: "left-0 bottom-0 w-full h-14px hover-h-60px";
  }
}

.dock-content {
  --uno: "absolute flex justify-center items-center duration-300 scale-$scale";

  &.left {
    --uno: "left-2 after:right--4px";
  }
  &.left.hide:not(.hover) {
    --uno: "opacity-0 !translate-x--100%";
  }
  &.left.half-hide:not(.hover) {
    --uno: "!opacity-60 !translate-x--50%";
  }

  &.right {
    --uno: "right-2 after:left--4px";
  }
  &.right.hide:not(.hover) {
    --uno: "opacity-0 !translate-x-100%";
  }
  &.right.half-hide:not(.hover) {
    --uno: "!opacity-60 !translate-x-50%";
  }

  &.bottom {
    --uno: "top-unset bottom-0";
  }
  &.bottom.hide:not(.hover) {
    --uno: "opacity-0 !translate-y-100%";
  }
  &.bottom.half-hide:not(.hover) {
    --uno: "!opacity-60 !translate-y-50%";
  }

  .divider {
    --uno: "my-1 mx-3 h-3px bg-$bew-border-color rounded-4";
  }

  &.bottom .divider {
    --uno: "w-3px h-auto my-3 mx-1";
  }

  .dock-content-inner {
    --uno: "duration-300 ease-in-out transform-gpu";
    --uno: "p-2 m-2 bg-$bew-content-alt dark:bg-$bew-elevated";
    --uno: "flex flex-col gap-2 shrink-0";
    --uno: "rounded-full border-1 border-$bew-border-color";
    box-shadow: var(--bew-shadow-edge-glow-1), var(--bew-shadow-2);
    backdrop-filter: var(--bew-filter-glass-1);
  }

  &.bottom .dock-content-inner {
    --uno: "flex-row";
  }

  .back-to-top-or-refresh-btn {
    --uno: "transform active:important-scale-90 hover:scale-110";
    --uno: "lg:w-45px w-35px lg:h-45px h-35px";
    --uno: "grid place-items-center";
    --uno: "filter-$bew-filter-glass-1";
    --uno: "bg-$bew-elevated hover:bg-$bew-content-hover";
    --uno: "rounded-full shadow-$bew-shadow-2 border-1 border-$bew-border-color";

    backdrop-filter: var(--bew-filter-glass-1);
    transition:
      transform 300ms cubic-bezier(0.34, 2, 0.6, 1),
      background 300ms ease,
      color 300ms ease,
      box-shadow 300ms ease,
      opacity 600ms ease;
    box-shadow: var(--bew-shadow-edge-glow-1), var(--bew-shadow-2);

    &.active {
      --uno: "important-bg-$bew-theme-color-auto text-$bew-text-auto";
      --uno: "shadow-$shadow-active dark:shadow-$shadow-dark";
      --uno: "active:shadow-$shadow-active-active dark-active:shadow-$shadow-dark-active";
    }

    &.inactive {
      --uno: "opacity-80 !shadow-none";
    }
  }

  &.bottom .back-to-top-or-refresh-btn {
    --uno: "bottom-unset lg:right--45px right--35px";
  }
}

.dock-item {
  --shadow-dark: 0 4px 30px 4px rgba(255, 255, 255, 0.6);
  --shadow-active: 0 4px 30px var(--bew-theme-color-60);
  --shadow-dark-active: 0 4px 20px rgba(255, 255, 255, 0.8);
  --shadow-active-active: 0 4px 20px var(--bew-theme-color-80);

  --uno: "relative transform active:important-scale-90 hover:scale-110";
  --uno: "lg:w-45px w-35px";
  --uno: "lg:lh-45px lh-35px";
  --uno: "p-0 flex items-center justify-center";
  --uno: "aspect-square relative";
  --uno: "leading-0";
  --uno: "rounded-60px antialiased";
  --uno: "bg-$bew-fill-alt hover:bg-$bew-fill-2 cursor-pointer";
  --uno: "dark:bg-$bew-fill-1 dark-hover:bg-$bew-fill-4";

  box-shadow: var(--bew-shadow-edge-glow-1), var(--bew-shadow-1);
  transition:
    transform 300ms cubic-bezier(0.34, 2, 0.6, 1),
    background 300ms ease,
    color 300ms ease,
    box-shadow 600ms ease,
    opacity 600ms ease;

  &:hover {
    box-shadow:
      var(--bew-shadow-edge-glow-1),
      0 0 0 2px var(--bew-fill-2),
      var(--bew-shadow-2);
  }

  &.disable-glowing-effect {
    box-shadow: var(--bew-shadow-edge-glow-1), var(--bew-shadow-1) !important;
  }

  &.active {
    --uno: "important-bg-$bew-theme-color text-white !dark:bg-white !dark:text-black";
    --uno: "shadow-$shadow-active dark:shadow-$shadow-dark";
    --uno: "active:shadow-$shadow-active-active dark-active:shadow-$shadow-dark-active";
  }

  &.inactive {
    --uno: "opacity-80 !shadow-none";
  }

  svg {
    --uno: "lg:w-22px w-18px lg:h-22px h-18px block align-middle";
  }
}
</style>
