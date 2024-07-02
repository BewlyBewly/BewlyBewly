<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useApiClient } from '~/composables/api'
import { revokeAccessKey } from '~/utils/authProvider'
import { numFormatter } from '~/utils/dataFormatter'
import { LV0_ICON, LV1_ICON, LV2_ICON, LV3_ICON, LV4_ICON, LV5_ICON, LV6_ICON } from '~/utils/lvIcons'
import { getCSRF, getUserID, isHomePage } from '~/utils/main'

import type { UserInfo, UserStat } from '../types'

const props = defineProps<{
  userInfo: UserInfo
}>()

const { t } = useI18n()
const api = useApiClient()

const mid = computed(() => {
  return getUserID()
})

const otherLinks = computed((): { name: string, url: string }[] => {
  return [
    { name: t('topbar.user_dropdown.accout_settings'), url: 'https://account.bilibili.com/account/home' },
    { name: t('topbar.user_dropdown.uploads_manager'), url: 'https://member.bilibili.com/v2#/upload-manager/article' },
    { name: t('topbar.user_dropdown.b_coins_wallet'), url: 'https://pay.bilibili.com/' },
    { name: t('topbar.user_dropdown.orders'), url: 'https://show.bilibili.com/orderlist' },
    { name: t('topbar.user_dropdown.workshop'), url: 'https://gf.bilibili.com?msource=main_station' },
    { name: t('topbar.user_dropdown.my_stream_info'), url: 'https://link.bilibili.com/p/center/index' },
    { name: t('topbar.user_dropdown.my_courses'), url: 'https://www.bilibili.com/cheese/mine/list' },
  ]
})

const userStat = reactive<UserStat>({} as UserStat)

onMounted(() => {
  api.user.getUserStat()
    .then((res) => {
      if (res.code === 0)
        Object.assign(userStat, res.data)
    })
})

async function logout() {
  revokeAccessKey()
  api.auth.logout({
    biliCSRF: getCSRF(),
  }).then(() => {
    location.reload()
  })
}

const lvIcons = {
  0: LV0_ICON,
  1: LV1_ICON,
  2: LV2_ICON,
  3: LV3_ICON,
  4: LV4_ICON,
  5: LV5_ICON,
  6: LV6_ICON,
}

function getLvIcon(level: num) {
  return lvIcons[level] || ''
}

function getProgressBarWidth() {
  const { next_exp: nextExp, current_exp: currentExp, current_min: minExp } = props.userInfo.level_info

  const totalExp = nextExp - minExp
  const earnedExp = currentExp - minExp

  if (totalExp === 0)
    return '0%'

  const percentage = (earnedExp / totalExp) * 100
  return `${percentage.toFixed(2)}%`
}
</script>

<template>
  <div id="user-info-panel">
    <div id="base-info">
      {{ userInfo.uname ? userInfo.uname : '-' }}
      <div
        flex items-center bg="$bew-theme-color" p="x-3 y-1" ml-2
        text="white base" rounded="$bew-radius"
        leading-none
      >
        <span>{{ userInfo.level_info?.current_level ? userInfo.level_info.current_level : '0' }}</span>
        <div v-if="userInfo.is_senior_member" i-tabler:bolt />
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
        :target="isHomePage() ? '_blank' : '_self'"
      >{{ $t('topbar.user_dropdown.money') + userInfo.money }}</a>
      <a
        class="group"
        href="https://pay.bilibili.com/pay-v2-web/bcoin_index"
        :target="isHomePage() ? '_blank' : '_self'"
      >{{
        $t('topbar.user_dropdown.b_coins') + userInfo.wallet?.bcoin_balance
      }}</a>
    </div>
    <div
      flex="~ col"
      w="full"
      cursor="pointer"
      m="t-1 b-3"
    >
      <a
        flex="~"
        items="center"
        justify="center"
        m="b-1"
        href="//account.bilibili.com/account/record?type=exp"
        target="_blank"
      >
        <div
          flex="~"
          items="center"
          w="32px"
          h="16px"
          v-html="getLvIcon(userInfo.level_info.current_level)"
        />
        <div relative mx="1" w="240px" h="2px" bg="[var(--bew-text-4)]">
          <div
            absolute
            t="0"
            l="0"
            h="2px"
            rounded="2px"
            bg="#f3cb85"
            :style="{ width: getProgressBarWidth() }"
          />
        </div>
        <div
          class="level-next"
          flex="~"
          items="center"
          w="32px"
          h="16px"
          v-html="getLvIcon(userInfo.level_info.current_level + 1)"
        />
      </a>
      <div text="sm [var(--bew-text-2)]">
        当前成长 {{ userInfo.level_info.current_exp }}，距离升级 Lv.
        {{ userInfo.level_info.current_level + 1 }} 还需要
        {{ userInfo.level_info.next_exp - userInfo.level_info.current_exp }}
      </div>
    </div>
    <div id="channel-info">
      <a
        class="group"
        :href="`https://space.bilibili.com/${mid}/fans/follow`"
        :target="isHomePage() ? '_blank' : '_self'"
        :title="`${userStat.following}`"
      >
        <div class="num">
          {{ userStat.following ? numFormatter(userStat.following) : '0' }}
        </div>
        <div>{{ $t('topbar.user_dropdown.following') }}</div>
      </a>
      <a
        :href="`https://space.bilibili.com/${mid}/fans/fans`"
        :target="isHomePage() ? '_blank' : '_self'"
        :title="`${userStat.follower}`"
      >
        <div class="num">
          {{ userStat.follower ? numFormatter(userStat.follower) : '0' }}
        </div>
        <div>{{ $t('topbar.user_dropdown.followers') }}</div>
      </a>
      <a
        :href="`https://space.bilibili.com/${mid}/dynamic`"
        :target="isHomePage() ? '_blank' : '_self'"
        :title="`${userStat.dynamic_count}`"
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
      <a v-for="item in otherLinks" :key="item.url" :href="item.url" target="_blank">
        {{ item.name }}
        <div i-tabler:arrow-right />
      </a>
      <div id="logout" @click="logout()">
        {{ $t('topbar.user_dropdown.log_out') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#user-info-panel {
  --uno: "p-4 rounded-$bew-radius w-300px -z-1 bg-$bew-elevated";
  --uno: "border-1 border-$bew-border-color shadow-[var(--bew-shadow-edge-glow-1),var(--bew-shadow-3)]";
  backdrop-filter: var(--bew-filter-glass-1);
}

#base-info {
  --uno: "mt-8 text-xl font-medium flex items-center justify-center";
}

.level-next :deep(svg .level-bg) {
  fill: #c9ccd0;
}

#channel-info {
  --uno: "grid grid-cols-3 gap-x-2 mb-2";

  a {
    --uno: "p-2 m-0 rounded-$bew-radius text-sm flex flex-col items-center transition-all duration-300";
    --uno: "bg-$bew-fill-1 shadow-[var(--bew-shadow-edge-glow-1)] hover:bg-$bew-theme-color";

    > * {
      --uno: "transition-all duration-300";
    }

    &:hover .num,
    &:hover .num + div {
      --uno: "text-white";
    }

    .num {
      --uno: "font-semibold text-xl";

      + div {
        --uno: "text-$bew-text-2 mt-1 text-xs font-semibold";
      }
    }
  }
}

#other-link {
  --uno: "flex justify-between flex-col mt-4";

  a {
    --uno: "px-4 py-2 mb-1 flex justify-between items-center rounded-$bew-radius transition-all duration-300 hover:bg-$bew-fill-2";
    --uno: "hover:shadow-[var(--bew-shadow-edge-glow-1),var(--bew-shadow-1)]";

    span {
      --uno: "text-$bew-text-2";
    }
  }
}

#logout {
  --uno: "text-$bew-error-color important:block px-4 py-2 rounded-$bew-radius duration-300 cursor-pointer hover:bg-$bew-fill-2";
  --uno: "hover:shadow-[var(--bew-shadow-edge-glow-1),var(--bew-shadow-1)]";
}
</style>
