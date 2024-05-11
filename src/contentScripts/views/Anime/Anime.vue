<script setup lang="ts">
import Button from '~/components/Button.vue'
import Empty from '~/components/Empty.vue'
import HorizontalScrollView from '~/components/HorizontalScrollView.vue'
import LongCoverCard from '~/components/LongCoverCard/LongCoverCard.vue'
import LongCoverCardSkeleton from '~/components/LongCoverCard/LongCoverCardSkeleton.vue'
import { useApiClient } from '~/composables/api'
import { useBewlyApp } from '~/composables/useAppProvider'
import type { List as PopularAnimeItem, PopularAnimeResult } from '~/models/anime/popular'
import type { ItemSubItem as RecommendationItem, RecommendationResult } from '~/models/anime/recommendation'
import type { List as WatchListItem, WatchListResult } from '~/models/anime/watchList'
import { numFormatter } from '~/utils/dataFormatter'
import { getUserID, openLinkToNewTab } from '~/utils/main'

import AnimeTimeTable from './components/AnimeTimeTable.vue'

const api = useApiClient()
const animeWatchList = reactive<WatchListItem[]>([])
const recommendAnimeList = reactive<RecommendationItem[]>([])
const popularAnimeList = reactive<PopularAnimeItem[]>([])
const cursor = ref<number>(0)
const isLoadingAnimeWatchList = ref<boolean>()
const isLoadingPopularAnime = ref<boolean>()
const isLoadingRecommendAnime = ref<boolean>()
const activatedSeasonId = ref<number>()
const noMoreContent = ref<boolean>()
const animeTimeTableRef = ref()
const { handleReachBottom, handlePageRefresh } = useBewlyApp()

const isLoading = computed(() => {
  return isLoadingAnimeWatchList.value || isLoadingPopularAnime.value || isLoadingRecommendAnime.value
})

onMounted(() => {
  getAnimeWatchList()
  getPopularAnimeList()
  getRecommendAnimeList()

  initPageAction()
})

function initPageAction() {
  handleReachBottom.value = () => {
    if (isLoadingRecommendAnime.value)
      return
    if (noMoreContent.value)
      return

    getRecommendAnimeList()
  }
  handlePageRefresh.value = () => {
    if (isLoading.value)
      return

    animeWatchList.length = 0
    recommendAnimeList.length = 0
    popularAnimeList.length = 0
    cursor.value = 0
    noMoreContent.value = false

    getAnimeWatchList()
    getPopularAnimeList()
    getRecommendAnimeList()
    animeTimeTableRef.value?.refreshAnimeTimeTable()
  }
}

function getAnimeWatchList() {
  isLoadingAnimeWatchList.value = true
  api.anime.getAnimeWatchList({
    vmid: getUserID() ?? 0,
    pn: 1,
    ps: 30,
  })
    .then((response: WatchListResult) => {
      const {
        code,
        data: { list },
      } = response
      if (code === 0)
        Object.assign(animeWatchList, list as WatchListItem[])
    })
    .catch(() => Object.assign(animeWatchList, []))
    .finally(() => {
      isLoadingAnimeWatchList.value = false
    })
}

function getRecommendAnimeList() {
  isLoadingRecommendAnime.value = true
  api.anime.getRecommendAnimeList({
    coursor: cursor.value,
  })
    .then((response: RecommendationResult) => {
      const {
        code,
        data: { items, coursor, has_next },
      } = response
      if (code === 0 && has_next) {
        if (recommendAnimeList.length === 0)
          Object.assign(recommendAnimeList, items[0].sub_items as RecommendationItem[])
        else
          recommendAnimeList.push(...items[0].sub_items)

        cursor.value = coursor
      }
      if (code === 0 && !has_next)
        noMoreContent.value = true
    })
    .finally(() => {
      isLoadingRecommendAnime.value = false
    })
}

function getPopularAnimeList() {
  isLoadingPopularAnime.value = true
  api.anime.getPopularAnimeList()
    .then((response: PopularAnimeResult) => {
      const {
        code,
        result: { list },
      } = response
      if (code === 0)
        Object.assign(popularAnimeList, list as PopularAnimeItem[])
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
      <section v-if="getUserID()" class="anime-section">
        <div flex justify-between items-center mb-6>
          <h3 text="3xl $bew-text-1" font="bold">
            {{ $t('anime.your_watch_list') }}
          </h3>
          <Button
            size="large"
            style="
              --b-button-shadow: var(--bew-shadow-1);
            "
            @click="openLinkToNewTab(`https://space.bilibili.com/${getUserID() ?? 0}/bangumi`)"
          >
            {{ $t('common.view_all') }}
          </Button>
        </div>

        <HorizontalScrollView w="[calc(100%+1.5rem)]">
          <div w-full flex>
            <template v-if="isLoadingAnimeWatchList">
              <LongCoverCardSkeleton
                v-for="item in 6" :key="item"
                w="2xl:[calc(100%/6-1.5rem)] xl:[calc(100%/5-1.5rem)] lg:[calc(100%/4-1.5rem)] md:[calc(100%/3-1.5rem)] sm:[calc(100%/2-1.5rem)] [calc(100%-1.5rem)]"
                last:w="2xl:1/6 xl:1/5 lg:1/4 md:1/3 sm:1/2 full"
                shrink-0
                m="r-6"
                last:pr-6
              />
            </template>
            <LongCoverCard
              v-for="item in animeWatchList"
              :key="item.short_url"
              :url="item.url"
              :cover="item.cover"
              :title="item.title"
              :capsule-text="item.is_finish
                ? $t('anime.total_episodes', { ep: item.total_count })
                : $t('anime.update_to_n_episodes', {
                  ep: item.formal_ep_count,
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
      <section class="anime-section">
        <div flex justify-between items-center mb-6>
          <h3 text="3xl $bew-text-1" font="bold">
            {{ $t('anime.popular_anime') }}
          </h3>
          <Button
            size="large"
            style="
              --b-button-shadow: var(--bew-shadow-1);
            "
            @click="openLinkToNewTab(`https://www.bilibili.com/v/popular/rank/bangumi`)"
          >
            {{ $t('common.view_all') }}
          </Button>
        </div>

        <HorizontalScrollView w="[calc(100%+1.5rem)]">
          <div w-full flex>
            <template v-if="isLoadingPopularAnime">
              <LongCoverCardSkeleton
                v-for="item in 6" :key="item"
                w="2xl:[calc(100%/6-1.5rem)] xl:[calc(100%/5-1.5rem)] lg:[calc(100%/4-1.5rem)] md:[calc(100%/3-1.5rem)] sm:[calc(100%/2-1.5rem)] [calc(100%-1.5rem)]"
                last:w="2xl:1/6 xl:1/5 lg:1/4 md:1/3 sm:1/2 full"
                shrink-0
                m="r-6"
                last:pr-6
              />
            </template>
            <LongCoverCard
              v-for="item in popularAnimeList"
              :key="item.url"
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
      <section class="anime-section">
        <div flex justify-between items-end>
          <h3 text="3xl $bew-text-1" font="bold">
            {{ $t('anime.anime_timetable.title') }}
          </h3>
        </div>

        <AnimeTimeTable ref="animeTimeTableRef" w="[calc(100%+1.5rem)]" />
      </section>

      <!-- Recommended for you -->
      <section class="anime-section">
        <h3 text="3xl $bew-text-1" font="bold" mb-6>
          {{ $t('anime.recommended_for_you') }}
        </h3>
        <div grid="~ 2xl:cols-6 xl:cols-5 lg:cols-4 md:cols-3 sm:cols-2 cols-1 gap-6">
          <LongCoverCard
            v-for="item in recommendAnimeList"
            :key="item.episode_id"
            :url="item.link ?? ''"
            :cover="item.cover"
            :cover-hover="item?.hover?.img"
            :tags="item?.hover?.text"
            :title="item.title"
            :desc="item.sub_title"
            :capsule-text="item.rating"
            mb-10
            @mouseenter="activatedSeasonId = item.season_id"
            @mouseleave="activatedSeasonId = 0"
          />

          <template v-if="isLoadingRecommendAnime">
            <LongCoverCardSkeleton
              v-for="item in 30" :key="item"
              mb-10
            />
          </template>
        </div>
      </section>
    </div>

    <!-- no more content -->
    <Empty v-if="noMoreContent" class="pb-4" :description="$t('common.no_more_content')" />

    <!-- loading -->
    <loading v-if="isLoadingRecommendAnime && recommendAnimeList.length !== 0" m="-t-4" />
  </div>
</template>

<style lang="scss" scoped>
.anime-section {
  --at-apply: mb-8 mt-14 first:mt-0;
}
</style>
