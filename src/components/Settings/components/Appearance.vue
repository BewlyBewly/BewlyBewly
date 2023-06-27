<script lang="ts" setup>
import { settings } from '~/logic'

const themeColorOptions = reactive<Array<string>>([
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
])
const bilibiliEvolvedThemeColor = computed(() => {
  return getComputedStyle(document.querySelector('html') as HTMLElement).getPropertyValue('--theme-color').trim() ?? '#00a1d6'
})
const wallpapers = reactive<Array<string>>([
  'https://source.unsplash.com/1920x1080/?nature',
  'https://pic.imgdb.cn/item/638e1d63b1fccdcd36103811.jpg',
  'https://pic.imgdb.cn/item/638e1d7ab1fccdcd36106346.jpg',
  'https://pic.imgdb.cn/item/63830f1816f2c2beb1868554.jpg',
])

function changeThemeColor(color: string) {
  settings.value.themeColor = color
}

function changeWallpaper(url: string) {
  settings.value.wallpaper = url
}
</script>

<template>
  <SettingItem :title="$t('settings.theme_color')">
    <div flex="~ gap-2 wrap">
      <div
        v-for="color in themeColorOptions" :key="color"
        w-20px h-20px rounded-8 cursor-pointer transition duration-300
        :style="{
          background: color,
          transform: color === settings.themeColor ? 'scale(1.2)' : 'scale(1)',
          border: color === settings.themeColor ? '2px solid var(--bew-text-1)' : 'none',
        }"
        @click="changeThemeColor(color)"
      />
    </div>
  </SettingItem>
  <SettingItem :title="$t('settings.follow_bilibili_evolved_color')" :desc="$t('settings.follow_bilibili_evolved_color_desc')">
    <div
      w-20px h-20px rounded-8 cursor-pointer
      :style="{
        background: bilibiliEvolvedThemeColor,
        transform: bilibiliEvolvedThemeColor === settings.themeColor ? 'scale(1.2)' : 'scale(1)',
        border: bilibiliEvolvedThemeColor === settings.themeColor ? '2px solid var(--bew-text-1)' : 'none',
      }"
      @click="changeThemeColor(bilibiliEvolvedThemeColor)"
    />
  </SettingItem>
  <SettingItem title="Wallpaper mode" desc="By URL: Choose an image from the Internet and use its URL to set it as the background.">
    <div flex rounded="$bew-radius" bg="$bew-fill-1" p-1>
      <div
        flex-1 py-1 cursor-pointer text-center rounded="$bew-radius"
        :style="{
          background: settings.wallpaperMode === 'buildIn' ? 'var(--bew-theme-color)' : '',
          color: settings.wallpaperMode === 'buildIn' ? 'white' : '',
        }"
        @click="settings.wallpaperMode = 'buildIn'"
      >
        Build-in
      </div>
      <div
        flex-1 py-1 cursor-pointer text-center rounded="$bew-radius"
        :style="{
          background: settings.wallpaperMode === 'byUrl' ? 'var(--bew-theme-color)' : '',
          color: settings.wallpaperMode === 'byUrl' ? 'white' : '',
        }"
        @click="settings.wallpaperMode = 'byUrl'"
      >
        By URL
      </div>
    </div>
  </SettingItem>

  <SettingItem v-if="settings.wallpaperMode === 'buildIn'" title="Choose your wallpaper" next-line>
    <div grid="~ xl:cols-4 lg:cols-3 md:cols-2 gap-4">
      <picture
        aspect-video bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
        un-border="4 transparent" pointer-cursor
        grid place-items-center
        :class="{ 'selected-wallpaper': settings.wallpaper === '' }"
        @click="changeWallpaper('')"
      >
        <tabler:photo-off text="3xl $bew-text-3" />
      </picture>
      <picture
        v-for="item in wallpapers" :key="item" aspect-video bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
        un-border="4 transparent"
        :class="{ 'selected-wallpaper': settings.wallpaper === item }"
        @click="changeWallpaper(item)"
      >
        <img :src="item" alt="" w-full h-full object-cover>
      </picture>
    </div>
  </SettingItem>
  <SettingItem v-else title="Image URL" next-line>
    <div flex items-center gap-4>
      <picture
        aspect-video bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
        un-border="4 transparent" pointer-cursor
        w="xl:1/4 lg:1/3 md:1/2"
      >
        <img :src="settings.wallpaper" alt="" w-full h-full object-cover>
        <!-- <tabler:photo-off text="3xl $bew-text-3" /> -->
      </picture>
      <input v-model="settings.wallpaper" type="text" flex-1>
    </div>
  </SettingItem>

  <SettingItem title="Enable wallpaper masking">
    <label for="enableWallpaperMasking" class="chk-btn" cursor="pointer" pointer="auto">
      <template v-if="settings.enableWallpaperMasking">{{ $t('settings.chk_box.show') }}</template>
      <template v-else>{{ $t('settings.chk_box.hidden') }}</template>
      <input id="enableWallpaperMasking" v-model="settings.enableWallpaperMasking" type="checkbox">
    </label>
  </SettingItem>
  <SettingItem v-if="settings.enableWallpaperMasking" title="Wallpaper mask opacity">
    <input
      v-model="settings.wallpaperMaskOpacity"
      type="range" min="0" max="100"
      step="1"
    >
    {{ settings.wallpaperMaskOpacity }}
  </SettingItem>
  <SettingItem v-if="settings.enableWallpaperMasking" title="Blur intensity">
    <input
      v-model="settings.wallpaperBlurIntensity"
      type="range" min="0" max="60"
      step="1"
    >
    {{ settings.wallpaperBlurIntensity }}
  </SettingItem>
</template>

<style lang="scss" scoped>
.selected-wallpaper {
  --at-apply: border-$bew-theme-color-60
}
</style>
