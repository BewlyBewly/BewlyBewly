<script setup lang="ts">
import { settings } from '~/logic'

const emit = defineEmits(['settings-visibility-change'])

const currentAppColorScheme = computed((): 'dark' | 'light' => {
  if (settings.value.theme !== 'auto')
    return settings.value.theme
  else
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
})

function toggleDark() {
  if (currentAppColorScheme.value === 'light')
    settings.value.theme = 'dark'
  else
    settings.value.theme = 'light'
}
</script>

<template>
  <div pos="fixed top-0 right-6px" h-full flex items-center z-1 pointer-events-none>
    <div flex="~ gap-2 col" pointer-events-auto>
      <Tooltip :content="currentAppColorScheme === 'dark' ? $t('dock.dark_mode') : $t('dock.light_mode')" placement="left">
        <Button class="ctrl-btn" center size="small" round backdrop-glass @click="toggleDark()">
          <line-md:sunny-outline-to-moon-transition v-if="currentAppColorScheme === 'dark'" text-xl shrink-0 lh-0 />
          <line-md:moon-to-sunny-outline-transition v-else text-xl shrink-0 lh-0 />
        </Button>
      </Tooltip>
      <Tooltip :content="$t('dock.settings')" placement="left">
        <Button class="ctrl-btn" center size="small" round backdrop-glass @click="emit('settings-visibility-change')">
          <mingcute:settings-3-line text-xl shrink-0 lh-0 />
        </Button>
      </Tooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ctrl-btn {
  --b-button-width: 45px;
  --b-button-height: 45px;
  --b-button-border-width: 1px;
  --b-button-color: var(--bew-elevated-1);
  --b-button-color-hover: var(--bew-elevated-1-hover);
  --b-button-shadow: var(--bew-shadow-1);
  --b-button-shadow-hover: var(--bew-shadow-2);
  --b-button-shadow-active: var(--bew-shadow-1);
}
</style>
