<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const list = computed(() => {
  return [
    {
      name: t('topbar.upload_dropdown.article'),
      url: 'https://member.bilibili.com/platform/upload/text/apply',
      icon: 'i-solar:document-add-bold-duotone',
    },
    {
      name: t('topbar.upload_dropdown.music'),
      url: 'https://member.bilibili.com/platform/upload/audio/frame',
      icon: 'i-solar:music-notes-bold-duotone',
    },
    {
      name: t('topbar.upload_dropdown.sticker'),
      url: 'https://member.bilibili.com/platform/upload/sticker',
      icon: 'i-solar:sticker-smile-square-bold-duotone',
    },
    {
      name: t('topbar.upload_dropdown.video'),
      url: 'https://member.bilibili.com/platform/upload/video/frame',
      icon: 'i-solar:video-frame-bold-duotone',
    },
    {
      name: t('topbar.upload_dropdown.manager'),
      url: 'https://member.bilibili.com/platform/upload-manager/article',
      icon: 'i-solar:video-library-bold-duotone',
    },
  ]
})
</script>

<template>
  <div
    style="backdrop-filter: var(--bew-filter-glass-1);"
    bg="$bew-elevated"
    rounded="$bew-radius"
    p="4"
    min-w="120px"
    shadow="[var(--bew-shadow-edge-glow-1),var(--bew-shadow-3)]"
    border="1 $bew-border-color"
    flex="~ col"
  >
    <a
      v-for="(item, index) in list"
      :key="index"
      class="upload-item"
      :href="item.url"
      target="_blank"
      flex="~ items-center gap-2"
      p="x-4 y-2"
      bg="hover:$bew-fill-2"
      rounded="$bew-radius"
      transition="all duration-300"
      m="b-1 last:b-0"
    >
      <i :class="item.icon" text="$bew-text-2" />

      <div text-nowrap>{{ item.name }}</div>
    </a>
  </div>
</template>

<style lang="scss" scoped>

</style>
