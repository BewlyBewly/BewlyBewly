<script lang="ts" setup>
import { settings } from '~/logic'

const searchBarFocusCharacters = computed<{ name: string; url: string }[]>(() => {
  return [
    { name: '22 娘', url: 'https://pic.imgdb.cn/item/64d4f8891ddac507cc772ce5.png' },
    { name: '33 娘', url: 'https://cdn.jsdelivr.net/gh/hakadao/bilibili-simple-home@master/img/searchBar_33_2.png' },
    { name: '22 娘', url: 'https://pic.imgdb.cn/item/64d4fb391ddac507cc7ec5ae.png' },
    { name: '33 娘', url: 'https://pic.imgdb.cn/item/64d4fd251ddac507cc8458fa.png' },
  ]
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

watch(() => settings.value.individuallySetSearchPageWallpaper, (newValue) => {
  if (newValue)
    document.documentElement.style.backgroundImage = `url(${settings.value.searchPageWallpaper})`
  else
    document.documentElement.style.backgroundImage = `url(${settings.value.wallpaper})`
})

function changeSearchBarFocusCharacter(url: string) {
  settings.value.searchPageSearchBarFocusCharacter = url
}

function changeWallpaper(url: string) {
  settings.value.searchPageWallpaper = url
}
</script>

<template>
  <SettingItem :title="$t('settings.logo_color')">
    <div w-full flex rounded="$bew-radius" bg="$bew-fill-1" p-1>
      <div
        flex="1 ~" items-center justify-center py-1 cursor-pointer text-center rounded="$bew-radius"
        :style="{
          background: settings.searchPageLogoColor === 'themeColor' || !settings.searchPageLogoColor ? 'var(--bew-theme-color)' : '',
          color: settings.searchPageLogoColor === 'themeColor' || !settings.searchPageLogoColor ? 'white' : '',
        }"
        @click="settings.searchPageLogoColor = 'themeColor'"
      >
        {{ $t('settings.logo_color_opt.theme_color') }}
      </div>
      <div
        flex="1 ~" items-center justify-center py-1 cursor-pointer text-center rounded="$bew-radius"
        :style="{
          background: settings.searchPageLogoColor === 'white' ? 'var(--bew-theme-color)' : '',
          color: settings.searchPageLogoColor === 'white' ? 'white' : '',
        }"
        @click="settings.searchPageLogoColor = 'white'"
      >
        {{ $t('settings.logo_color_opt.white') }}
      </div>
    </div>
  </SettingItem>

  <SettingItem title="Enable glowing effect for the logo">
    <Radio v-model:value="settings.searchPageLogoGlow" />
  </SettingItem>

  <SettingItem :title="$t('settings.logo_visibility')">
    <Radio v-model:value="settings.searchPageShowLogo" />
  </SettingItem>

  <SettingItem :title="$t('settings.bg_darkens_when_the_search_bar_is_focused')">
    <Radio v-model:value="settings.searchPageDarkenOnSearchFocus" />
  </SettingItem>

  <SettingItem title="Choose the character displayed when the search bar is focused" next-line>
    <div grid="~ xl:cols-8 lg:cols-6 cols-5 gap-4">
      <picture
        aspect-square bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
        un-border="4 transparent" cursor-pointer
        grid place-items-center
        :class="{ 'selected-wallpaper': settings.searchPageSearchBarFocusCharacter === '' }"
        @click="changeSearchBarFocusCharacter('')"
      >
        <tabler:photo-off text="3xl $bew-text-3" />
      </picture>
      <Tooltip v-for="item in searchBarFocusCharacters" :key="item.url" placement="top" :content="item.name" aspect-square>
        <picture
          aspect-square bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
          un-border="4 transparent" w-full
          :class="{ 'selected-wallpaper': settings.searchPageSearchBarFocusCharacter === item.url }"
          @click="changeSearchBarFocusCharacter(item.url)"
        >
          <img :src="item.url" alt="" w-full h-full object-contain>
        </picture>
      </Tooltip>
    </div>
    <!-- <div flex items-center gap-4>
      <div>
        <picture
          aspect-square bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
          un-border="4 transparent" cursor-pointer shrink-0
          w="xl:1/8 lg:1/6 md:1/5" p--4
        >
          <img
            v-if="settings.searchPageSearchBarFocusCharacter" :src="settings.searchPageSearchBarFocusCharacter" alt="" w-full h-full object-contain
            onerror="this.style.display='none'; this.onerror=null;"
          >
        </picture>
      </div>
      <div>
        <Input v-model:value="settings.searchPageSearchBarFocusCharacter" w-full />
        <p color="sm $bew-text-3" mt-2>
          {{ $t('settings.image_url_hint') }}
        </p>
      </div>
    </div> -->
  </SettingItem>

  <SettingItem :title="$t('settings.individually_set_search_page_wallpaper')">
    <template #desc>
      <span color="$bew-warning-color">{{ $t('common.performance_impact_warn') }}</span>
    </template>

    <Radio v-model:value="settings.individuallySetSearchPageWallpaper" />
  </SettingItem>
  <template v-if="settings.individuallySetSearchPageWallpaper">
    <SettingItem :title="$t('settings.wallpaper_mode')" :desc="$t('settings.wallpaper_mode_desc')">
      <div w-full flex rounded="$bew-radius" bg="$bew-fill-1" p-1>
        <div
          flex-1 py-1 cursor-pointer text-center rounded="$bew-radius"
          :style="{
            background: settings.searchPageWallpaperMode === 'buildIn' ? 'var(--bew-theme-color)' : '',
            color: settings.searchPageWallpaperMode === 'buildIn' ? 'white' : '',
          }"
          @click="settings.searchPageWallpaperMode = 'buildIn'"
        >
          {{ $t('settings.wallpaper_mode_opt.build_in') }}
        </div>
        <div
          flex-1 py-1 cursor-pointer text-center rounded="$bew-radius"
          :style="{
            background: settings.searchPageWallpaperMode === 'byUrl' ? 'var(--bew-theme-color)' : '',
            color: settings.searchPageWallpaperMode === 'byUrl' ? 'white' : '',
          }"
          @click="settings.searchPageWallpaperMode = 'byUrl'"
        >
          {{ $t('settings.wallpaper_mode_opt.by_url') }}
        </div>
      </div>
    </SettingItem>

    <SettingItem v-if="settings.searchPageWallpaperMode === 'buildIn'" :title="$t('settings.choose_ur_wallpaper')" next-line>
      <div grid="~ xl:cols-4 lg:cols-3 cols-2  gap-4">
        <picture
          aspect-video bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
          un-border="4 transparent" cursor-pointer
          grid place-items-center
          :class="{ 'selected-wallpaper': settings.searchPageWallpaper === '' }"
          @click="changeWallpaper('')"
        >
          <tabler:photo-off text="3xl $bew-text-3" />
        </picture>
        <Tooltip v-for="item in wallpapers" :key="item.url" placement="top" :content="item.name" aspect-video>
          <picture
            aspect-video bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
            un-border="4 transparent" w-full
            :class="{ 'selected-wallpaper': settings.searchPageWallpaper === item.url }"
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
          <img v-if="settings.searchPageWallpaper" :src="settings.searchPageWallpaper" alt="" w-full h-full object-cover onerror="this.style.display='none'; this.onerror=null;">
        </picture>
        <div>
          <Input v-model:value="settings.searchPageWallpaper" w-full />
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

      <Radio v-model:value="settings.searchPageEnableWallpaperMasking" />
    </SettingItem>
    <SettingItem v-if="settings.searchPageEnableWallpaperMasking" :title="$t('settings.wallpaper_mask_opacity')">
      <Slider v-model:value="settings.searchPageWallpaperMaskOpacity" :label="`${settings.searchPageWallpaperMaskOpacity ?? 0}%`" />
    </SettingItem>
    <SettingItem v-if="settings.searchPageEnableWallpaperMasking" :title="$t('settings.wallpaper_blur_intensity')">
      <template #desc>
        <span color="$bew-warning-color">{{ $t('common.performance_impact_warn') }}</span>
      </template>
      <Slider v-model:value="settings.searchPageWallpaperBlurIntensity" :min="0" :max="60" :label="`${settings.searchPageWallpaperBlurIntensity ?? 0}px`" />
    </SettingItem>
  </template>
</template>

<style scoped lang="scss">
.selected-wallpaper {
  --at-apply: border-$bew-theme-color-60
}
</style>
