<script lang="ts" setup>
import { settings } from '~/logic'

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
      <SettingsItemGroup :title="$t('settings.group_color')">
        <SettingsItem :title="$t('settings.adapt_to_other_page_styles')" :desc="$t('settings.adapt_to_other_page_styles_desc')">
          <Radio v-model="settings.adaptToOtherPageStyles" />
        </SettingsItem>
      </SettingsItemGroup>
    </SettingsItemGroup>

    <SettingsItemGroup title="Bilibili Evolved">
      <SettingsItemGroup :title="$t('settings.group_color')">
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
      </SettingsItemGroup>

      <SettingsItemGroup :title="$t('settings.group_topbar')">
        <SettingsItem :title="$t('settings.topbar_visibility')" :desc="$t('settings.topbar_visibility_desc')">
          <Radio v-model="settings.isShowTopbar" :label="settings.isShowTopbar ? $t('settings.chk_box.show') : $t('settings.chk_box.hidden')" />
        </SettingsItem>
      </SettingsItemGroup>
    </SettingsItemGroup>
  </div>
</template>

<style lang="scss" scoped>

</style>
