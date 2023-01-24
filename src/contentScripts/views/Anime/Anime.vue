<script setup lang="ts">
// import PopularAnimeCarousel from './components/PopularAnimeCarousel.vue'
import type { Ref } from 'vue'
import type { RecommendAnimeItem } from './types'

const recommendAnimeList = reactive<RecommendAnimeItem[]>([])
const cursor = ref<number>()
const animeWrap = ref<HTMLElement>() as Ref<HTMLElement>
const isLoading = ref<boolean>()

onMounted(() => {
  getRecommendAnimeList()

  if (animeWrap.value) {
    animeWrap.value.addEventListener('scroll', () => {
      // When you scroll to the bottom, they will automatically
      // add the next page of data to the history list
      if (
        animeWrap.value.clientHeight + animeWrap.value.scrollTop
          >= animeWrap.value.scrollHeight - 20
        && recommendAnimeList.length > 0
        && !isLoading.value
      )
        getRecommendAnimeList()
    })
  }
})

function getRecommendAnimeList() {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getRecommendAnimeList',
      cursor: cursor.value ?? '',
    })
    .then((response) => {
      const {
        code,
        data: { items, coursor },
      } = response
      if (code === 0) {
        if (recommendAnimeList.length === 0) {
          Object.assign(
            recommendAnimeList,
            items[0].sub_items as RecommendAnimeItem[],
          )
        }
        else { recommendAnimeList.push(...items[0].sub_items) }
        cursor.value = coursor
      }
    }).finally(() => { isLoading.value = false })
}
</script>

<template>
  <div ref="animeWrap">
    <!-- <PopularAnimeCarousel /> -->
    <section>
      <h3 text="3xl $bew-text-1" font="bold" my-4>
        Recommended for you
      </h3>
      <div grid="~ xl:cols-6 lg:cols-4 md:cols-3 cols-2 gap-6">
        <a
          v-for="item in recommendAnimeList"
          :key="item.episode_id"
          :href="item.link"
          target="_blank"
        >
          <div
            rounded="$bew-radius"
            aspect="12/16"
            overflow-hidden
            mb-4
            bg="$bew-fill-3"
          >
            <img
              :src="`${item.cover.replace('https:', '')}@466w_622h.webp`"
              :alt="item.title"
              rounded="$bew-radius"
            >
          </div>
          <p text="lg" my-2>{{ item.title }}</p>
          <p text="$bew-text-2" mb-8>{{ item.sub_title }}</p>
        </a>
      </div>
    </section>
  </div>
  <!-- loading -->
  <loading v-if="isLoading && recommendAnimeList.length !== 0" m="-t-4" />
</template>

<style lang="scss" scoped></style>
