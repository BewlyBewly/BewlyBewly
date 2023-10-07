<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { settings, pageDockItems } from '~/logic'
import {Icon} from '@iconify/vue'

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
  return pageDockItems.value
    .filter(e => e.visible)
    .map(e => {
      return {
        label: t(e.i18nkey),
        value: e.page
      }
    })
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

      <SettingsItem :title="$t('settings.topbar_visibility')" :desc="$t('settings.topbar_visibility_desc')">
        <Radio v-model="settings.isShowTopbar" :label="settings.isShowTopbar ? $t('settings.chk_box.show') : $t('settings.chk_box.hidden')" />
      </SettingsItem>

      <SettingsItem :title="$t('settings.dock_position')" :desc="$t('settings.dock_position_desc')">
        <Select
          v-model="settings.dockPosition"
          :options="dockPositions"
          w="full"
        />
      </SettingsItem>

      <SettingsItem :title="$t('settings.page_visibility')" :desc="$t('settings.page_visibility_desc')">
        <div flex="~ row gap-2 shrink-0" p-2 m-2>
          <Tooltip v-for="pageItem in pageDockItems" placement="top" :content="$t(pageItem.i18nkey)">
              <button
                class="page-item"
                :class="{ active: pageItem.visible }"
                @click="pageItem.visible = !pageItem.visible"
              >
                  <Icon :icon="pageItem.icon"></Icon>
              </button>
          </Tooltip>
        </div>
      </SettingsItem>

      <SettingsItem :title="$t('settings.enable_horizontal_scrolling')" :desc="$t('settings.enable_horizontal_scrolling_desc')">
        <Radio v-model="settings.enableHorizontalScrolling" />
      </SettingsItem>

      <!-- <SettingsItem title="Open link in current tab">
        <Radio v-model="settings.openLinkInCurrentTab" />
      </SettingsItem> -->
    </SettingsItemGroup>
  </div>
</template>

<style lang="scss" scoped>
.page-item {
  --shadow: 0 0 30px 4px var(--bew-theme-color-50);
  --shadow-dark: 0 0 30px 4px rgba(255, 255, 255, 0.6);
  --shadow-active: 0 0 20px var(--bew-theme-color-50);
  --shadow-dark-active: 0 0 20px rgba(255, 255, 255, 0.6);

  --at-apply: transform active:scale-90
    md:w-45px w-35px
    md:p-3 p-2
    md:text-2xl text-xl
    aspect-square relative
    text-$bew-text-1 leading-0 duration-300
    rounded-$bew-radius
    bg-$bew-fill-2 cursor-pointer
    hover:bg-$bew-theme-color hover:text-white hover:shadow-$shadow
    active:shadow-$shadow-active dark-active:shadow-$shadow-dark-active
    dark-hover:bg-white dark-hover:text-black dark-hover:shadow-$shadow-dark;

  &.active {
    --at-apply: bg-$bew-theme-color dark-bg-white
      text-white dark-text-black
      shadow-$shadow dark:shadow-$shadow-dark
      active:shadow-$shadow-active dark-active:shadow-$shadow-dark-active;
  }
}
</style>
