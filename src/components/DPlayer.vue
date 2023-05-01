<script lang="ts" setup>
import DPlayer from 'dplayer'

const dplayer = ref<HTMLElement>()

onMounted(() => {
  const dp = new DPlayer({
    container: dplayer.value,
    screenshot: true,
    video: {
      url: 'demo.mp4',
      pic: 'demo.jpg',
      thumbnails: 'thumbnails.jpg',
    },
    subtitle: {
      url: 'webvtt.vtt',
    },
    danmaku: {
      id: 'demo',
      api: 'https://api.prprpr.me/dplayer/',
    },
  })
})
</script>

<template>
  <div ref="dplayer" />
</template>

<style lang="scss" scoped>

</style>
