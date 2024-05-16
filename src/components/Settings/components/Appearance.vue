<script lang="ts" setup>
import { useThrottleFn } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import Input from '~/components/Input.vue'
import Radio from '~/components/Radio.vue'
import Select from '~/components/Select.vue'
import Slider from '~/components/Slider.vue'
import Tooltip from '~/components/Tooltip.vue'
import { WALLPAPERS } from '~/constants/imgs'
import { settings } from '~/logic'

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

    <SettingsItemGroup :title="$t('settings.group_wallpaper')">
      <SettingsItem :title="$t('settings.wallpaper_mode')" :desc="$t('settings.wallpaper_mode_desc')">
        <div w-full flex rounded="$bew-radius" bg="$bew-fill-1" p-1>
          <div
            flex-1 py-1 cursor-pointer text-center rounded="$bew-radius"
            :style="{
              background: settings.wallpaperMode === 'buildIn' ? 'var(--bew-theme-color)' : '',
              color: settings.wallpaperMode === 'buildIn' ? 'white' : '',
            }"
            @click="settings.wallpaperMode = 'buildIn'"
          >
            {{ $t('settings.wallpaper_mode_opt.build_in') }}
          </div>
          <div
            flex-1 py-1 cursor-pointer text-center rounded="$bew-radius"
            :style="{
              background: settings.wallpaperMode === 'byUrl' ? 'var(--bew-theme-color)' : '',
              color: settings.wallpaperMode === 'byUrl' ? 'white' : '',
            }"
            @click="settings.wallpaperMode = 'byUrl'"
          >
            {{ $t('settings.wallpaper_mode_opt.by_url') }}
          </div>
        </div>
      </SettingsItem>

      <SettingsItem v-if="settings.wallpaperMode === 'buildIn'" :title="$t('settings.choose_ur_wallpaper')" next-line>
        <div grid="~ xl:cols-5 lg:cols-4 cols-3 gap-4">
          <picture
            aspect-video bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
            un-border="4 transparent" cursor-pointer
            grid place-items-center
            :class="{ 'selected-wallpaper': settings.wallpaper === '' }"
            @click="changeWallpaper('')"
          >
            <div i-tabler:photo-off text="3xl $bew-text-3" />
          </picture>
          <Tooltip v-for="item in WALLPAPERS" :key="item.url" placement="top" :content="item.name" aspect-video>
            <picture
              aspect-video bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
              un-border="4 transparent" w-full
              :class="{ 'selected-wallpaper': settings.wallpaper === item.url }"
              @click="changeWallpaper(item.url)"
            >
              <img :src="item.thumbnail" alt="" w-full h-full object-cover>
            </picture>
          </Tooltip>
        </div>
      </SettingsItem>
      <SettingsItem v-else :title="$t('settings.image_url')" next-line>
        <div flex items-center gap-4>
          <picture
            aspect-video bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
            un-border="4 transparent" cursor-pointer shrink-0
            w="xl:1/5 lg:1/4 md:1/3"
          >
            <img
              v-if="settings.wallpaper" :src="settings.wallpaper" alt="" loading="lazy"
              w-full h-full object-cover
              onerror="this.style.display='none'; this.onerror=null;"
            >
          </picture>
          <div>
            <Input v-model="settings.wallpaper" w-full />
            <p color="sm $bew-text-3" mt-2>
              {{ $t('settings.image_url_hint') }}
            </p>
          </div>
        </div>
      </SettingsItem>

      <SettingsItem :title="$t('settings.enable_wallpaper_masking')">
        <template #desc>
          <span color="$bew-warning-color">{{ $t('common.performance_impact_warn') }}</span>
        </template>

        <Radio v-model="settings.enableWallpaperMasking" />
      </SettingsItem>
      <SettingsItem v-if="settings.enableWallpaperMasking" :title="$t('settings.wallpaper_mask_opacity')">
        <Slider v-model="settings.wallpaperMaskOpacity" :label="`${settings.wallpaperMaskOpacity}%`" />
      </SettingsItem>
      <SettingsItem v-if="settings.enableWallpaperMasking" :title="$t('settings.wallpaper_blur_intensity')">
        <template #desc>
          <span color="$bew-warning-color">{{ $t('common.performance_impact_warn') }}</span>
        </template>
        <Slider v-model="settings.wallpaperBlurIntensity" :min="0" :max="60" :label="`${settings.wallpaperBlurIntensity}px`" />
      </SettingsItem>
    </SettingsItemGroup>
  </div>
</template>

<style lang="scss" scoped>
.selected-wallpaper {
  --at-apply: border-$bew-theme-color-60
}
</style>
