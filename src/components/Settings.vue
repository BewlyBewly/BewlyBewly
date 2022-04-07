<script lang="ts">
import { grantAccessKey, revokeAccessKey } from '~/utils/index'
import { language, isShowTopbar, accessKey } from '~/logic'

export default defineComponent({
  emits: ['close'],

  data() {
    return {
      isShowTopbar,
      accessKey,
      language,
      langs: [
        {
          value: 'en',
          label: 'settings.select_language_opt.english',
        },
        {
          value: 'cmn_SC',
          label: 'settings.select_language_opt.mandarin_sc',
        },
        {
          value: 'cmn_TC',
          label: 'settings.select_language_opt.mandarin_tc',
        },
        {
          value: 'jyut',
          label: 'settings.select_language_opt.jyut',
        },
      ],
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    onAuthorize() {
      const authorizeBtn = this.$refs.authorizeBtn as HTMLButtonElement
      grantAccessKey(authorizeBtn)
    },
    onRevoke() {
      revokeAccessKey()
    },
    onChangeLocale() {
      this.$i18n.locale = language.value
    },
  },
})
</script>

<template>
  <div class="fixed w-full h-full top-0 left-0 bg-black bg-opacity-30" z="9998" @click="close"></div>

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
      <select
        v-model="language"
        @change="onChangeLocale()"
      >
        <option
          v-for="lang in langs"
          :key="lang.value"
          :value="lang.value"
        >
          {{ $t(lang.label) }}
        </option>
      </select>
    </div>

    <div class="settings-item">
      <div>
        {{ $t('settings.authorize_app') }}
        <br />
        <span class="desc">{{ $t('settings.authorize_app_desc') }}</span>
      </div>
      <button
        v-if="accessKey + '' === 'undefined' || accessKey + '' === 'null'"
        ref="authorizeBtn"
        class="btn"
        @click="onAuthorize"
      >
        {{ $t('settings.btn.authorize') }}
      </button>
      <button v-else class="line-btn" @click="onRevoke">
        <span>{{ $t('settings.btn.revoke') }}</span>
      </button>
    </div>

    <div class="settings-item">
      <div>
        {{ $t('settings.topbar_visiable') }}
        <br />
        <span class="desc">{{ $t('settings.topbar_visiable_desc') }}</span>
      </div>
      <div>
        <label for="topbarVisiable" class="chk-btn" cursor="pointer" pointer="auto">
          <template v-if="isShowTopbar">{{ $t('settings.chk_box.show') }}</template>
          <template v-else>{{ $t('settings.chk_box.hidden') }}</template>
          <input id="topbarVisiable" v-model="isShowTopbar" type="checkbox" />
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#settings-window {
  @apply fixed top-1/5 left-1/2 w-700px
    transform -translate-x-1/2
    rounded-$bew-radius p-8
    bg-$bew-content-solid-1;
  box-shadow: var(--bew-shadow-3);

  .settings-item {
    @apply flex justify-between items-center py-2 text-base;
    .desc {
      @apply text-sm text-$bew-text-3;
    }

    > *:first-child {
      @apply w-4/5 mr-4;
    }
  }
}
button,
select {
  @apply w-120px
}
</style>
