<script setup lang="ts">
import type { Ref } from 'vue'
import type { TrendingResult, List as VideoItem } from '~/models/video/trending'

const videoList = reactive<VideoItem[]>([])
const isLoading = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const pn = ref<number>(1)
const { handleReachBottom, handlePageRefresh } = useBewlyApp()

function initPageAction() {
  handleReachBottom.value = async () => {
    if (!isLoading.value)
      await getTrendingVideos()
  }

  handlePageRefresh.value = async () => {
    videoList.length = 0
    pn.value = 1
    await getTrendingVideos()
  }
}

onMounted(async () => {
  await getTrendingVideos()

  initPageAction()
})

onActivated(() => {
  initPageAction()
})

async function getTrendingVideos() {
  isLoading.value = true
  try {
    const response: TrendingResult = await browser.runtime.sendMessage({
      contentScriptQuery: 'getPopularVideos',
      pn: pn.value++,
      ps: 30,
    })

    if (response.code === 0 && !response.data.no_more) {
      const resData = [] as VideoItem[]

      response.data.list.forEach((item: VideoItem) => {
        resData.push(item)
      })

      // when videoList has length property, it means it is the first time to load
      if (!videoList.length) {
        Object.assign(videoList, resData)
      }
      else {
        // else we concat the new data to the old data
        Object.assign(videoList, videoList.concat(resData))
      }
    }
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <div
      ref="containerRef"
      m="b-0 t-0" relative w-full h-full
      grid="~ cols-1 xl:cols-2 gap-4"
    >
      <VideoCard
        v-for="video in videoList"
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
        :tag="video.rcmd_reason.content"
        :cid="video.cid"
        show-preview
        horizontal
        w-full
      />

      <!-- skeleton -->
      <template v-if="isLoading">
        <VideoCardSkeleton v-for="item in 30" :key="item" horizontal />
      </template>
    </div>

    <Transition name="fade">
      <Loading v-if="isLoading" />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
</style>
