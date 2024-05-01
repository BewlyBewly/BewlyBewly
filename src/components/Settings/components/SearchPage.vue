<script lang="ts" setup>
import { settings } from '~/logic'

const { searchBarCharacters, wallpapers, getBewlyImage } = useBewlyImage()

watch(() => settings.value.individuallySetSearchPageWallpaper, (newValue) => {
  if (newValue)
    document.documentElement.style.backgroundImage = `url(${getBewlyImage(settings.value.searchPageWallpaper)})`
  else
    document.documentElement.style.backgroundImage = `url(${getBewlyImage(settings.value.wallpaper)})`
})

function changeSearchBarFocusCharacter(url: string) {
  settings.value.searchPageSearchBarFocusCharacter = url
}

function changeWallpaper(url: string) {
  settings.value.searchPageWallpaper = url
}
</script>

<template>
  <div>
    <SettingsItemGroup :title="$t('settings.group_logo')">
      <SettingsItem :title="$t('settings.logo_color')">
        <div w-full flex rounded="$bew-radius" bg="$bew-fill-1" p-1>
          <div
            flex="1 ~" items-center justify-center py-1 cursor-pointer
            text-center rounded="$bew-radius"
            :style="{
              background: settings.searchPageLogoColor === 'themeColor' || !settings.searchPageLogoColor ? 'var(--bew-theme-color)' : '',
              color: settings.searchPageLogoColor === 'themeColor' || !settings.searchPageLogoColor ? 'white' : '',
            }"
            @click="settings.searchPageLogoColor = 'themeColor'"
          >
            {{ $t('settings.logo_color_opt.theme_color') }}
          </div>
          <div
            flex="1 ~" items-center justify-center py-1 cursor-pointer
            text-center rounded="$bew-radius"
            :style="{
              background: settings.searchPageLogoColor === 'white' ? 'var(--bew-theme-color)' : '',
              color: settings.searchPageLogoColor === 'white' ? 'white' : '',
            }"
            @click="settings.searchPageLogoColor = 'white'"
          >
            {{ $t('settings.logo_color_opt.white') }}
          </div>
        </div>
      </SettingsItem>

      <SettingsItem :title="$t('settings.enable_logo_glowing_effect')">
        <Radio v-model="settings.searchPageLogoGlow" />
      </SettingsItem>

      <SettingsItem :title="$t('settings.logo_visibility')">
        <Radio v-model="settings.searchPageShowLogo" />
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup :title="$t('settings.group_search_bar')">
      <SettingsItem :title="$t('settings.bg_darkens_when_the_search_bar_is_focused')">
        <Radio v-model="settings.searchPageDarkenOnSearchFocus" />
      </SettingsItem>

      <SettingsItem :title="$t('settings.bg_blurs_when_the_search_bar_is_focused')">
        <template #desc>
          <span color="$bew-warning-color">{{ $t('common.performance_impact_warn') }}</span>
        </template>

        <Radio v-model="settings.searchPageBlurredOnSearchFocus" />
      </SettingsItem>

      <SettingsItem :title="$t('settings.choose_search_bar_focused_character')" next-line>
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
          <Tooltip v-for="item in searchBarCharacters" :key="item.url" placement="top" :content="item.name" aspect-square>
            <picture
              aspect-square bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
              un-border="4 transparent" w-full
              :class="{ 'selected-wallpaper': settings.searchPageSearchBarFocusCharacter === item.url }"
              @click="changeSearchBarFocusCharacter(item.url)"
            >
              <img
                :src="getBewlyImage(item.url)" alt="" loading="lazy"
                w-full h-full object-contain
              >
            </picture>
          </Tooltip>
        </div>
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup :title="$t('settings.group_wallpaper')">
      <SettingsItem :title="$t('settings.individually_set_search_page_wallpaper')">
        <template #desc>
          <span color="$bew-warning-color">{{ $t('common.performance_impact_warn') }}</span>
        </template>

        <Radio v-model="settings.individuallySetSearchPageWallpaper" />
      </SettingsItem>
      <template v-if="settings.individuallySetSearchPageWallpaper">
        <SettingsItem :title="$t('settings.wallpaper_mode')" :desc="$t('settings.wallpaper_mode_desc')">
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
        </SettingsItem>

        <SettingsItem v-if="settings.searchPageWallpaperMode === 'buildIn'" :title="$t('settings.choose_ur_wallpaper')" next-line>
          <div grid="~ xl:cols-5 lg:cols-4 cols-3 gap-4">
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
                <img :src="getBewlyImage(item.thumbnail)" alt="" w-full h-full object-cover>
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
                v-if="settings.searchPageWallpaper" :src="getBewlyImage(settings.searchPageWallpaper)" alt="" w-full h-full
                object-cover onerror="this.style.display='none'; this.onerror=null;"
              >
            </picture>
            <div>
              <Input v-model="settings.searchPageWallpaper" w-full />
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

          <Radio v-model="settings.searchPageEnableWallpaperMasking" />
        </SettingsItem>
        <SettingsItem v-if="settings.searchPageEnableWallpaperMasking" :title="$t('settings.wallpaper_mask_opacity')">
          <Slider v-model="settings.searchPageWallpaperMaskOpacity" :label="`${settings.searchPageWallpaperMaskOpacity ?? 0}%`" />
        </SettingsItem>
        <SettingsItem v-if="settings.searchPageEnableWallpaperMasking" :title="$t('settings.wallpaper_blur_intensity')">
          <template #desc>
            <span color="$bew-warning-color">{{ $t('common.performance_impact_warn') }}</span>
          </template>
          <Slider v-model="settings.searchPageWallpaperBlurIntensity" :min="0" :max="60" :label="`${settings.searchPageWallpaperBlurIntensity ?? 0}px`" />
        </SettingsItem>
      </template>
    </SettingsItemGroup>
  </div>
</template>

<style scoped lang="scss">
.selected-wallpaper {
  --at-apply: border-$bew-theme-color-60
}
</style>
