<script setup lang="ts">
import type { Ref } from 'vue'
import PopularAnimeCarousel from './components/PopularAnimeCarousel.vue'
import type { AnimeItem } from './types'
import { getUserID } from '~/utils'

const recommendAnimeList = reactive<AnimeItem[]>([])
const animeWatchList = reactive<AnimeItem[]>([])
const cursor = ref<number>()
const isLoading = ref<boolean>()

onMounted(() => {
  getRecommendAnimeList()
  getAnimeWatchList()

  window.onscroll = () => {
    if (
      window.innerHeight + window.scrollY
      >= document.body.scrollHeight - 20
    ) {
      if (isLoading.value)
        return

      getRecommendAnimeList()
    }
  }
})

onUnmounted(() => {
  // remove the global window.onscroll event
  window.onscroll = () => {}
})

function getAnimeWatchList() {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getAnimeWatchList',
      vmid: getUserID() ?? 0,
      pn: 1,
      ps: 6,
    })
    .then((response) => {
      const {
        code,
        data: { list },
      } = response
      if (code === 0) {
        Object.assign(
          animeWatchList,
          list,
        )
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

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
            items[0].sub_items as AnimeItem[],
          )
        }
        else {
          recommendAnimeList.push(...items[0].sub_items)
        }
        cursor.value = coursor
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<template>
  <div>
    <div>
      <!-- <section mb-16>
        <PopularAnimeCarousel />
      </section> -->
      <!-- Your Watchlist -->
      <section mb-16>
        <h3 text="3xl $bew-text-1" font="bold" mb-6>
          Your Watchlist
        </h3>
        <div grid="~ xl:cols-6 lg:cols-4 md:cols-3 cols-2 gap-6">
          <div v-for="item in animeWatchList" :key="item.episode_id">
            <a
              rounded="$bew-radius"
              aspect="12/16"
              overflow-hidden
              mb-4
              bg="$bew-fill-3"
              :href="item.url"
              target="_blank"
            >
              <img
                :src="`${item.cover.replace('https:', '')}@466w_622h.webp`"
                :alt="item.title"
                rounded="$bew-radius"
              >
            </a>
            <p un-text="lg" my-4>
              <a :href="item.link" target="_blank">
                {{ item.title }}
              </a>
            </p>
            <p text="$bew-text-2" mb-10>
              {{ item.progress !== "" ? item.progress : `Haven't seen` }}
            </p>
          </div>
        </div>
      </section>

      <!-- Recommended for you -->
      <section>
        <h3 text="3xl $bew-text-1" font="bold" mb-6>
          Recommended for you
        </h3>
        <div grid="~ xl:cols-6 lg:cols-4 md:cols-3 cols-2 gap-6">
          <div v-for="item in recommendAnimeList" :key="item.episode_id">
            <a
              rounded="$bew-radius"
              aspect="12/16"
              overflow-hidden
              mb-4
              bg="$bew-fill-3"
              :href="item.link"
              target="_blank"
            >
              <img
                :src="`${item.cover.replace('https:', '')}@466w_622h.webp`"
                :alt="item.title"
                rounded="$bew-radius"
              >
            </a>
            <p un-text="lg" my-4>
              <a :href="item.link" target="_blank">
                {{ item.title }}
              </a>
            </p>
            <p text="$bew-text-2" mb-10>
              <span
                text="$bew-theme-color"
                bg="$bew-theme-color-20"
                p="x-3 y-1"
                mr-2
                rounded-4
              >{{ item.rating ?? '-.-' }}</span>
              {{ item.sub_title }}
            </p>
          </div>
        </div>
      </section>
    </div>
    <!-- loading -->
    <loading v-if="isLoading && recommendAnimeList.length !== 0" m="-t-4" />
  </div>
</template>

<style lang="scss" scoped></style>
