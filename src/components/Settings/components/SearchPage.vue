<script lang="ts" setup>
import Radio from '~/components/Radio.vue'
import Tooltip from '~/components/Tooltip.vue'
import { SEARCH_BAR_CHARACTERS } from '~/constants/imgs'
import { settings } from '~/logic'

import ChangeWallpaper from './ChangeWallpaper.vue'
import SettingsItem from './SettingsItem.vue'
import SettingsItemGroup from './SettingsItemGroup.vue'

watch(() => settings.value.individuallySetSearchPageWallpaper, (newValue) => {
  if (newValue)
    document.documentElement.style.backgroundImage = `url(${settings.value.searchPageWallpaper})`
  else
    document.documentElement.style.backgroundImage = `url(${settings.value.wallpaper})`
})

function changeSearchBarFocusCharacter(url: string) {
  settings.value.searchPageSearchBarFocusCharacter = url
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
            <div i-tabler:photo-off text="3xl $bew-text-3" />
          </picture>
          <Tooltip v-for="item in SEARCH_BAR_CHARACTERS" :key="item.url" placement="top" :content="item.name" aspect-square>
            <picture
              aspect-square bg="$bew-fill-1" rounded="$bew-radius" overflow-hidden
              un-border="4 transparent" w-full
              :class="{ 'selected-wallpaper': settings.searchPageSearchBarFocusCharacter === item.url }"
              @click="changeSearchBarFocusCharacter(item.url)"
            >
              <img
                :src="item.url" alt="" loading="lazy"
                w-full h-full object-contain
              >
            </picture>
          </Tooltip>
        </div>
      </SettingsItem>
    </SettingsItemGroup>

    <ChangeWallpaper type="searchPage" />
  </div>
</template>

<style scoped lang="scss">
.selected-wallpaper {
  --uno: "border-$bew-theme-color-60";
}
</style>
