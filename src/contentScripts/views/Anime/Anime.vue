<script setup lang="ts">
// import PopularAnimeCarousel from './components/PopularAnimeCarousel.vue'
import AnimeTimeTable from './components/AnimeTimeTable.vue'
import type { AnimeItem, PopularAnime } from './types'
import { getUserID, numFormatter, removeHttpFromUrl } from '~/utils'
import { LanguageType } from '~/enums/appEnums'
import { language } from '~/logic'

const animeWatchList = reactive<AnimeItem[]>([])
const recommendAnimeList = reactive<AnimeItem[]>([])
const popularAnimeList = reactive<AnimeItem[]>([])
const coursor = ref<number>(29) // 遊標默認必須要非0，否則第一次會出現同樣的結果
const isLoading = ref<boolean>()
const activatedSeasonId = ref<number>()

onMounted(() => {
  getAnimeWatchList()
  getPopularAnimeList()
  getRecommendAnimeList()

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
    .finally(() => {
      isLoading.value = false
    })
}

function getRecommendAnimeList() {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getRecommendAnimeList',
      coursor: coursor.value,
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

        coursor.value = coursor
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

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
      if (code === 0)
        Object.assign(popularAnimeList, list as PopularAnime[])
    })
}
</script>

<template>
  <div>
    <div>
      <!-- <section mb-8>
        <PopularAnimeCarousel />
      </section> -->

      <!-- Your Watchlist -->
      <section mb-8>
        <div flex justify-between items-end mb-6>
          <h3 text="3xl $bew-text-1" font="bold">
            {{ $t('anime.your_watch_list') }}
          </h3>
          <a
            :href="`https://space.bilibili.com/${getUserID() ?? 0}/bangumi`"
            target="_blank"
          >{{ $t('common.view_all') }}</a>
        </div>

        <HorizontalScrollView w="[calc(100%+1.5rem)]">
          <div w-full flex>
            <article
              v-for="item in animeWatchList"
              :key="item.episode_id"
              w="2xl:[calc(100%/6-1.5rem)] xl:[calc(100%/5-1.5rem)] lg:[calc(100%/4-1.5rem)] md:[calc(100%/3-1.5rem)] [calc(100%/2-1.5rem)]"
              last:w="2xl:1/6 xl:1/5 lg:1/4 md:1/3 1/2"
              shrink-0
              m="r-6"
              last:pr-6
            >
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
                  :src="`${removeHttpFromUrl(item.cover)}@466w_622h.webp`"
                  :alt="item.title"
                  rounded="$bew-radius"
                >
              </a>
              <p un-text="lg" my-4>
                <a
                  :href="item.url"
                  target="_blank"
                  class="keep-two-lines"
                  :title="item.title"
                >
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
                  lh-loose
                >{{
                  item.is_finish
                    ? $t('anime.total_episodes', { ep: item.total_count })
                    : $t('anime.update_to_n_episodes', {
                      ep: item.total_count,
                    })
                }}</span>
                {{
                  item.progress !== '' ? item.progress : $t('anime.havent_seen')
                }}
              </p>
            </article>
          </div>
        </HorizontalScrollView>
      </section>

      <!-- Popular Anime -->
      <section mb-8>
        <div flex justify-between items-end mb-6>
          <h3 text="3xl $bew-text-1" font="bold">
            {{ $t('anime.popular_anime') }}
          </h3>
          <a
            href="https://www.bilibili.com/v/popular/rank/bangumi"
            target="_blank"
            un-text="$bew-theme-color"
          >{{ $t('common.view_all') }}</a>
        </div>

        <HorizontalScrollView w="[calc(100%+1.5rem)]">
          <div w-full flex>
            <article
              v-for="item in popularAnimeList"
              :key="item.episode_id"
              w="2xl:[calc(100%/6-1.5rem)] xl:[calc(100%/5-1.5rem)] lg:[calc(100%/4-1.5rem)] md:[calc(100%/3-1.5rem)] [calc(100%/2-1.5rem)]"
              last:w="2xl:1/6 xl:1/5 lg:1/4 md:1/3 1/2"
              shrink-0
              m="r-6"
              last:pr-6
            >
              <a
                rounded="$bew-radius"
                aspect="12/16"
                mb-4
                bg="$bew-fill-3"
                :href="item.url"
                target="_blank"
                relative
              >
                <div
                  w-full
                  pos="absolute bottom-0"
                  text="white 7xl shadow-xl"
                  px-2
                  fw-bold
                  h-150px
                  flex
                  items-end
                  bg="gradient-to-b gradient-from-transparent gradient-to-[rgba(0,0,0,.6)]"
                  rounded-b="$bew-radius"
                >
                  {{ item.rank }}
                </div>
                <img
                  :src="`${removeHttpFromUrl(item.cover)}@466w_622h.webp`"
                  :alt="item.title"
                  rounded="$bew-radius"
                >
              </a>
              <p un-text="lg" my-4>
                <a
                  :href="item.url"
                  target="_blank"
                  class="keep-two-lines"
                  :title="item.title"
                >
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
                  lh-loose
                >{{ item.rating.replace('分', '') }}
                </span>
                {{
                  $t('anime.follow', {
                    num: numFormatter(item.stat.series_follow),
                  })
                }}
              </p>
            </article>
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
                  h-180px
                  flex
                  items-end
                  z-1
                  opacity="0 group-hover:100"
                  transform="~ translate-y-4 group-hover:translate-y-0"
                  transition="all duration-300"
                  style="
                    background: linear-gradient(
                      transparent,
                      rgba(0, 0, 0, 0.6)
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
                    backgroundImage: `url(${removeHttpFromUrl(
                      item.cover,
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
                    backgroundImage: `url(${removeHttpFromUrl(
                      item.hover.img,
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
              <a :href="item.link" target="_blank" class="keep-two-lines">
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
