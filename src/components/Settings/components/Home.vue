<script lang="ts" setup>
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SearchPage from './SearchPage.vue'
import { grantAccessKey, revokeAccessKey } from '~/utils/authProvider'
import { accessKey, settings } from '~/logic'

const { t } = useI18n()

const authorizeBtn = ref<HTMLButtonElement>() as Ref<HTMLButtonElement>
const showSearchPageModeSharedSettings = ref<boolean>(false)

const preventCloseSettings = inject('preventCloseSettings') as Ref<boolean>

function handleAuthorize() {
  grantAccessKey(t, authorizeBtn.value)
}

function handleRevoke() {
  revokeAccessKey()
}

function handleOpenSearchPageModeSharedSettings() {
  showSearchPageModeSharedSettings.value = true
  preventCloseSettings.value = true
}

function handleCloseSearchPageModeSharedSettings() {
  showSearchPageModeSharedSettings.value = false
  preventCloseSettings.value = false
}
</script>

<template>
  <div>
    <SettingsItemGroup :title="$t('settings.group_recommendation_mode')">
      <SettingsItem :title="$t('settings.recommendation_mode')" :desc="$t('settings.recommendation_mode_desc')">
        <div w-full flex rounded="$bew-radius" bg="$bew-fill-1" p-1>
          <div
            flex-1 py-1 cursor-pointer text-center rounded="$bew-radius"
            :style="{
              background: settings.recommendationMode === 'web' ? 'var(--bew-theme-color)' : '',
              color: settings.recommendationMode === 'web' ? 'white' : '',
            }"
            @click="settings.recommendationMode = 'web'"
          >
            Web
          </div>
          <div
            flex-1 py-1 cursor-pointer text-center rounded="$bew-radius"
            :style="{
              background: settings.recommendationMode === 'app' ? 'var(--bew-theme-color)' : '',
              color: settings.recommendationMode === 'app' ? 'white' : '',
            }"
            @click="settings.recommendationMode = 'app'"
          >
            App
          </div>
        </div>
      </SettingsItem>

      <SettingsItem v-if="settings.recommendationMode === 'app'" :title="$t('settings.authorize_app')">
        <template #desc>
          {{ $t('settings.authorize_app_desc') }}
          <br>
          <a
            href="https://github.com/indefined/UserScripts/tree/master/bilibiliHome#%E6%8E%88%E6%9D%83%E8%AF%B4%E6%98%8E" target="_blank" color="$bew-theme-color"
          >{{ $t('settings.authorize_app_more_info_access_key') }}</a>
        </template>

        <div w-full>
          <button
            v-if="!accessKey"
            ref="authorizeBtn"
            bg="$bew-theme-color" text-white lh-35px rounded="$bew-radius" w-full
            @click="handleAuthorize"
          >
            {{ $t('settings.btn.authorize') }}
          </button>
          <button
            v-else
            bg="$bew-fill-1" text="$bew-error-color" lh-35px rounded="$bew-radius" w-full
            @click="handleRevoke"
          >
            <span>{{ $t('settings.btn.revoke') }}</span>
          </button>
        </div>
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup :title="$t('settings.group_search_page_mode')">
      <SettingsItem :title="$t('settings.use_search_page_mode')">
        <Radio v-model="settings.useSearchPageModeOnHomePage" />
      </SettingsItem>
      <SettingsItem :title="$t('settings.settings_shared_with_the_search_page')">
        <template #desc>
          <span color="$bew-warning-color">{{ $t('settings.settings_shared_with_the_search_page_desc') }}</span>
        </template>
        <Button type="secondary" block center @click="handleOpenSearchPageModeSharedSettings">
          {{ $t('settings.btn.open_settings') }}
        </Button>

        <ChildSettingsDialog
          v-if="showSearchPageModeSharedSettings"
          :title="$t('settings.settings_shared_with_the_search_page')"
          @close="handleCloseSearchPageModeSharedSettings"
        >
          <template #desc>
            <span color="$bew-warning-color">{{ $t('settings.settings_shared_with_the_search_page_desc') }}</span>
          </template>

          <SearchPage />
        </ChildSettingsDialog>
      </SettingsItem>
    </SettingsItemGroup>
  </div>
</template>

<style lang="scss" scoped>

</style>
