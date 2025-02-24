<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

import { settings } from '~/logic'

import SettingsItem from '../components/SettingsItem.vue'
import SettingsItemGroup from '../components/SettingsItemGroup.vue'

const { t, locale } = useI18n()

const langOptions = computed(() => {
  return [
    {
      label: t('settings.select_language_opt.english'),
      value: 'en',
    },
    {
      label: t('settings.select_language_opt.mandarin_cn'),
      value: 'cmn-CN',
    },
    {
      label: t('settings.select_language_opt.mandarin_tw'),
      value: 'cmn-TW',
    },
    {
      label: t('settings.select_language_opt.jyut'),
      value: 'jyut',
    },
  ]
})

const openModeOptions = computed(() => {
  return [
    {
      label: t('settings.link_opening_behavior_opt.current_tab'),
      value: 'currentTab',
    },
    {
      label: t('settings.link_opening_behavior_opt.current_tab_if_not_homepage'),
      value: 'currentTabIfNotHomepage',
    },
    {
      label: t('settings.link_opening_behavior_opt.new_tab'),
      value: 'newTab',
    },
  ]
})

const videoCardOpenModeOptions = computed(() => {
  return [
    {
      label: t('settings.link_opening_behavior_opt.current_tab'),
      value: 'currentTab',
    },
    {
      label: t('settings.link_opening_behavior_opt.drawer'),
      value: 'drawer',
    },
    {
      label: t('settings.link_opening_behavior_opt.new_tab'),
      value: 'newTab',
    },
  ]
})

const fontPreferenceOptions = computed(() => {
  return [
    {
      label: t('settings.customize_font_opt.default'),
      value: 'default',
    },
    {
      label: t('settings.customize_font_opt.recommend'),
      value: 'recommend',
    },
    {
      label: t('settings.customize_font_opt.custom'),
      value: 'custom',
    },
  ]
})

watch(() => settings.value.language, (newValue) => {
  locale.value = newValue
})
</script>

<template>
  <div>
    <SettingsItemGroup :title="$t('settings.group_common')">
      <SettingsItem :title="$t('settings.touch_screen_optimization')" :desc="$t('settings.touch_screen_optimization_desc')">
        <Radio v-model="settings.touchScreenOptimization" />
      </SettingsItem>

      <SettingsItem :title="$t('settings.enable_grid_layout_switcher')">
        <Radio v-model="settings.enableGridLayoutSwitcher" />
      </SettingsItem>

      <SettingsItem :title="$t('settings.enable_horizontal_scrolling')" :desc="$t('settings.enable_horizontal_scrolling_desc')">
        <Radio v-model="settings.enableHorizontalScrolling" />
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup :title="$t('settings.group_languages_and_fonts')">
      <SettingsItem :title="$t('settings.select_language')">
        <Select
          v-model="settings.language"
          :options="langOptions"
          w="full"
        />
      </SettingsItem>
      <SettingsItem :title="$t('settings.customize_font')">
        <Select
          v-model="settings.customizeFont"
          :options="fontPreferenceOptions"
          w="full"
        />
        <template v-if="settings.customizeFont === 'custom'" #bottom>
          <Input v-model="settings.fontFamily" @keydown.stop.passive="() => {}" />
          <div text="sm $bew-text-2" mt-1 v-html="t('settings.customize_font_desc')" />
        </template>
      </SettingsItem>
      <SettingsItem :title="$t('settings.remove_the_indent_from_chinese_punctuation')" :desc="$t('settings.remove_the_indent_from_chinese_punctuation_desc')">
        <Radio v-model="settings.removeTheIndentFromChinesePunctuation" />
      </SettingsItem>
      <SettingsItem :title="$t('settings.override_danmaku_font')" :desc="$t('settings.override_danmaku_font_desc')">
        <Radio v-model="settings.overrideDanmakuFont" />
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup :title="$t('settings.group_performance')">
      <SettingsItem :title="$t('settings.disable_frosted_glass')">
        <Radio v-model="settings.disableFrostedGlass" />
      </SettingsItem>
      <SettingsItem
        v-if="!settings.disableFrostedGlass"
        :title="$t('settings.reduce_frosted_glass_blur')"
      >
        <Radio v-model="settings.reduceFrostedGlassBlur" />
      </SettingsItem>
      <SettingsItem :title="$t('settings.disable_shadow')">
        <Radio v-model="settings.disableShadow" />
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup :title="$t('settings.group_link_opening_behavior')">
      <SettingsItem :title="$t('settings.top_bar_link_opening_behavior')">
        <Select v-model="settings.topBarLinkOpenMode" :options="openModeOptions" w="full" />
      </SettingsItem>
      <SettingsItem :title="$t('settings.video_card_link_opening_behavior')">
        <Select
          v-model="settings.videoCardLinkOpenMode"
          :options="videoCardOpenModeOptions"
          w="full"
        />
      </SettingsItem>
      <SettingsItem :title="$t('settings.search_bar_link_opening_behavior')">
        <Select
          v-model="settings.searchBarLinkOpenMode"
          :options="openModeOptions"
          w="full"
        />
      </SettingsItem>
      <SettingsItem>
        <template #title>
          <div v-html="$t('settings.close_drawer_without_pressing_esc_again')" />
        </template>
        <Radio v-model="settings.closeDrawerWithoutPressingEscAgain" />
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup>
      <SettingsItem :title="$t('settings.block_ads')">
        <Radio v-model="settings.blockAds" />
      </SettingsItem>
      <SettingsItem :title="$t('settings.block_top_search_page_ads')" :desc="$t('settings.block_top_search_page_ads_desc')">
        <Radio v-model="settings.blockTopSearchPageAds" />
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup :title="$t('settings.group_video_card')">
      <SettingsItem :title="$t('settings.enable_video_preview')">
        <Radio v-model="settings.enableVideoPreview" />
      </SettingsItem>
      <template v-if="settings.enableVideoPreview">
        <SettingsItem :title="$t('settings.enable_video_ctrl_bar_on_video_card')">
          <Radio v-model="settings.enableVideoCtrlBarOnVideoCard" />
        </SettingsItem>
        <SettingsItem :title="$t('settings.hover_video_card_delayed')">
          <Radio v-model="settings.hoverVideoCardDelayed" />
        </SettingsItem>
      </template>
    </SettingsItemGroup>
  </div>
</template>

<style lang="scss" scoped>
</style>
