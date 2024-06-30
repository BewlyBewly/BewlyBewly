<script lang="ts" setup>
import QRCodeVue from 'qrcode.vue'
import type { Ref } from 'vue'
import { useToast } from 'vue-toastification'
import draggable from 'vuedraggable'

import Button from '~/components/Button.vue'
import Input from '~/components/Input.vue'
import Radio from '~/components/Radio.vue'
import { accessKey, settings } from '~/logic'
import { useMainStore } from '~/stores/mainStore'
import { getTVLoginQRCode, pollTVLoginQRCode, revokeAccessKey } from '~/utils/authProvider'

import ChildSettingsDialog from './ChildSettingsDialog.vue'
import SearchPage from './SearchPage.vue'
import SettingsItem from './SettingsItem.vue'
import SettingsItemGroup from './SettingsItemGroup.vue'

const mainStore = useMainStore()
const toast = useToast()

const showSearchPageModeSharedSettings = ref<boolean>(false)
const showQRCodeDialog = ref<boolean>(false)
const loginQRCodeUrl = ref<string>()
const pollLoginQRCodeInterval = ref<any>(null)
const authCode = ref<string>('')
const qrcodeMsg = ref<string>('')

const preventCloseSettings = inject('preventCloseSettings') as Ref<boolean>

onDeactivated(() => {
  clearInterval(pollLoginQRCodeInterval.value)
})

onBeforeUnmount(() => {
  clearInterval(pollLoginQRCodeInterval.value)
})

function changeAppRecommendationMode() {
  settings.value.recommendationMode = 'app'
  if (!accessKey.value)
    handleAuthorize()
}

async function handleAuthorize() {
  showQRCodeDialog.value = true
  preventCloseSettings.value = true
  try {
    await setLoginQRCode()
    pollLoginQRCode()
  }
  catch (error) {
    console.error(error)
  }
}

function handleRevoke() {
  revokeAccessKey()
}

async function setLoginQRCode() {
  const res = await getTVLoginQRCode()
  if (res.code === 0) {
    loginQRCodeUrl.value = res.data.url
    authCode.value = res.data.auth_code
  }
}

function pollLoginQRCode() {
  clearInterval(pollLoginQRCodeInterval.value)

  pollLoginQRCodeInterval.value = setInterval(async () => {
    const pollRes = await pollTVLoginQRCode(authCode.value)

    // 0：成功
    // -3：API校验密匙错误
    // -400：请求错误
    // -404：啥都木有
    // 86038：二维码已失效
    // 86039：二维码尚未确认
    // 86090：二维码已扫码未确认
    if (pollRes.code !== 0)
      qrcodeMsg.value = pollRes.message
    if (pollRes.code === 0) {
      showQRCodeDialog.value = false
      preventCloseSettings.value = false
      accessKey.value = pollRes.data.access_token
      clearInterval(pollLoginQRCodeInterval.value)
      toast.success('授权成功')
    }
    else if (pollRes.code === 86038) {
      await setLoginQRCode()
    }
    else if (pollRes.code === -3 || pollRes.code === -400 || pollRes.code === -404) {
      toast.error(pollRes.message)
    }
  }, 3000)
}

function handleCloseQRCodeDialog() {
  clearInterval(pollLoginQRCodeInterval.value)
  showQRCodeDialog.value = false
  preventCloseSettings.value = false
}

function handleOpenSearchPageModeSharedSettings() {
  showSearchPageModeSharedSettings.value = true
  preventCloseSettings.value = true
}

function handleCloseSearchPageModeSharedSettings() {
  showSearchPageModeSharedSettings.value = false
  preventCloseSettings.value = false
}

function resetHomeTabs() {
  settings.value.homePageTabVisibilityList = mainStore.homeTabs.map((tab) => {
    return {
      page: tab.page,
      visible: true,
    }
  })
}

function handleToggleHomeTab(tab: any) {
  // Prevent disabling all tabs if there is only one
  if (settings.value.homePageTabVisibilityList.filter(tab => tab.visible === true).length > 1)
    tab.visible = !tab.visible
  else
    tab.visible = true
}
</script>

<template>
  <div>
    <SettingsItemGroup :title="$t('settings.group_recommendation_mode')">
      <SettingsItem :title="$t('settings.recommendation_mode')">
        <template #desc>
          <p>{{ $t('settings.recommendation_mode_desc') }}</p>
        </template>
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
            @click="changeAppRecommendationMode"
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
          <Button v-if="!accessKey" type="primary" center block @click="handleAuthorize">
            {{ $t('settings.btn.authorize') }}...
          </Button>
          <Button
            v-else type="secondary" center block style="--b-button-text-color: var(--bew-error-color)"
            @click="handleRevoke"
          >
            {{ $t('settings.btn.revoke') }}
          </Button>
        </div>
      </SettingsItem>

      <ChildSettingsDialog
        v-if="showQRCodeDialog"
        :title="$t('settings.authorize_app')" center
        style="
          --b-dialog-width: 65%;
        "
        @close="handleCloseQRCodeDialog"
      >
        <div flex="~ col gap-4 items-center">
          <div>
            <p mb-2 text-center>
              {{ $t('settings.scan_qrcode_desc') }}
            </p>
            <p text="$bew-text-2 sm">
              {{ $t('settings.authorize_app_desc') }}
            </p>
          </div>

          <div bg-white border="white 4">
            <QRCodeVue v-if="loginQRCodeUrl" :value="loginQRCodeUrl" :size="150" />
            <div v-else w-150px h-150px grid="~ place-items-center">
              <div i-svg-spinners:ring-resize />
            </div>
          </div>

          <p>{{ qrcodeMsg }}</p>

          <Button
            type="secondary"
            @click="setLoginQRCode"
          >
            {{ $t('common.refresh') }}
          </Button>
        </div>
      </ChildSettingsDialog>
    </SettingsItemGroup>

    <SettingsItemGroup
      :title="$t('settings.group_recommendation_filters')"
      :desc="$t('settings.group_recommendation_filters_desc')"
    >
      <SettingsItem :title="$t('settings.filter_by_view_count')">
        <div flex="~ justify-end" w-full>
          <Input
            v-if="settings.enableFilterByViewCount"
            v-model="settings.filterByViewCount" type="number" :min="1" :max="1000000"
            flex-1
          >
            <template #suffix>
              {{ $t('settings.filter_by_view_count_unit') }}
            </template>
          </Input>
          <Radio v-model="settings.enableFilterByViewCount" />
        </div>
      </SettingsItem>
      <SettingsItem :title="$t('settings.filter_by_duration')">
        <div flex="~ justify-end" w-full>
          <Input
            v-if="settings.enableFilterByDuration"
            v-model="settings.filterByDuration" type="number" :min="1" :max="1000000"
            flex-1
          >
            <template #suffix>
              {{ $t('settings.filter_by_duration_unit') }}
            </template>
          </Input>
          <Radio v-model="settings.enableFilterByDuration" />
        </div>
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup
      :title="$t('settings.group_home_tabs')"
    >
      <SettingsItem next-line :desc="$t('settings.home_tabs_adjustment_desc')">
        <template #title>
          <div flex="~ gap-4 items-center">
            {{ $t('settings.home_tabs_adjustment') }}
            <Button size="small" type="secondary" @click="resetHomeTabs">
              <template #left>
                <div i-mingcute:back-line />
              </template>
              {{ $t('common.reset') }}
            </Button>
          </div>
        </template>
        <draggable
          v-model="settings.homePageTabVisibilityList"
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
              @click="handleToggleHomeTab(element)"
            >
              {{ $t(mainStore.homeTabs.find(tab => tab.page === element.page)?.i18nKey ?? '') }}
            </div>
          </template>
        </draggable>
      </SettingsItem>
      <SettingsItem :title="$t('settings.always_show_tabs_on_home_page')">
        <Radio v-model="settings.alwaysShowTabsOnHomePage" />
      </SettingsItem>
    </SettingsItemGroup>

    <SettingsItemGroup :title="$t('settings.group_search_page_mode')">
      <SettingsItem :title="$t('settings.use_search_page_mode')">
        <Radio v-model="settings.useSearchPageModeOnHomePage" />
      </SettingsItem>
      <template v-if="settings.useSearchPageModeOnHomePage">
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
            style="--b-dialog-height: 85%;"
            @close="handleCloseSearchPageModeSharedSettings"
          >
            <template #desc>
              <span color="$bew-warning-color">{{ $t('settings.settings_shared_with_the_search_page_desc') }}</span>
            </template>

            <SearchPage />
          </ChildSettingsDialog>
        </SettingsItem>

        <SettingsItem :title="$t('settings.search_page_mode_wallpaper_fixed')">
          <Radio v-model="settings.searchPageModeWallpaperFixed" />
        </SettingsItem>

        <SettingsItem :title="$t('settings.always_show_the_top_bar_logo')">
          <Radio v-model="settings.alwaysShowTheTopBarLogoOnSearchPageMode" />
        </SettingsItem>
      </template>
    </SettingsItemGroup>
  </div>
</template>

<style lang="scss" scoped>

</style>
