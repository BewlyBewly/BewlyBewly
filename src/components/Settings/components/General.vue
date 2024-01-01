<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import { Icon } from '@iconify/vue'
import { settings } from '~/logic'
import { useMainStore } from '~/stores/mainStore'

const mainStore = useMainStore() as any
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

const pageOptions = computed((): { label: string;icon: string; value: string }[] => {
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

      <SettingsItem :title="$t('settings.enable_horizontal_scrolling')" :desc="$t('settings.enable_horizontal_scrolling_desc')">
        <Radio v-model="settings.enableHorizontalScrolling" />
      </SettingsItem>

      <!-- <SettingsItem title="Open link in current tab">
        <Radio v-model="settings.openLinkInCurrentTab" />
      </SettingsItem> -->
      <SettingsItem :title="$t('settings.enable_video_ctrl_bar_on_video_card')">
        <Radio v-model="settings.enableVideoCtrlBarOnVideoCard" />
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup :title="$t('settings.group_topbar')">
      <!-- <SettingsItem :title="$t('settings.topbar_visibility')" :desc="$t('settings.topbar_visibility_desc')">
        <Radio v-model="settings.showTopBar" :label="settings.showTopBar ? $t('settings.chk_box.show') : $t('settings.chk_box.hidden')" />
      </SettingsItem> -->
      <SettingsItem :title="$t('settings.auto_hide_topbar')">
        <Radio v-model="settings.autoHideTopBar" />
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
                <mingcute:back-line />
              </template>
              {{ $t('common.reset') }}
            </Button>
          </div>
        </template>
        <draggable
          v-model="settings.dockItemVisibilityList"
          item-key="page"
          :component-data="{ style: 'display: flex; gap: 0.5rem;' }"
        >
          <template #item="{ element }">
            <div
              flex="~ gap-2 items-center" p="x-4 y-2" bg="$bew-fill-1" rounded="$bew-radius" cursor-all-scroll
              duration-300
              :style="{
                background: element.visible ? 'var(--bew-theme-color)' : 'var(--bew-fill-1)',
                color: element.visible ? 'white' : 'var(--bew-text-1)',
              }"
              @click="element.visible = !element.visible"
            >
              <Icon :icon="pageOptions.find((page:any) => (page.value === element.page))?.icon as string" />
              {{ pageOptions.find(option => option.value === element.page)?.label }}
            </div>
          </template>
        </draggable>
      </SettingsItem>
    </SettingsItemGroup>
  </div>
</template>

<style lang="scss" scoped>

</style>
