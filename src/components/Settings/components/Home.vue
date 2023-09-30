<script lang="ts" setup>
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { grantAccessKey, revokeAccessKey } from '~/utils/authProvider'
import { accessKey, settings } from '~/logic'

const { t } = useI18n()

const authorizeBtn = ref<HTMLButtonElement>() as Ref<HTMLButtonElement>

function handleAuthorize() {
  grantAccessKey(t, authorizeBtn.value)
}

function handleRevoke() {
  revokeAccessKey()
}
</script>

<template>
  <SettingItem :title="$t('settings.recommendation_mode')" :desc="$t('settings.recommendation_mode_desc')">
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
  </SettingItem>

  <SettingItem v-if="settings.recommendationMode === 'app'" :title="$t('settings.authorize_app')">
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
        un-border="2px solid $bew-error-color" text="$bew-error-color" lh-35px rounded="$bew-radius" w-full
        @click="handleRevoke"
      >
        <span>{{ $t('settings.btn.revoke') }}</span>
      </button>
    </div>
  </SettingItem>

  <SettingItem title="Use search page mode on homepage">
    <Radio v-model="settings.useSearchPageModeOnHomePage" />
  </SettingItem>
</template>

<style lang="scss" scoped>

</style>
