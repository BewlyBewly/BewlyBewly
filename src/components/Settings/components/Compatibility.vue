<script lang="ts" setup>
import Radio from '~/components/Radio.vue'
import { settings } from '~/logic'
import { isHomePage } from '~/utils/main'

import SettingsItem from './SettingsItem.vue'
import SettingsItemGroup from './SettingsItemGroup.vue'

watch(() => settings.value.useOriginalBilibiliHomepage, () => {
  if (isHomePage())
    location.reload()
})

const bilibiliEvolvedThemeColor = computed(() => {
  return getComputedStyle(document.querySelector('html') as HTMLElement).getPropertyValue('--theme-color').trim() ?? '#00a1d6'
})

function changeThemeColor(color: string) {
  settings.value.themeColor = color
}
</script>

<template>
  <div>
    <SettingsItemGroup :title="$t('settings.group_common')">
      <SettingsItem :title="$t('settings.use_original_bilibili_homepage')">
        <template #desc>
          <span color="$bew-error-color" v-text="$t('settings.use_original_bilibili_homepage_desc')" />
        </template>
        <Radio v-model="settings.useOriginalBilibiliHomepage" />
      </SettingsItem>
      <SettingsItem :title="$t('settings.adapt_to_other_page_styles')" :desc="$t('settings.adapt_to_other_page_styles_desc')">
        <Radio v-model="settings.adaptToOtherPageStyles" />
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup title="Bilibili Evolved">
      <SettingsItem :title="$t('settings.follow_bilibili_evolved_color')" :desc="$t('settings.follow_bilibili_evolved_color_desc')">
        <div
          w-20px h-20px rounded-8 cursor-pointer transition
          duration-300 box-border
          :style="{
            background: bilibiliEvolvedThemeColor,
            transform: bilibiliEvolvedThemeColor === settings.themeColor ? 'scale(1.3)' : 'scale(1)',
            border: bilibiliEvolvedThemeColor === settings.themeColor ? '2px solid white' : '2px solid transparent',
            boxShadow: bilibiliEvolvedThemeColor === settings.themeColor ? '0 0 0 1px var(--bew-border-color), var(--bew-shadow-1)' : 'none',
          }"
          @click="changeThemeColor(bilibiliEvolvedThemeColor)"
        />
      </SettingsItem>

      <SettingsItem :title="$t('settings.topbar_visibility')" :desc="$t('settings.topbar_visibility_desc')">
        <Radio v-model="settings.showTopBar" :label="settings.showTopBar ? $t('settings.chk_box.show') : $t('settings.chk_box.hidden')" />
      </SettingsItem>
    </SettingsItemGroup>
  </div>
</template>

<style lang="scss" scoped>

</style>
