<script setup lang="ts">
import type { PopularAnime } from '../types'

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
  <div ref="bannerContent" w-full h-800px pos="absolute top-0 left-0" z="-1">
    <!-- banner mask -->
    <div
      pos="absolute bottom-0 left-0"
      w-full
      h-300px
      bg="gradient-to-b gradient-from-transparent gradient-to-$bew-bg"
      z-1
    />
    <div
      :style="{
        backgroundImage: `url(${activatedAnime?.ss_horizontal_cover})`,
      }"
      bg="cover center"
      duration-600
      w-full
      h-full
      pos="absolute"
      after:content-none
      after:pos="absolute top-0 left-0"
      after:w-full
      after:h-full
    />
  </div>

  <!-- banner -->
  <div h-800px z-1 pos="relative" flex justify-center>
    <div>
      <!-- <img
        :src="activatedAnime?.ss_horizontal_cover.replace('https:', '')"
        pointer-events-none
        rounded="$bew-radius"
        h="[calc(100%-170px)]"
      > -->
      <!-- <div text="2xl white" p-4 pos="relative" bg="black opacity-60">
        {{ activatedAnime?.title }}
      </div> -->
    </div>
  </div>

  <div flex="~ justify-between" m="t--350px">
    <ul
      w="1/3"
      ml-auto
      flex
      overflow-hidden
      z-1
      relative
    >
      <li
        v-for="(item, index) in popularAnimeList"
        :key="index"
        pr-2
        flex="~ 1 gap-2 shrink-0"
        @mouseover="activatedAnime = item"
      >
        <img :src="item.cover.replace('https:', '')">
        <!-- <div flex items-center>
          {{ item.title }}
        </div> -->
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>
