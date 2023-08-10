<script lang="ts" setup>
import { settings } from '~/logic'

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
const bilibiliEvolvedThemeColor = computed(() => {
  return getComputedStyle(document.querySelector('html') as HTMLElement).getPropertyValue('--theme-color').trim() ?? '#00a1d6'
})
const wallpapers = computed<Array<{ name: string; url: string; thumbnail: string }>>(() => {
  return [
    {
      name: 'Unsplash Random Nature Image',
      url: 'https://source.unsplash.com/1920x1080/?nature',
      thumbnail: 'https://source.unsplash.com/1920x1080/?nature',
    },
    {
      name: 'BML2019 VR (pid: 74271400)',
      url: 'https://pic.imgdb.cn/item/638e1d63b1fccdcd36103811.jpg',
      thumbnail: 'https://pic.imgdb.cn/item/64ac5e341ddac507cc750ae8.jpg',
    },
    {
      name: '2020 拜年祭活动',
      url: 'https://pic.imgdb.cn/item/638e1d7ab1fccdcd36106346.jpg',
      thumbnail: 'https://pic.imgdb.cn/item/64ac5f251ddac507cc7658af.jpg',
    },
    {
      name: '2020 BDF',
      url: 'https://pic.imgdb.cn/item/63830f1816f2c2beb1868554.jpg',
      thumbnail: 'https://pic.imgdb.cn/item/64ac5fc01ddac507cc77224e.jpg',
    },
  ]
})

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
  <SettingItem :title="$t('settings.wallpaper_mode')" :desc="$t('settings.wallpaper_mode_desc')">
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
  </SettingItem>

  <SettingItem v-if="settings.wallpaperMode === 'buildIn'" :title="$t('settings.choose_ur_wallpaper')" next-line>
    <div grid="~ xl:cols-4 lg:cols-3 cols-2  gap-4">
      <picture
        aspect-video bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
        un-border="4 transparent" cursor-pointer
        grid place-items-center
        :class="{ 'selected-wallpaper': settings.wallpaper === '' }"
        @click="changeWallpaper('')"
      >
        <tabler:photo-off text="3xl $bew-text-3" />
      </picture>
      <Tooltip v-for="item in wallpapers" :key="item.url" placement="top" :content="item.name" aspect-video>
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
  </SettingItem>
  <SettingItem v-else :title="$t('settings.image_url')" next-line>
    <div flex items-center gap-4>
      <picture
        aspect-video bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
        un-border="4 transparent" cursor-pointer shrink-0
        w="xl:1/4 lg:1/3 md:1/2"
      >
        <img v-if="settings.wallpaper" :src="settings.wallpaper" alt="" w-full h-full object-cover onerror="this.style.display='none'; this.onerror=null;">
      </picture>
      <div>
        <Input v-model:value="settings.wallpaper" w-full />
        <p color="sm $bew-text-3" mt-2>
          {{ $t('settings.image_url_hint') }}
        </p>
      </div>
    </div>
  </SettingItem>

  <SettingItem :title="$t('settings.enable_wallpaper_masking')">
    <template #desc>
      <span color="$bew-warning-color">{{ $t('common.performance_impact_warn') }}</span>
    </template>

    <Radio v-model:value="settings.enableWallpaperMasking" />
  </SettingItem>
  <SettingItem v-if="settings.enableWallpaperMasking" :title="$t('settings.wallpaper_mask_opacity')">
    <Slider v-model:value="settings.wallpaperMaskOpacity" :label="`${settings.wallpaperMaskOpacity}%`" />
  </SettingItem>
  <SettingItem v-if="settings.enableWallpaperMasking" :title="$t('settings.wallpaper_blur_intensity')">
    <template #desc>
      <span color="$bew-warning-color">{{ $t('common.performance_impact_warn') }}</span>
    </template>
    <Slider v-model:value="settings.wallpaperBlurIntensity" :min="0" :max="60" :label="`${settings.wallpaperBlurIntensity}px`" />
  </SettingItem>
</template>

<style lang="scss" scoped>
.selected-wallpaper {
  --at-apply: border-$bew-theme-color-60
}
</style>
