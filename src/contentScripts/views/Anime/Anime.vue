<script setup lang="ts">
import type { Ref } from 'vue'
import PopularAnimeCarousel from './components/PopularAnimeCarousel.vue'
import type { AnimeItem } from './types'
import { getUserID } from '~/utils'

const recommendAnimeList = reactive<AnimeItem[]>([])
const animeWatchList = reactive<AnimeItem[]>([])
const cursor = ref<number>()
const isLoading = ref<boolean>()
const activatedSeasonId = ref<number>()

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
      if (code === 0)
        Object.assign(animeWatchList, list)
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
        if (recommendAnimeList.length === 0)
          Object.assign(recommendAnimeList, items[0].sub_items as AnimeItem[])
        else recommendAnimeList.push(...items[0].sub_items)

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
        <div grid="~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-6">
          <article v-for="item in animeWatchList" :key="item.episode_id">
            <a
              rounded="$bew-radius"
              aspect="video"
              overflow-hidden
              mb-4
              bg="$bew-fill-3"
              :href="item.url"
              target="_blank"
            >
              <img
                :src="`${item.horizontal_cover_16_9.replace(
                  'https:',
                  '',
                )}@672w_378h_1c`"
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
              {{ item.progress !== '' ? item.progress : `Haven't seen` }}
            </p>
          </article>
        </div>
      </section>

      <!-- Recommended for you -->
      <section>
        <h3 text="3xl $bew-text-1" font="bold" mb-6>
          Recommended for you
        </h3>
        <div grid="~ 2xl:cols-6 xl:cols-5 lg:cols-4 md:cols-3 cols-2 gap-6">
          <article
            v-for="item in recommendAnimeList"
            :key="item.episode_id"
            class="group"
            @mouseenter="activatedSeasonId = item.season_id"
            @mouseleave="activatedSeasonId = 0"
          >
            <div
              overflow-hidden
              rounded="$bew-radius"
              aspect="12/16"
              mb-4
              pos="relative"
              bg="$bew-fill-3"
            >
              <a :href="item.link" target="_blank">
                <!-- anime genres -->
                <div
                  pos="absolute bottom-0"
                  w-full
                  h-200px
                  flex
                  items-end
                  z-1
                  opacity="0 group-hover:100"
                  transform="~ translate-y-4 group-hover:translate-y-0"
                  transition="all duration-300"
                  style="
                    background: linear-gradient(
                      transparent,
                      rgba(0, 0, 0, 0.7)
                    );
                  "
                >
                  <div flex="~ wrap" gap-2 p-2>
                    <span
                      v-for="styleName in item.hover.text"
                      :key="styleName"
                      bg="white opacity-30"
                      text="white sm"
                      leading-none
                      p="x-2 y-1"
                      rounded="$bew-radius-half"
                      shrink-0
                    >{{ styleName }}</span>
                  </div>
                </div>

                <div
                  group-hover:opacity-0
                  w-full
                  rounded="$bew-radius"
                  aspect="12/16"
                  transition="all duration-300"
                  bg="cover center"
                  :style="{
                    backgroundImage: `url(${item.cover.replace(
                      'http:',
                      '',
                    )}@466w_622h.webp)`,
                  }"
                />

                <!-- image after hovering -->
                <div
                  w-full
                  rounded="$bew-radius"
                  aspect="12/16"
                  transform="~ scale-120 group-hover:scale-100"
                  transition="all duration-1000"
                  bg="cover center"
                  pos="absolute top-0 left-0"
                  z--1
                  :style="{
                    backgroundImage: `url(${item.hover.img.replace(
                      'http:',
                      '',
                    )}@672w_378h_1c.webp)`,
                  }"
                  style="
                    transition-timing-function: cubic-bezier(
                      0.22,
                      0.61,
                      0.36,
                      1
                    );
                  "
                />
              </a>
            </div>

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
          </article>
        </div>
      </section>
    </div>
    <!-- loading -->
    <loading v-if="isLoading && recommendAnimeList.length !== 0" m="-t-4" />
  </div>
</template>

<style lang="scss" scoped></style>
