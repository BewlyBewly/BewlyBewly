<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Ref } from 'vue'
import { grantAccessKey, revokeAccessKey } from '~/utils/index'
import { accessKey, settings } from '~/logic'

const emit = defineEmits(['close'])

const { t, locale } = useI18n()

const authorizeBtn = ref<HTMLButtonElement>() as Ref<HTMLButtonElement>
const langsSelect = ref<HTMLElement>() as Ref<HTMLElement>
const themeColorOptions = reactive<Array<{ value: string; label: string }>>([
  {
    value: '#00a1d6',
    label: '#00a1d6',
  },
  {
    value: '#fb7299',
    label: '#fb7299',
  },
  {
    value: '#49e0ad',
    label: '#49e0ad',
  },
  {
    value: '#0d9488',
    label: '#0d9488',
  },
  {
    value: '#6366f1',
    label: '#6366f1',
  },
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

  <div id="settings-window" z="9999">
    <div
      class="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2"
      text="2xl"
      font="leading-0"
      bg="$bew-content-solid-1"
      w="32px"
      h="32px"
      p="1"
      rounded="full"
      shadow="md"
      cursor="pointer"
      @click="close"
    >
      <ic-baseline-clear />
    </div>
    <div text="3xl" m="b-4">
      {{ $t('settings.title') }}
    </div>

    <div class="settings-item">
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

    <div class="settings-item" important-hidden>
      <div>
        {{ $t('settings.authorize_app') }}
        <br>
        <span class="desc">{{ $t('settings.authorize_app_desc') }}</span>
      </div>
      <button
        v-if="`${accessKey}` === 'undefined' || `${accessKey}` === 'null' || accessKey === ''"
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
        <label for="topbarVisiable" class="chk-btn" cursor="pointer" pointer="auto">
          <template v-if="settings.isShowTopbar">{{ $t('settings.chk_box.show') }}</template>
          <template v-else>{{ $t('settings.chk_box.hidden') }}</template>
          <input id="topbarVisiable" v-model="settings.isShowTopbar" type="checkbox">
        </label>
      </div>
    </div>

    <div class="settings-item">
      <div>
        Theme color
        <br>
        <!-- <span class="desc">{{ $t('settings.topbar_visible_desc') }}</span> -->
      </div>
      <div flex="~ gap-2">
        <div
          v-for="item in themeColorOptions" :key="item.value"
          w-20px h-20px rounded-8 cursor-pointer transition duration-300
          :bg="item.value"
          :style="{
            transform: item.value === settings.themeColor ? 'scale(1.2)' : 'scale(1)',
            border: item.value === settings.themeColor ? '2px solid var(--bew-text-1)' : 'none',
          }"
          @click="changeThemeColor(item.value)"
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
</template>

<style lang="scss" scoped>
#settings-window {
  --at-apply: fixed top-1/5 left-1/2 w-700px
    transform -translate-x-1/2
    rounded-$bew-radius p-8
    bg-$bew-content-solid-1;
  box-shadow: var(--bew-shadow-3);

  .settings-item {
    --at-apply: flex justify-between items-center py-2 text-base;
    .desc {
      --at-apply: text-sm text-$bew-text-3;
    }

    > *:first-child {
      --at-apply: w-5/7 mr-4;
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
