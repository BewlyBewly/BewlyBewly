<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { settings } from '~/logic'
import { AppPage } from '~/enums/appEnums'

const { t, locale } = useI18n()

const langOptions = computed(() => {
  return [
    {
      value: 'en',
      label: t('settings.select_language_opt.english'),
    },
    {
      value: 'cmn-CN',
      label: t('settings.select_language_opt.mandarin_cn'),
    },
    {
      value: 'cmn-TW',
      label: t('settings.select_language_opt.mandarin_tw'),
    },
    {
      value: 'jyut',
      label: t('settings.select_language_opt.jyut'),
    },
  ]
})
const dockPositions = computed(() => {
  return [
    {
      label: t('settings.dock_position_opt.left'),
      value: 'left',
    },
    {
      label: t('settings.dock_position_opt.right'),
      value: 'right',
    },
    {
      label: t('settings.dock_position_opt.bottom'),
      value: 'bottom',
    },
  ]
})

const pageOptions = computed((): { label: string; value: string }[] => {
  return [
    { label: t('dock.search'), value: AppPage.Search },
    { label: t('dock.home'), value: AppPage.Home },
    { label: t('dock.anime'), value: AppPage.Anime },
    { label: t('dock.history'), value: AppPage.History },
    { label: t('dock.favorites'), value: AppPage.Favorites },
    { label: t('dock.watch_later'), value: AppPage.WatchLater },
  ]
})

watch(() => settings.value.language, (newValue, oldValue) => {
  locale.value = newValue
})
</script>

<template>
  <div>
    <SettingsItemGroup :title="$t('settings.group_common')">
      <SettingsItem :title="$t('settings.select_language')">
        <Select
          v-model="settings.language"
          :options="langOptions"
          w="full"
        />
      </SettingsItem>

      <SettingsItem :title="$t('settings.startup_page')">
        <Select
          v-model="settings.startupPage"
          :options="pageOptions"
          w="full"
        />
      </SettingsItem>

      <SettingsItem :title="$t('settings.enable_horizontal_scrolling')" :desc="$t('settings.enable_horizontal_scrolling_desc')">
        <Radio v-model="settings.enableHorizontalScrolling" />
      </SettingsItem>

      <!-- <SettingsItem title="Open link in current tab">
        <Radio v-model="settings.openLinkInCurrentTab" />
      </SettingsItem> -->
      <SettingsItem title="Display the video control bar on the video card">
        <Radio v-model="settings.enableVideoCtrlBarOnVideoCard" />
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup :title="$t('settings.group_topbar')">
      <SettingsItem :title="$t('settings.topbar_visibility')" :desc="$t('settings.topbar_visibility_desc')">
        <Radio v-model="settings.isShowTopbar" :label="settings.isShowTopbar ? $t('settings.chk_box.show') : $t('settings.chk_box.hidden')" />
      </SettingsItem>
      <SettingsItem :title="$t('settings.auto_hide_topbar')">
        <Radio v-model="settings.autoHideTopbar" />
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup :title="$t('settings.group_dock')">
      <SettingsItem :title="$t('settings.dock_position')" :desc="$t('settings.dock_position_desc')">
        <Select
          v-model="settings.dockPosition"
          :options="dockPositions"
          w="full"
        />
      </SettingsItem>
      <SettingsItem :title="$t('settings.auto_hide_dock')">
        <Radio v-model="settings.autoHideDock" />
      </SettingsItem>
    </SettingsItemGroup>
  </div>
</template>

<style lang="scss" scoped>

</style>
