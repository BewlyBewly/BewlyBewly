<script setup lang="ts">
// import PopularAnimeCarousel from './components/PopularAnimeCarousel.vue'
import AnimeTimeTable from './components/AnimeTimeTable.vue'
import AnimeCard from './components/AnimeCard.vue'
import AnimeCardSkeleton from './components/AnimeCardSkeleton.vue'
import type { AnimeItem, PopularAnime } from './types'
import { getUserID, openLinkToNewTab } from '~/utils/main'
import { numFormatter } from '~/utils/dataFormatter'
import emitter from '~/utils/mitt'

const animeWatchList = reactive<AnimeItem[]>([])
const recommendAnimeList = reactive<AnimeItem[]>([])
const popularAnimeList = reactive<AnimeItem[]>([])
const cursor = ref<number>(0)
const isLoadingAnimeWatchList = ref<boolean>()
const isLoadingPopularAnime = ref<boolean>()
const isLoadingRecommendAnime = ref<boolean>()
const activatedSeasonId = ref<number>()

onMounted(() => {
  getAnimeWatchList()
  getPopularAnimeList()
  getRecommendAnimeList()

  emitter.off('reachBottom')
  emitter.on('reachBottom', () => {
    if (!isLoadingRecommendAnime.value)
      getRecommendAnimeList()
  })
})

onUnmounted(() => {
  emitter.off('reachBottom')
})

function getAnimeWatchList() {
  isLoadingAnimeWatchList.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getAnimeWatchList',
      vmid: getUserID() ?? 0,
      pn: 1,
      ps: 30,
    })
    .then((response) => {
      const {
        code,
        data: { list },
      } = response
      if (code === 0)
        Object.assign(animeWatchList, list as AnimeItem[])
    })
    .catch(() => Object.assign(animeWatchList, []))
    .finally(() => {
      isLoadingAnimeWatchList.value = false
    })
}

function getRecommendAnimeList() {
  isLoadingRecommendAnime.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getRecommendAnimeList',
      coursor: cursor.value,
    })
    .then((response) => {
      const {
        code,
        data: { items, coursor, has_next },
      } = response
      if (code === 0 && has_next) {
        if (recommendAnimeList.length === 0)
          Object.assign(recommendAnimeList, items[0].sub_items as AnimeItem[])
        else recommendAnimeList.push(...items[0].sub_items)

        cursor.value = coursor
      }
    })
    .finally(() => {
      isLoadingRecommendAnime.value = false
    })
}

function getPopularAnimeList() {
  isLoadingPopularAnime.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getPopularAnimeList',
    })
    .then((response) => {
      const {
        code,
        result: { list },
      } = response
      if (code === 0)
        Object.assign(popularAnimeList, list as PopularAnime[])
    })
    .catch(() => {})
    .finally(() => isLoadingPopularAnime.value = false)
}
</script>

<template>
  <div>
    <div>
      <!-- <section mb-8>
        <PopularAnimeCarousel />
      </section> -->

      <!-- Your Watchlist -->
      <section v-if="getUserID()" mb-8 mt-4>
        <div flex justify-between items-center mb-6>
          <h3 text="3xl $bew-text-1" font="bold">
            {{ $t('anime.your_watch_list') }}
          </h3>
          <Button
            size="small"
            shadow="$bew-shadow-1"
            @click="openLinkToNewTab(`https://space.bilibili.com/${getUserID() ?? 0}/bangumi`)"
          >
            {{ $t('common.view_all') }}
          </Button>
        </div>

        <HorizontalScrollView w="[calc(100%+1.5rem)]">
          <div w-full flex>
            <template v-if="isLoadingAnimeWatchList">
              <AnimeCardSkeleton
                v-for="item in 6" :key="item"
                w="2xl:[calc(100%/6-1.5rem)] xl:[calc(100%/5-1.5rem)] lg:[calc(100%/4-1.5rem)] md:[calc(100%/3-1.5rem)] sm:[calc(100%/2-1.5rem)] [calc(100%-1.5rem)]"
                last:w="2xl:1/6 xl:1/5 lg:1/4 md:1/3 sm:1/2 full"
                shrink-0
                m="r-6"
                last:pr-6
              />
            </template>
            <AnimeCard
              v-for="item in animeWatchList"
              :key="item.episode_id"
              :url="item.url"
              :cover="item.cover"
              :title="item.title"
              :capsule-text="item.is_finish
                ? $t('anime.total_episodes', { ep: item.total_count })
                : $t('anime.update_to_n_episodes', {
                  ep: item.total_count,
                })"
              :desc="item.progress !== '' ? item.progress : $t('anime.havent_seen')"
              w="2xl:[calc(100%/6-1.5rem)] xl:[calc(100%/5-1.5rem)] lg:[calc(100%/4-1.5rem)] md:[calc(100%/3-1.5rem)] sm:[calc(100%/2-1.5rem)] [calc(100%-1.5rem)]"
              last:w="2xl:1/6 xl:1/5 lg:1/4 md:1/3 sm:1/2 full"
              shrink-0
              m="r-6"
              last:pr-6
            />
          </div>
        </HorizontalScrollView>
      </section>

      <!-- Popular Anime -->
      <section mb-8>
        <div flex justify-between items-center mb-6>
          <h3 text="3xl $bew-text-1" font="bold">
            {{ $t('anime.popular_anime') }}
          </h3>
          <Button
            size="small"
            shadow="$bew-shadow-1"
            @click="openLinkToNewTab(`https://www.bilibili.com/v/popular/rank/bangumi`)"
          >
            {{ $t('common.view_all') }}
          </Button>
        </div>

        <HorizontalScrollView w="[calc(100%+1.5rem)]">
          <div w-full flex>
            <template v-if="isLoadingPopularAnime">
              <AnimeCardSkeleton
                v-for="item in 6" :key="item"
                w="2xl:[calc(100%/6-1.5rem)] xl:[calc(100%/5-1.5rem)] lg:[calc(100%/4-1.5rem)] md:[calc(100%/3-1.5rem)] sm:[calc(100%/2-1.5rem)] [calc(100%-1.5rem)]"
                last:w="2xl:1/6 xl:1/5 lg:1/4 md:1/3 sm:1/2 full"
                shrink-0
                m="r-6"
                last:pr-6
              />
            </template>
            <AnimeCard
              v-for="item in popularAnimeList"
              :key="item.episode_id"
              w="2xl:[calc(100%/6-1.5rem)] xl:[calc(100%/5-1.5rem)] lg:[calc(100%/4-1.5rem)] md:[calc(100%/3-1.5rem)] sm:[calc(100%/2-1.5rem)] [calc(100%-1.5rem)]"
              last:w="2xl:1/6 xl:1/5 lg:1/4 md:1/3 sm:1/2 full"
              shrink-0
              m="r-6"
              last:pr-6
              :url="item.url"
              :cover="item.cover"
              :title="item.title"
              :desc="$t('anime.follow', { num: numFormatter(item.stat.series_follow) })"
              :capsule-text="item.rating.replace('分', '')"
              :rank="item.rank"
            />
          </div>
        </HorizontalScrollView>
      </section>

      <!-- Anime Timetable -->
      <section mb-8>
        <div flex justify-between items-end mb-6>
          <h3 text="3xl $bew-text-1" font="bold">
            {{ $t('anime.anime_timetable.title') }}
          </h3>
        </div>

        <AnimeTimeTable />
      </section>

      <!-- Recommended for you -->
      <section>
        <h3 text="3xl $bew-text-1" font="bold" mb-6>
          {{ $t('anime.recommended_for_you') }}
        </h3>
        <div grid="~ 2xl:cols-6 xl:cols-5 lg:cols-4 md:cols-3 sm:cols-2 cols-1 gap-6">
          <AnimeCard
            v-for="item in recommendAnimeList"
            :key="item.episode_id"
            :url="item.link"
            :cover="item.cover"
            :cover-hover="item.hover.img"
            :tags="item.hover.text"
            :title="item.title"
            :desc="item.sub_title"
            :capsule-text="item.rating"
            @mouseenter="activatedSeasonId = item.season_id"
            @mouseleave="activatedSeasonId = 0"
          />

          <template v-if="isLoadingRecommendAnime">
            <AnimeCardSkeleton
              v-for="item in 30" :key="item"
            />
          </template>
        </div>
      </section>
    </div>
    <!-- loading -->
    <loading v-if="isLoadingRecommendAnime && recommendAnimeList.length !== 0" m="-t-4" />
  </div>
</template>

<style lang="scss" scoped></style>
