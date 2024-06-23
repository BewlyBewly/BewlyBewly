<script lang="ts" setup>
import { useThrottleFn } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import Select from '~/components/Select.vue'
import { settings } from '~/logic'

import ChangeWallpaper from './ChangeWallpaper.vue'
import SettingsItem from './SettingsItem.vue'
import SettingsItemGroup from './SettingsItemGroup.vue'

const { t } = useI18n()

const themeColorOptions = computed<Array<string>>(() => {
  return [
    '#22c55e',
    '#34d399',
    '#14b8a6',
    '#06b6d4',
    '#00a1d6',
    '#60a5fa',
    '#3b82f6',
    '#6366f1',
    '#818cf8',
    '#a78bfa',
    '#f46d43',
    '#fb923c',
    '#f59e0b',
    '#eab308',
    '#f43f5e',
    '#fb7299',
    '#fda4af',
  ]
})
const isCustomColor = computed<boolean>(() => {
  return !themeColorOptions.value.includes(settings.value.themeColor)
})
const themeOptions = computed<Array<{ value: string, label: string }>>(() => {
  return [
    {
      label: t('settings.theme_opt.light'),
      value: 'light',
    },
    {
      label: t('settings.theme_opt.dark'),
      value: 'dark',
    },
    {
      label: t('settings.theme_opt.auto'),
      value: 'auto',
    },
  ]
})

watch(() => settings.value.wallpaper, (newValue) => {
  changeWallpaper(newValue)
})

function changeThemeColor(color: string) {
  settings.value.themeColor = color
}
const changeThemeColorThrottle = useThrottleFn((color: string) => changeThemeColor(color), 100)

function changeWallpaper(url: string) {
  // If you had already set the wallpaper, it enables the wallpaper masking to prevent text hard to see
  if (url)
    settings.value.enableWallpaperMasking = true
  else
    settings.value.enableWallpaperMasking = false

  settings.value.wallpaper = url
}
</script>

<template>
  <div>
    <SettingsItemGroup :title="$t('settings.group_color')">
      <SettingsItem :title="$t('settings.theme')">
        <Select v-model="settings.theme" w-full :options="themeOptions" />
      </SettingsItem>
      <SettingsItem :title="$t('settings.theme_color')">
        <div flex="~ gap-2 wrap" justify-end>
          <div
            v-for="color in themeColorOptions" :key="color"
            w-20px h-20px rounded-8 cursor-pointer transition
            duration-300 box-border
            :style="{
              background: color,
              transform: color === settings.themeColor ? 'scale(1.3)' : 'scale(1)',
              border: color === settings.themeColor ? '2px solid white' : '2px solid transparent',
              boxShadow: color === settings.themeColor ? '0 0 0 1px var(--bew-border-color), var(--bew-shadow-1)' : 'none',
            }"
            @click="changeThemeColor(color)"
          />
          <div
            w-20px h-20px rounded-8 overflow-hidden
            cursor-pointer transition duration-300
            flex="~ items-center justify-center"
            :style="{
              transform: isCustomColor ? 'scale(1.3)' : 'scale(1)',
              border: isCustomColor ? '2px solid white' : `2px solid ${settings.themeColor}`,
              boxShadow: isCustomColor ? '0 0 0 1px var(--bew-border-color), var(--bew-shadow-1)' : 'none',
            }"
          >
            <div
              i-mingcute:color-picker-line pos="absolute" text-white w-12px h-12px
              pointer-events-none
            />
            <input
              :value="settings.themeColor"
              type="color"
              w-30px h-30px p-0 m-0 block
              shrink-0 rounded-8 border-none cursor-pointer
              @input="(e) => changeThemeColorThrottle((e.target as HTMLInputElement)?.value)"
            >
          </div>
        </div>
      </SettingsItem>
    </SettingsItemGroup>

    <ChangeWallpaper type="global" />
  </div>
</template>

<style lang="scss" scoped>
</style>
