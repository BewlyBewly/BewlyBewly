<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { getUserID, isHomePage } from '~/utils/main'

const { t } = useI18n()

const list = [
  { name: t('topbar.notifications'), url: '//message.bilibili.com', icon: 'i-mingcute:notification-line' },
  { name: t('topbar.moments'), url: '//t.bilibili.com/', icon: 'i-tabler:windmill' },
  { name: t('topbar.favorites'), url: `//space.bilibili.com/${getUserID() ?? ''}/favlist`, icon: 'i-mingcute:star-line' },
  { name: t('topbar.history'), url: '//www.bilibili.com/account/history', icon: 'i-mingcute:time-line' },
  { name: t('topbar.watch_later'), url: '//www.bilibili.com/watchlater/#/list', icon: 'i-mingcute:carplay-line' },
  { name: t('topbar.creative_center'), url: '//member.bilibili.com/platform/home', icon: 'i-mingcute:bulb-line' },
]
</script>

<template>
  <div
    style="box-shadow: var(--bew-shadow-3)"
    bg="$bew-elevated-solid-1"
    w="180px"
    p="4"
    rounded="$bew-radius"
    flex="~ col"
  >
    <a
      v-for="item in list"
      :key="item.name"
      :href="item.url"
      :target="isHomePage() ? '_blank' : '_self'"
      pos="relative"
      p="x-4 y-2"
      bg="hover:$bew-fill-2"
      rounded="$bew-radius"
      transition="all duration-300"
      m="b-1 last:b-0"
      flex="~"
      items="center"
    >
      <i :class="item.icon" class="mr-4" />
      <span class="flex-1">{{ item.name }}</span>
    </a>
  </div>
</template>
