<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { RankingType, RankingVideoModel } from '../types'
import { settings } from '~/logic'

const { t } = useI18n()

const handleBackToTop = inject('handleBackToTop') as (targetScrollTop: number) => void

const rankingTypes = computed((): RankingType[] => {
  return [
    { name: 'All', rid: 0 },
    { name: t('topbar.logo_dropdown.anime'), seasonType: 1 },
    { name: t('topbar.logo_dropdown.chinese_anime'), seasonType: 4 },
    { name: `${t('topbar.logo_dropdown.chinese_anime')} relative`, rid: 168 },
    { name: t('topbar.logo_dropdown.documentary_films'), seasonType: 3 },
    { name: t('topbar.logo_dropdown.animations'), rid: 1 },
    { name: t('topbar.logo_dropdown.music'), rid: 3 },
    { name: t('topbar.logo_dropdown.dance'), rid: 129 },
    { name: t('topbar.logo_dropdown.gaming'), rid: 4 },
    { name: t('topbar.logo_dropdown.knowledge'), rid: 36 },
    { name: t('topbar.logo_dropdown.technology'), rid: 188 },
    { name: t('topbar.logo_dropdown.sports'), rid: 234 },
    { name: t('topbar.logo_dropdown.cars'), rid: 223 },
    { name: t('topbar.logo_dropdown.life'), rid: 160 },
    { name: t('topbar.logo_dropdown.foods'), rid: 211 },
    { name: t('topbar.logo_dropdown.animals'), rid: 217 },
    { name: t('topbar.logo_dropdown.kichiku'), rid: 119 },
    { name: t('topbar.logo_dropdown.fashion'), rid: 155 },
    { name: t('topbar.logo_dropdown.showbiz'), rid: 5 },
    { name: t('topbar.logo_dropdown.cinephile'), rid: 181 },
    { name: t('topbar.logo_dropdown.movies'), seasonType: 2 },
    { name: t('topbar.logo_dropdown.tv_shows'), seasonType: 5 },
    { name: t('topbar.logo_dropdown.variety_shows'), seasonType: 7 },
    { name: 'Original', rid: 0, type: 'origin' },
    { name: 'Newest Uploader', rid: 0, type: 'rookie' },
  ]
})

const isLoading = ref<boolean>(false)
const activatedRankingType = reactive<RankingType>({ ...rankingTypes.value[0] })
const videoList = reactive<RankingVideoModel[]>([])

watch(() => activatedRankingType.name, () => {
  handleBackToTop(settings.value.useSearchPageModeOnHomePage ? 510 : 0)
  getRankingVideos()
})

onMounted(() => {
  getRankingVideos()
})

function getRankingVideos() {
  videoList.length = 0
  isLoading.value = true
  browser.runtime.sendMessage({
    contentScriptQuery: 'getRankingVideos',
    rid: activatedRankingType.rid,
  }).then((response) => {
    if (response.code === 0) {
      const { list } = response.data
      Object.assign(videoList, list)
    }
  }).finally(() => isLoading.value = false)
}
</script>

<template>
  <div flex="~ gap-40px">
    <aside pos="sticky top-140px" h="[calc(100vh-120px)]" w-200px shrink-0>
      <OverlayScrollbarsComponent h-inherit p-20px m--20px defer>
        <ul flex="~ col gap-2">
          <li v-for="rankingType in rankingTypes" :key="rankingType.name">
            <a
              px-4 lh-30px h-30px hover:bg="$bew-fill-2" w-inherit
              block rounded="$bew-radius" cursor-pointer transition="all 300 ease-out"
              hover:scale-105 un-text="$bew-text-2 hover:$bew-text-1"
              :class="{ active: activatedRankingType.name === rankingType.name }"
              @click="Object.assign(activatedRankingType, rankingType)"
            >{{ rankingType.name }}</a>
          </li>
        </ul>
      </OverlayScrollbarsComponent>
    </aside>

    <main w-full>
      <VideoCard
        v-for="(video, index) in videoList"
        :id="Number(video.aid)"
        :key="video.aid"
        :duration="video.duration"
        :title="video.title"
        :desc="video.desc"
        :cover="video.pic"
        :author="video.owner.name"
        :author-face="video.owner.face"
        :mid="video.owner.mid"
        :view="video.stat.view"
        :danmaku="video.stat.danmaku"
        :published-timestamp="video.pubdate"
        :bvid="video.bvid"
        :rank="index + 1"
        horizontal
        w-full
      />

      <!-- skeleton -->
      <template v-if="isLoading">
        <VideoCardSkeleton v-for="item in 30" :key="item" horizontal />
      </template>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.active {
  --at-apply: scale-110 bg-white text-black shadow-$bew-shadow-2;
}
</style>
