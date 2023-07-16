<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getUserID } from '~/utils/main'

const { t } = useI18n()

const list = [
  { name: t('topbar.notifications'), url: '//message.bilibili.com' },
  { name: t('topbar.moments'), url: '//t.bilibili.com/' },
  { name: t('topbar.favorites'), url: `//space.bilibili.com/${getUserID ?? ''}/favlist` },
  { name: t('topbar.history'), url: '//www.bilibili.com/account/history' },
  { name: t('topbar.creative_center'), url: '//member.bilibili.com/platform/home' },
]
</script>

<template>
  <div
    bg="$bew-elevated-solid-1"
    w="170px"
    p="4"
    rounded="$bew-radius"
    flex="~ col"
    style="box-shadow: var(--bew-shadow-3)"
  >
    <a
      v-for="item in list"
      :key="item.name"
      :href="item.url"
      target="_blank"
      pos="relative"
      p="x-4 y-2"
      bg="hover:$bew-fill-2"
      rounded="$bew-radius"
      transition="all duration-300"
      m="b-1 last:b-0"
      flex="~"
      justify="between"
      items="center"
      h="35px"
    >
      {{ item.name }}
    </a>
  </div>
</template>
