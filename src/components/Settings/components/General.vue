<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { settings } from '~/logic'

const { t, locale } = useI18n()

const langs = computed(() => {
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

watch(() => settings.value.language, (newValue, oldValue) => {
  locale.value = newValue
})
</script>

<template>
  <SettingItem :title="$t('settings.select_language')">
    <Select
      ref="langsSelect"
      v-model="settings.language"
      :options="langs"
      w="full"
    />
  </SettingItem>

  <SettingItem :title="$t('settings.topbar_visibility')" :desc="$t('settings.topbar_visibility_desc')">
    <Radio v-model:value="settings.isShowTopbar" :label="settings.isShowTopbar ? $t('settings.chk_box.show') : $t('settings.chk_box.hidden')" />
  </SettingItem>

  <SettingItem :title="$t('settings.dock_position')" :desc="$t('settings.dock_position_desc')">
    <Select
      v-model="settings.dockPosition"
      :options="dockPositions"
      w="full"
    />
  </SettingItem>

  <SettingItem :title="$t('settings.enable_horizontal_scrolling')" :desc="$t('settings.enable_horizontal_scrolling_desc')">
    <Radio v-model:value="settings.enableHorizontalScrolling" />
  </SettingItem>
</template>

<style lang="scss" scoped>

</style>
