<script lang="ts" setup>
import type { Ref } from 'vue'
import QRCodeVue from 'qrcode.vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import SearchPage from './SearchPage.vue'
import type { HomeTab } from '~/contentScripts/views/Home/types.ts'
import { HomeSubPage } from '~/contentScripts/views/Home/types'
import { getTVLoginQRCode, pollTVLoginQRCode, revokeAccessKey } from '~/utils/authProvider'
import { accessKey, settings } from '~/logic'

const { t } = useI18n()

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

const homeTabs = computed((): HomeTab[] => {
  return [
    {
      label: t('home.for_you'),
      value: HomeSubPage.ForYou,
    },
    {
      label: t('home.following'),
      value: HomeSubPage.Following,
    },
    {
      label: t('home.subscribed_series'),
      value: HomeSubPage.SubscribedSeries,
    },
    {
      label: t('home.trending'),
      value: HomeSubPage.Trending,
    },
    {
      label: t('home.ranking'),
      value: HomeSubPage.Ranking,
    },
  ]
})

function resetHomeTabs() {
  settings.value.homePageTabVisibilityList = homeTabs.value.map((tab) => {
    return {
      page: tab.value,
      visible: true,
    }
  })
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
        <div flex="~ gap-4 col items-center">
          <p>{{ $t('settings.scan_qrcode_desc') }}</p>

          <div mt-4 bg="$bew-fill-1" w-150px h-150px>
            <QRCodeVue v-if="loginQRCodeUrl" :value="loginQRCodeUrl" :size="150" />
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
      :title="$t('settings.group_home_tabs')"
    >
      <SettingsItem next-line :desc="$t('settings.home_tabs_adjustment_desc')">
        <template #title>
          <div flex="~ gap-4 items-center">
            {{ $t('settings.home_tabs_adjustment') }}
            <Button size="small" type="secondary" @click="resetHomeTabs">
              <template #left>
                <mingcute:back-line />
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
              @click="element.visible = !element.visible"
            >
              {{ homeTabs.find(tab => tab.value === element.page)?.label }}
            </div>
          </template>
        </draggable>
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
    </SettingsItemGroup>
  </div>
</template>

<style lang="scss" scoped>

</style>
