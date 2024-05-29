<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'

import Button from '~/components/Button.vue'
import Radio from '~/components/Radio.vue'
import Select from '~/components/Select.vue'
import { settings } from '~/logic'
import { useMainStore } from '~/stores/mainStore'

import SettingsItem from './SettingsItem.vue'
import SettingsItemGroup from './SettingsItemGroup.vue'

const mainStore = useMainStore()
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
const topBarIconBadgesOptions = computed(() => {
  return [
    {
      label: t('settings.topbar_icon_badges_opt.number'),
      value: 'number',
    },
    {
      label: t('settings.topbar_icon_badges_opt.dot'),
      value: 'dot',
    },
    {
      label: t('settings.topbar_icon_badges_opt.none'),
      value: 'none',
    },
  ]
})

const pageOptions = computed((): { label: string, icon: string, value: string }[] => {
  return mainStore.dockItems.map((e: any) => {
    return {
      label: t(e.i18nKey),
      icon: e.icon,
      value: e.page,
    }
  })
})

watch(() => settings.value.language, (newValue) => {
  locale.value = newValue
})

function resetDockContent() {
  settings.value.dockItemVisibilityList = mainStore.dockItems.map((e: any) => {
    return {
      page: e.page,
      visible: true,
    }
  })
}

function handleToggleDockItem(dockItem: any) {
  // Prevent disabling all dock items if there is only one
  if (settings.value.dockItemVisibilityList.filter(dockItem => dockItem.visible === true).length > 1)
    dockItem.visible = !dockItem.visible
  else
    dockItem.visible = true
}
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

      <SettingsItem :title="$t('settings.enable_grid_layout_switcher')">
        <Radio v-model="settings.enableGridLayoutSwitcher" />
      </SettingsItem>

      <SettingsItem :title="$t('settings.enable_horizontal_scrolling')" :desc="$t('settings.enable_horizontal_scrolling_desc')">
        <Radio v-model="settings.enableHorizontalScrolling" />
      </SettingsItem>

      <!-- <SettingsItem title="Open link in current tab">
        <Radio v-model="settings.openLinkInCurrentTab" />
      </SettingsItem> -->
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

    <SettingsItemGroup>
      <SettingsItem :title="$t('settings.block_ads')">
        <Radio v-model="settings.blockAds" />
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
    </SettingsItemGroup>

    <SettingsItemGroup :title="$t('settings.group_topbar')">
      <SettingsItem :title="$t('settings.auto_hide_topbar')">
        <Radio v-model="settings.autoHideTopBar" />
      </SettingsItem>
      <SettingsItem :title="$t('settings.topbar_icon_badges')">
        <Select v-model="settings.topBarIconBadges" :options="topBarIconBadgesOptions" w="full" />
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
      <SettingsItem next-line :desc="$t('settings.dock_content_adjustment_desc')">
        <template #title>
          <div flex="~ gap-4 items-center">
            {{ $t('settings.dock_content_adjustment') }}
            <Button size="small" type="secondary" @click="resetDockContent">
              <template #left>
                <div i-mingcute:back-line />
              </template>
              {{ $t('common.reset') }}
            </Button>
          </div>
        </template>
        <draggable
          v-model="settings.dockItemVisibilityList"
          item-key="page"
          :component-data="{ style: 'display: flex; gap: 0.5rem; flex-wrap: wrap;' }"
        >
          <template #item="{ element }">
            <div
              flex="~ gap-2 items-center" p="x-4 y-2" bg="$bew-fill-1" rounded="$bew-radius" cursor-all-scroll
              duration-300
              :style="{
                background: element.visible ? 'var(--bew-theme-color)' : 'var(--bew-fill-1)',
                color: element.visible ? 'white' : 'var(--bew-text-1)',
              }"
              @click="handleToggleDockItem(element)"
            >
              <div :class="pageOptions.find((page:any) => (page.value === element.page))?.icon as string" />
              {{ pageOptions.find(option => option.value === element.page)?.label }}
            </div>
          </template>
        </draggable>
      </SettingsItem>
      <SettingsItem :title="$t('settings.disable_light_dark_mode_switcher')">
        <Radio v-model="settings.disableLightDarkModeSwitcherOnDock" />
      </SettingsItem>
      <SettingsItem :title="$t('settings.move_back_to_top_and_refresh_to_dock')">
        <Radio v-model="settings.moveBackToTopOrRefreshButtonToDock" />
      </SettingsItem>
    </SettingsItemGroup>
  </div>
</template>

<style lang="scss" scoped>

</style>
