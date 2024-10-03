<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { useDark } from '~/composables/useDark'
import { useDelayedHover } from '~/composables/useDelayedHover'
import { settings } from '~/logic'

import Tooltip from '../Tooltip.vue'
import type { HoveringDockItem } from './types'

const emit = defineEmits(['settings-visibility-change'])
const { isDark, toggleDark } = useDark()

const hideSidebar = ref<boolean>(false)
const sideBarContentHover = ref<boolean>(false)
const sideBarContentRef = useDelayedHover({
  enterDelay: 100,
  leaveDelay: 600,
  enter: () => {
    sideBarContentHover.value = true
    toggleHideSidebar(false)
  },
  leave: () => {
    sideBarContentHover.value = false
    toggleHideSidebar(true)
  },
})

const hoveringDockItem = reactive<HoveringDockItem>({
  themeMode: false,
  settings: false,
})

watch(() => settings.value.autoHideSidebar, (newValue) => {
  if (newValue)
    hideSidebar.value = true
  else
    hideSidebar.value = false
}, {
  immediate: true,
})

function toggleHideSidebar(hide: boolean) {
  if (settings.value.autoHideSidebar)
    hideSidebar.value = hide
  else
    hideSidebar.value = false
}
</script>

<template>
  <div
    :class="{
      'left-side': settings.sidebarPosition === 'left',
      'right-side': settings.sidebarPosition === 'right',
      'hide': hideSidebar,
    }"
    pos="fixed top-0" h-full flex items-center px-6px
    z-10 pointer-events-none
  >
    <!-- Edge Div -->
    <div
      v-if="settings.autoHideSidebar && hideSidebar"
      class="sidebar-edge"
      :class="`sidebar-edge-${settings.sidebarPosition}`"
      pointer-events-auto
      @mouseenter="toggleHideSidebar(false)"
      @mouseleave="toggleHideSidebar(true)"
    />

    <div
      ref="sideBarContentRef"
      class="sidebar-content"
      :class="{
        hover: sideBarContentHover,
      }"
      flex="~ gap-2 col justify-center items-center"
      pointer-events-auto
      duration-300
    >
      <Tooltip :content="isDark ? $t('dock.dark_mode') : $t('dock.light_mode')" placement="left">
        <Button
          class="ctrl-btn"
          style="backdrop-filter: var(--bew-filter-glass-1);"
          center size="small" round
          @click="toggleDark"
          @mouseenter="hoveringDockItem.themeMode = true"
          @mouseleave="hoveringDockItem.themeMode = false"
        >
          <Transition name="fade">
            <div v-show="hoveringDockItem.themeMode" absolute flex>
              <Icon v-if="isDark" icon="line-md:sunny-outline-to-moon-loop-transition" />
              <Icon v-else icon="line-md:moon-alt-to-sunny-outline-loop-transition" />
            </div>
          </Transition>
          <Transition name="fade">
            <div v-show="!hoveringDockItem.themeMode" absolute flex>
              <Icon v-if="isDark" icon="line-md:sunny-outline-to-moon-transition" />
              <Icon v-else icon="line-md:moon-to-sunny-outline-transition" />
            </div>
          </Transition>
        </Button>
      </Tooltip>
      <Tooltip :content="$t('dock.settings')" placement="left">
        <Button
          class="ctrl-btn group"
          style="backdrop-filter: var(--bew-filter-glass-1);"
          center size="small" round
          @click="emit('settings-visibility-change')"
        >
          <div mt--2px>
            <i
              i-mingcute:settings-3-line w-20px h-20px group-hover:rotate-180
              transition="all 2000 ease-out"
            />
          </div>
        </Button>
      </Tooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ctrl-btn {
  --b-button-width: 40px;
  --b-button-height: 40px;
  --b-button-border-width: 1px;
  --b-button-color: var(--bew-elevated);
  --b-button-color-hover: var(--bew-elevated-hover);
  --b-button-shadow: var(--bew-shadow-1);
  --b-button-shadow-hover: var(--bew-shadow-2);
  --b-button-shadow-active: var(--bew-shadow-1);

  svg {
    --uno: "w-20px h-20px shrink-0";
  }

  &::after {
    // safety area
    --uno: "content-empty absolute w-[calc(100%+12px)] h-[calc(100%+12px)] left--6px right--6px z--1";
  }
}

.left-side {
  --uno: "left-0";
}

.right-side {
  --uno: "right-0";
}

.sidebar-edge {
  --uno: "absolute top-0 w-14px h-full hover:w-60px duration-300";

  &-left {
    --uno: "left-0";
  }

  &-right {
    --uno: "right-0";
  }
}

.left-side .sidebar-content {
  --uno: "translate-x-[calc(-50%-6px)] opacity-60";
}

.left-side .sidebar-content.hover {
  --uno: "translate-x-0 opacity-100";
}

.hide.left-side .sidebar-content {
  --uno: "translate-x--100% opacity-0 pointer-events-none";
}

.right-side .sidebar-content {
  --uno: "translate-x-[calc(50%+6px)] opacity-60";
}

.right-side .sidebar-content.hover {
  --uno: "translate-x-0 opacity-100";
}

.hide.right-side .sidebar-content {
  --uno: "translate-x-100% opacity-0 pointer-events-none";
}
</style>
