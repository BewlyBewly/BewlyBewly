<script setup lang="ts">
import type { PopularAnime } from './types'

const popularAnimeList = reactive<PopularAnime[]>([])
const activatedAnime = ref<PopularAnime>()
const bannerContent = ref<HTMLElement>()
const bannerHeight = ref<number>(0)

onload = () => {
  bannerHeight.value = bannerContent.value?.offsetHeight as number
}

onresize = () => {
  bannerHeight.value = bannerContent.value?.offsetHeight as number
}

onMounted(() => {
  getPopularAnimeList()
})

function getPopularAnimeList() {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getPopularAnimeList',
    })
    .then((response) => {
      const {
        code,
        result: { list },
      } = response
      if (code === 0) {
        Object.assign(popularAnimeList, list.slice(0, 7) as PopularAnime[])
        activatedAnime.value = popularAnimeList[0]
      }
    })
}
</script>

<template>
  <div
    ref="bannerContent"
    w-full
    h-70vh
    min-h-400px
    pos="absolute top-0 left-0"
    z="-1"
    backdrop-blur-2xl
  >
    <div
      :style="{ backgroundImage: `url(${activatedAnime?.cover})` }"
      bg="cover center"
      duration-600
      w-full
      h-full
      pos="absolute"
      opacity-60
      after:content-none
      after:pos="absolute top-0 left-0"
      after:w-full after:h-full
      after:backdrop-blur-2xl
    />
  </div>
  <div h-70vh min-h-400px z-1>
    <div text="3xl">
      {{ activatedAnime?.title }}

      <img
        w="full"
        :src="activatedAnime?.ss_horizontal_cover.replace('https:', '')"
        rounded="$bew-radius"
      >
    </div>
  </div>

  <ul w-full flex gap-4 overflow-hidden m="t--150px">
    <li
      v-for="(item, index) in popularAnimeList"
      :key="index"
      flex="1"
      flex-shrink-0
      @mouseover="activatedAnime = item"
    >
      <img
        w="full"
        :src="item.ss_horizontal_cover.replace('https:', '')"
        rounded="$bew-radius"
      >
      {{ item.title }}
    </li>
  </ul>
</template>

<style lang="scss" scoped></style>
