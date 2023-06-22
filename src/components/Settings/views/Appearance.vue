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
  document.body.style.backgroundImage = `url(${url})`
  document.body.style.backgroundSize = 'cover'
  document.body.style.backgroundAttachment = 'fixed'
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
        ¬@click="changeThemeColor(color)"
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
  <SettingItem title="Choose your wallpaper" next-line>
    <div grid="~ xl:cols-4 lg:cols-3 md:cols-2 gap-4">
      <picture v-for="item in wallpapers" :key="item" aspect-video bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden @click="changeWallpaper(item)">
        <img :src="item" alt="" w-full h-full object-cover>
      </picture>
    </div>
  </SettingItem>
</template>

<style lang="scss" scoped>

</style>
