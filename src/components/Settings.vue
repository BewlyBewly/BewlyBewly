<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Ref } from 'vue'
import { grantAccessKey, revokeAccessKey } from '~/utils/index'
import { accessKey, settings } from '~/logic'

const emit = defineEmits(['close'])

const { t, locale } = useI18n()

const authorizeBtn = ref<HTMLButtonElement>() as Ref<HTMLButtonElement>
const langsSelect = ref<HTMLElement>() as Ref<HTMLElement>
const themeColorOptions = reactive<Array<string>>([
  '#22c55e',
  '#34d399',
  '#14b8a6',
  '#06b6d4',
  '#00a1d6',
  '#60a5fa',
  '#3b82f6',
  '#6366f1',
  '#818cf8',
  '#a78bfa',
  '#f46d43',
  '#fb923c',
  '#f59e0b',
  '#eab308',
  '#f43f5e',
  '#fb7299',
  '#fda4af',
])

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
const bilibiliEvolvedThemeColor = computed(() => {
  return getComputedStyle(document.querySelector('html') as HTMLElement).getPropertyValue('--theme-color').trim() ?? '#00a1d6'
})

onMounted(() => {
})

watch(() => settings.value.language, (newValue, oldValue) => {
  locale.value = newValue
})

function close() {
  emit('close')
}

function handleAuthorize() {
  grantAccessKey(authorizeBtn.value)
}

function handleRevoke() {
  revokeAccessKey()
}

function changeThemeColor(color: string) {
  settings.value.themeColor = color
}
</script>

<template>
  <div class="fixed w-full h-full top-0 left-0 bg-black bg-opacity-30" z="9998" @click="close" />

  <div id="settings-window" z="9999" overflow-hidden>
    <div relative overflow-y-scroll overflow-x-hidden h-full p-8>
      <header
        flex justify-between items-center w-full h-80px
        pos="fixed left-0 top-0" p-8
        bg="$bew-content-1" z-1 rounded="t-$bew-radius"
        style="backdrop-filter: var(--bew-filter-glass)"
      >
        <div text="3xl">
          {{ $t('settings.title') }}
        </div>
        <div
          text-2xl leading-0 bg="$bew-fill-1" w="32px" h="32px" p="1" rounded-8 shadow="md" cursor="pointer"
          @click="close"
        >
          <ic-baseline-clear />
        </div>
      </header>

      <div class="settings-item" mt-60px>
        <div>
          {{ $t('settings.select_language') }}
        </div>

        <Select
          ref="langsSelect"
          v-model="settings.language"
          :options="langs"
          w="full"
        />
      </div>

      <div class="settings-item">
        <div>
          {{ $t('settings.recommendation_mode') }}
          <br>
          <span class="desc">
            {{ $t('settings.recommendation_mode_desc') }}
          </span>
        </div>

        <div flex rounded="$bew-radius" bg="$bew-fill-1" p-1>
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
      </div>

      <div
        v-if="settings.recommendationMode === 'app'" class="settings-item"
      >
        <div>
          {{ $t('settings.authorize_app') }}
          <br>
          <span class="desc">
            {{ $t('settings.authorize_app_desc') }}
            <br>
            <a
              href="https://github.com/indefined/UserScripts/tree/master/bilibiliHome#%E6%8E%88%E6%9D%83%E8%AF%B4%E6%98%8E" target="_blank" un-text="$bew-theme-color"
            >{{ $t('settings.authorize_app_more_info_access_key') }}</a>
          </span>
        </div>
        <button
          v-if="!accessKey"
          ref="authorizeBtn"
          class="btn"
          @click="handleAuthorize"
        >
          {{ $t('settings.btn.authorize') }}
        </button>
        <button v-else class="line-btn" @click="handleRevoke">
          <span>{{ $t('settings.btn.revoke') }}</span>
        </button>
      </div>

      <div class="settings-item">
        <div>
          {{ $t('settings.topbar_visible') }}
          <br>
          <span class="desc">{{ $t('settings.topbar_visible_desc') }}</span>
        </div>
        <div>
          <label for="topbarVisible" class="chk-btn" cursor="pointer" pointer="auto">
            <template v-if="settings.isShowTopbar">{{ $t('settings.chk_box.show') }}</template>
            <template v-else>{{ $t('settings.chk_box.hidden') }}</template>
            <input id="topbarVisible" v-model="settings.isShowTopbar" type="checkbox">
          </label>
        </div>
      </div>

      <div class="settings-item">
        <div>
          {{ $t('settings.theme_color') }}
          <br>
        </div>
        <div flex="~ gap-2 wrap">
          <div
            v-for="color in themeColorOptions" :key="color"
            w-20px h-20px rounded-8 cursor-pointer transition duration-300
            :style="{
              background: color,
              transform: color === settings.themeColor ? 'scale(1.2)' : 'scale(1)',
              border: color === settings.themeColor ? '2px solid var(--bew-text-1)' : 'none',
            }"
            @click="changeThemeColor(color)"
          />
        </div>
      </div>

      <div class="settings-item">
        <div>
          {{ $t('settings.follow_bilibili_evolved_color') }}
          <br>
          <span class="desc">
            {{ $t('settings.follow_bilibili_evolved_color_desc') }}
          </span>
        </div>
        <div>
          <div
            w-20px h-20px rounded-8 cursor-pointer
            :style="{
              background: bilibiliEvolvedThemeColor,
              transform: bilibiliEvolvedThemeColor === settings.themeColor ? 'scale(1.2)' : 'scale(1)',
              border: bilibiliEvolvedThemeColor === settings.themeColor ? '2px solid var(--bew-text-1)' : 'none',
            }"
            @click="changeThemeColor(bilibiliEvolvedThemeColor)"
          />
        </div>
      </div>

      <div class="settings-item">
        <div>
          {{ $t('settings.dock_position') }}
          <br>
          <span class="desc">{{ $t('settings.dock_position_desc') }}</span>
        </div>
        <div>
          <Select
            v-model="settings.dockPosition"
            :options="dockPositions"
            w="full"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#settings-window {
  --at-apply: fixed top-1/5 left-1/2 w-1/2 h-1/2 max-w-800px
    transform -translate-x-1/2
    rounded-$bew-radius
    bg-$bew-content-solid-1;
  box-shadow: var(--bew-shadow-3);

  .settings-item {
    --at-apply: flex justify-between gap-4 items-center py-2 text-base;
    .desc {
      --at-apply: text-sm text-$bew-text-3;
    }

    > *:first-child {
      --at-apply: w-5/7;
    }

    > *:last-child {
      --at-apply: w-2/7;
    }
  }
}
button,
select {
  --at-apply: w-120px
}
</style>
