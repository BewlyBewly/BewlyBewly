<script setup lang="ts">
import DOMPurify from 'dompurify'
import { useI18n } from 'vue-i18n'

import { useApiClient } from '~/composables/api'
import { revokeAccessKey } from '~/utils/authProvider'
import { numFormatter } from '~/utils/dataFormatter'
import { LV0_ICON, LV1_ICON, LV2_ICON, LV3_ICON, LV4_ICON, LV5_ICON, LV6_ICON, LV6_LIGHTNING_ICON } from '~/utils/lvIcons'
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

const otherLinks = computed((): { name: string, url: string, icon: string }[] => {
  return [
    {
      name: t('topbar.user_dropdown.uploads_manager'),
      url: 'https://member.bilibili.com/v2#/upload-manager/article',
      icon: 'i-solar:video-library-bold-duotone',
    },
    {
      name: t('topbar.user_dropdown.account_settings'),
      url: 'https://account.bilibili.com/account/home',
      icon: 'i-solar:user-circle-bold-duotone',
    },
    {
      name: t('topbar.user_dropdown.b_coins_wallet'),
      url: 'https://pay.bilibili.com/',
      icon: 'i-solar:wallet-money-bold-duotone',
    },
    {
      name: t('topbar.user_dropdown.orders'),
      url: 'https://show.bilibili.com/orderlist',
      icon: 'i-solar:clipboard-list-bold-duotone',
    },
    {
      name: t('topbar.user_dropdown.workshop'),
      url: 'https://gf.bilibili.com?msource=main_station',
      icon: 'i-solar:garage-bold-duotone',
    },
    {
      name: t('topbar.user_dropdown.my_stream_info'),
      url: 'https://link.bilibili.com/p/center/index',
      icon: 'i-solar:videocamera-record-bold-duotone',
    },
    {
      name: t('topbar.user_dropdown.my_courses'),
      url: 'https://www.bilibili.com/cheese/mine/list',
      icon: 'i-solar:notebook-bookmark-bold-duotone',
    },
  ]
})

const levelProgressBarWidth = computed(() => {
  const { next_exp: nextExp, current_exp: currentExp, current_min: minExp } = props.userInfo.level_info

  const totalExp = nextExp - minExp
  const earnedExp = currentExp - minExp

  if (totalExp === 0)
    return '0%'

  const percentage = (earnedExp / totalExp) * 100
  return `${percentage.toFixed(2)}%`
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

const levelIcons: string[] = [
  LV0_ICON,
  LV1_ICON,
  LV2_ICON,
  LV3_ICON,
  LV4_ICON,
  LV5_ICON,
  LV6_ICON,
  LV6_LIGHTNING_ICON,
]

function getLvIcon(level: number, isSigma: boolean = false): string {
  if (level === 6 && isSigma) {
    return LV6_LIGHTNING_ICON
  }
  return levelIcons[level] || ''
}
</script>

<template>
  <div
    style="backdrop-filter: var(--bew-filter-glass-1);"
    p-4 rounded="$bew-radius" w-300px z--1 bg="$bew-elevated-alt"
    border="1 $bew-border-color"
    shadow="[var(--bew-shadow-3),var(--bew-shadow-edge-glow-1)]"
  >
    <div
      text="xl" flex="~ items-center justify-center"
      mt-8 font-medium
    >
      {{ userInfo.uname ? userInfo.uname : '-' }}
    </div>
    <div
      text="xs $bew-text-2"
      flex="~ items-center justify-center"
      m="t-1 b-2"
    >
      <a
        class="group mr-4"
        href="https://account.bilibili.com/account/coin"
        :target="isHomePage() ? '_blank' : '_self'"
      >{{ $t('topbar.user_dropdown.money') + (userInfo.money ?? '-') }}</a>
      <a
        class="group"
        href="https://pay.bilibili.com/pay-v2-web/bcoin_index"
        :target="isHomePage() ? '_blank' : '_self'"
      >{{
        $t('topbar.user_dropdown.b_coins') + (userInfo.wallet?.bcoin_balance ?? '-')
      }}</a>
    </div>

    <a
      href="//account.bilibili.com/account/record?type=exp"
      target="_blank"
      block mb-2 w-full
      flex="~ col justify-center items-center"
    >
      <template v-if="userInfo?.level_info?.current_level < 6">
        <div
          flex="~ items-center justify-center gap-2"
          w-full
        >
          <div
            flex="~ items-center"
            class="level"
            v-html="DOMPurify.sanitize(getLvIcon(userInfo.level_info.current_level))"
          />
          <div relative w="full" h="2px" bg="$bew-fill-3">
            <div
              pos="absolute top-0 left-0" h-2px
              h="2px"
              rounded="2px"
              bg="$bew-warning-color"
              :style="{ width: levelProgressBarWidth }"
            />
          </div>
          <div
            class="level level-next"
            flex="~ items-center"
            v-html="DOMPurify.sanitize(getLvIcon(userInfo.level_info.current_level + 1))"
          />
        </div>
        <div w-full text="xs $bew-text-3">
          <!-- Current XP: 103; need 500 more for LV2. -->
          {{
            $t('topbar.user_dropdown.exp_desc', {
              current_exp: userInfo.level_info.current_exp,
              level: userInfo.level_info.current_level + 1,
              need_exp: userInfo.level_info.next_exp - userInfo.level_info.current_exp || 0,
            })
          }}
        </div>
      </template>
      <template v-else>
        <div
          :style="{ width: userInfo?.is_senior_member ? '36px' : '28px' }"
          h-20px
          flex="~ items-center"
          v-html="DOMPurify.sanitize(getLvIcon(userInfo?.level_info?.current_level, userInfo?.is_senior_member))"
        />
      </template>
    </a>

    <div grid="~ cols-3 gap-2" mb-2>
      <a
        class="channel-info-item"
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
        class="channel-info-item"
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
        class="channel-info-item"
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

    <div
      flex="~ justify-between col gap-1"
      mb-2 p-2 bg="$bew-fill-alt" rounded="$bew-radius"
      shadow="[var(--bew-shadow-edge-glow-1),var(--bew-shadow-1)]"
    >
      <a
        v-for="item in otherLinks.filter((_, index) => index <= 1)"
        :key="item.url"
        :href="item.url"
        target="_blank"
        p="x-4 y-2" flex="~ items-center justify-between"
        rounded="$bew-radius"
        duration-300
        bg="hover:$bew-fill-2"
      >
        <div flex="~ items-center gap-2">
          <div :class="item.icon" text="$bew-text-2" />
          {{ item.name }}
        </div>
        <div i-mingcute:arrow-right-line />
      </a>
    </div>

    <div
      flex="~ justify-between col gap-1"
      p-2 bg="$bew-fill-alt" rounded="$bew-radius"
      shadow="[var(--bew-shadow-edge-glow-1),var(--bew-shadow-1)]"
    >
      <a
        v-for="item in otherLinks.filter((_, index) => index > 1)"
        :key="item.url"
        :href="item.url"
        target="_blank"
        p="x-4 y-2" flex="~ items-center justify-between"
        rounded="$bew-radius"
        duration-300
        hover:bg="$bew-fill-2"
      >
        <div flex="~ items-center gap-2">
          <div :class="item.icon" text="$bew-text-2" />
          {{ item.name }}
        </div>
        <div i-mingcute:arrow-right-line />
      </a>
      <div
        text="$bew-error-color"
        p="x-4 y-2" flex="~ items-center"
        rounded="$bew-radius"
        duration-300 cursor-pointer
        hover:bg="$bew-fill-2"
        @click="logout()"
      >
        <div i-solar:logout-2-bold-duotone text="$bew-error-60" mr-2 />
        {{ $t('topbar.user_dropdown.log_out') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.level :deep(svg) {
  --uno: "w-25px h-16px";
}

.level-next :deep(svg .level-bg) {
  --uno: "fill-#c9ccd0";
}

.channel-info-item {
  --uno: "p-2 m-0 rounded-$bew-radius text-sm flex flex-col items-center transition-all duration-300";
  --uno: "bg-$bew-fill-alt hover:bg-$bew-fill-2";
  --uno: "shadow-[var(--bew-shadow-edge-glow-1),var(--bew-shadow-1)]";

  > * {
    --uno: "transition-all duration-300";
  }

  .num {
    --uno: "font-semibold text-xl";

    + div {
      --uno: "text-$bew-text-2 mt-1 text-xs font-semibold";
    }
  }
}
</style>
