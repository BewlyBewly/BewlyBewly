<script setup lang="ts">
import type { PopularAnime } from './types'
const popularAnimeList = reactive<PopularAnime[]>([])

onMounted(() => {
  getPopularAnimeList()
})

function getPopularAnimeList() {
  browser.runtime.sendMessage({
    contentScriptQuery: 'getPopularAnimeList',
  }).then((response) => {
    const { code, result: { list } } = response
    if (code === 0)
      Object.assign(popularAnimeList, list.slice(0, 10) as PopularAnime[])
  })
}
</script>

<template>
  <ul grid="~ cols-5 gap-4" overflow-hidden>
    <li
      v-for="(item, index) in popularAnimeList"
      :key="index"
      flex-shrink-0
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

<style lang="scss" scoped>

</style>
