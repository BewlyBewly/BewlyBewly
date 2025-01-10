<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { getUserID } from '~/utils/main'

const { t } = useI18n()

const list = computed((): { name: string, url: string, icon: string }[] => [
  { name: t('topbar.notifications'), url: '//message.bilibili.com', icon: 'i-mingcute:notification-line' },
  { name: t('topbar.moments'), url: '//t.bilibili.com/', icon: 'i-tabler:windmill' },
  { name: t('topbar.favorites'), url: `//space.bilibili.com/${getUserID() ?? ''}/favlist`, icon: 'i-mingcute:star-line' },
  { name: t('topbar.history'), url: '//www.bilibili.com/history', icon: 'i-mingcute:time-line' },
  { name: t('topbar.watch_later'), url: '//www.bilibili.com/watchlater/#/list', icon: 'i-mingcute:carplay-line' },
  { name: t('topbar.creative_center'), url: '//member.bilibili.com/platform/home', icon: 'i-mingcute:bulb-line' },
])
</script>

<template>
  <div
    style="backdrop-filter: var(--bew-filter-glass-1);"
    h="[calc(100vh-100px)]" max-h-264px important-overflow-y-auto
    w="180px"
    bg="$bew-elevated"
    p="4"
    rounded="$bew-radius"
    flex="~ col"
    shadow="[var(--bew-shadow-edge-glow-1),var(--bew-shadow-3)]"
    border="1 $bew-border-color"
  >
    <ALink
      v-for="item in list"
      :key="item.name"
      :href="item.url"
      type="topBar"
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
    </ALink>
  </div>
</template>
