<script setup lang="ts">
import { Icon } from '@iconify/vue'

import Button from '~/components/Button.vue'
import { useDark } from '~/composables/useDark'

import Tooltip from '../Tooltip.vue'
import type { HoveringDockItem } from './types'

const emit = defineEmits(['settings-visibility-change'])
const { isDark, toggleDark } = useDark()

const hoveringDockItem = reactive<HoveringDockItem>({
  themeMode: false,
  settings: false,
})
</script>

<template>
  <div
    pos="fixed top-0 right-6px" h-full flex items-center z-10
    pointer-events-none
  >
    <div flex="~ gap-2 col" pointer-events-auto>
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
}
</style>
