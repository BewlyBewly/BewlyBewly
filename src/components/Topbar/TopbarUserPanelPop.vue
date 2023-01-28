<script lang="ts">
import { defineComponent } from 'vue'
import { revokeAccessKey } from '../../utils/index'
import { getCSRF, getUserID, numFormatter } from '~/utils'
export default defineComponent({
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mid: getUserID(),
      userStat: {} as any,
      numFormatter,
    }
  },
  mounted() {
    browser.runtime
      .sendMessage({
        contentScriptQuery: 'getUserStat',
      })
      .then((res) => {
        if (res.code === 0)
          this.userStat = res.data
      })
  },
  methods: {
    async logout() {
      revokeAccessKey()
      await browser.runtime.sendMessage({
        contentScriptQuery: 'logout',
        biliCSRF: getCSRF(),
      })
      location.reload()
    },
  },
})
</script>

<template>
  <div id="user-info-panel">
    <div id="base-info">
      {{ userInfo.uname ? userInfo.uname : '-' }}
      <div
        class="bg-$bew-theme-color px-3 py-1 ml-2 text-white rounded-$bew-radius text-base leading-none"
      >
        {{
          userInfo.level_info?.current_level
            ? userInfo.level_info.current_level
            : '0'
        }}
      </div>
    </div>
    <div
      class="text-sm text-$bew-text-2"
      flex="~"
      items="center"
      justify="center"
      m="t-1 b-3"
    >
      <a
        class="group mr-4"
        href="https://account.bilibili.com/account/coin"
        target="_blank"
      >{{ $t('topbar.user_dropdown.money') + userInfo.money }}</a>
      <a
        class="group"
        href="https://pay.bilibili.com/pay-v2-web/bcoin_index"
        target="_blank"
      >{{
        $t('topbar.user_dropdown.b_coins') + userInfo.wallet?.bcoin_balance
      }}</a>
    </div>
    <div id="channel-info">
      <a
        class="group"
        :href="`https://space.bilibili.com/${mid}/fans/follow`"
        target="_blank"
        :title="userStat.following"
      >
        <div class="num">
          {{ userStat.following ? numFormatter(userStat.following) : '0' }}
        </div>
        <div>{{ $t('topbar.user_dropdown.following') }}</div>
      </a>
      <a
        :href="`https://space.bilibili.com/${mid}/fans/fans`"
        target="_blank"
        :title="userStat.follower"
      >
        <div class="num">
          {{ userStat.follower ? numFormatter(userStat.follower) : '0' }}
        </div>
        <div>{{ $t('topbar.user_dropdown.followers') }}</div>
      </a>
      <a
        href="https://t.bilibili.com/"
        target="_blank"
        :title="userStat.dynamic_count"
      >
        <div class="num">
          {{
            userStat.dynamic_count ? numFormatter(userStat.dynamic_count) : '0'
          }}
        </div>
        <div>{{ $t('topbar.user_dropdown.posts') }}</div>
      </a>
    </div>
    <div id="other-link">
      <a href="https://account.bilibili.com/account/home" target="_blank">
        {{ $t('topbar.user_dropdown.accout_settings') }}
        <tabler:arrow-right />
      </a>
      <a
        href="https://member.bilibili.com/v2#/upload-manager/article"
        target="_blank"
      >
        {{ $t('topbar.user_dropdown.uploads_manager') }}
        <tabler:arrow-right />
      </a>
      <a href="https://pay.bilibili.com/" target="_blank">
        {{ $t('topbar.user_dropdown.b_coins_wallet') }}
        <tabler:arrow-right />
      </a>
      <a href="https://show.bilibili.com/orderlist" target="_blank">
        {{ $t('topbar.user_dropdown.orders') }}
        <tabler:arrow-right />
      </a>
      <a href="https://link.bilibili.com/p/center/index" target="_blank">
        {{ $t('topbar.user_dropdown.my_stream_info') }}
        <tabler:arrow-right />
      </a>
      <a href="https://www.bilibili.com/cheese/mine/list" target="_blank">
        {{ $t('topbar.user_dropdown.my_courses') }}
        <tabler:arrow-right />
      </a>
      <div id="logout" @click="logout()">
        {{ $t('topbar.user_dropdown.log_out') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#user-info-panel {
  --at-apply: p-4 rounded-$bew-radius w-300px -z-1
    bg-$bew-content-solid-1;
  box-shadow: var(--bew-shadow-3);
}

#base-info {
  --at-apply: mt-8 text-xl font-medium flex items-center justify-center;
}

#channel-info {
  --at-apply: grid grid-cols-3 gap-x-2 mb-2;

  a {
    --at-apply: p-2 m-0 rounded-$bew-radius text-sm
      flex flex-col items-center transition-all duration-300
      bg-$bew-fill-1
      // hover:bg-$bew-theme-color
      hover:text-white;

    > * {
      // --at-apply: transition-all duration-300;
    }

    &:hover .num + div{
      --at-apply: text-white;
    }

    .num {
      --at-apply: font-semibold text-xl;

      + div {
        --at-apply: text-$bew-text-2 mt-1 text-xs font-semibold;
      }
    }
  }
}

#other-link {
  --at-apply: flex justify-between flex-col mt-4;

  a {
    --at-apply: px-4 py-2 mb-1 flex justify-between items-center
      rounded-$bew-radius transition-all duration-300
      hover:bg-$bew-fill-2;

    span {
      --at-apply: text-$bew-text-2;
    }
  }
}

#logout {
  --at-apply: text-red-400 important:block px-4 py-2 rounded-$bew-radius
    duration-300 cursor-pointer
    hover:bg-$bew-fill-2;
}
</style>
