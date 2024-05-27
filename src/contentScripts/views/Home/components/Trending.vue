<script setup lang="ts">
import type { Ref } from 'vue'

import VideoCard from '~/components/VideoCard/VideoCard.vue'
import { useApiClient } from '~/composables/api'
import { useBewlyApp } from '~/composables/useAppProvider'
import type { GridLayout } from '~/logic'
import type { List as VideoItem, TrendingResult } from '~/models/video/trending'

// https://github.com/starknt/BewlyBewly/blob/fad999c2e482095dc3840bb291af53d15ff44130/src/contentScripts/views/Home/components/ForYou.vue#L16
interface VideoElement {
  uniqueId: string
  item?: VideoItem
}

const props = defineProps<{
  gridLayout: GridLayout
}>()

const emit = defineEmits<{
  (e: 'beforeLoading'): void
  (e: 'afterLoading'): void
}>()

const gridValue = computed((): string => {
  if (props.gridLayout === 'adaptive')
    return '~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-5'
  if (props.gridLayout === 'twoColumns')
    return '~ cols-1 xl:cols-2 gap-4'
  return '~ cols-1 gap-4'
})
const api = useApiClient()
const videoList = ref<VideoElement[]>([])
const isLoading = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const pn = ref<number>(1)
const noMoreContent = ref<boolean>(false)
const { handleReachBottom, handlePageRefresh } = useBewlyApp()

onMounted(async () => {
  await initData()
  initPageAction()
})

onActivated(() => {
  initPageAction()
})

async function initData() {
  noMoreContent.value = false
  videoList.value.length = 0
  pn.value = 1
  await getData()
}

async function getData() {
  emit('beforeLoading')
  isLoading.value = true
  try {
    await getTrendingVideos()
  }
  finally {
    isLoading.value = false
    emit('afterLoading')
  }
}

function initPageAction() {
  handleReachBottom.value = async () => {
    if (!isLoading.value)
      await getData()
  }

  handlePageRefresh.value = async () => {
    initData()
  }
}

async function getTrendingVideos() {
  if (noMoreContent.value)
    return

  try {
    let i = 0
    // https://github.com/starknt/BewlyBewly/blob/fad999c2e482095dc3840bb291af53d15ff44130/src/contentScripts/views/Home/components/ForYou.vue#L208
    const pendingVideos: VideoElement[] = Array.from({ length: 30 }, () => ({
      uniqueId: `unique-id-${(videoList.value.length || 0) + i++})}`,
    } satisfies VideoElement))
    let lastVideoListLength = videoList.value.length
    videoList.value.push(...pendingVideos)

    const response: TrendingResult = await api.video.getPopularVideos({
      pn: pn.value++,
      ps: 30,
    })

    if (response.code === 0) {
      noMoreContent.value = response.data.no_more

      const resData = [] as VideoItem[]

      response.data.list.forEach((item: VideoItem) => {
        resData.push(item)
      })

      // when videoList has length property, it means it is the first time to load
      if (!videoList.value.length) {
        videoList.value = resData.map(item => ({ uniqueId: `${item.aid}`, item }))
      }
      else {
        resData.forEach((item) => {
          videoList.value[lastVideoListLength++] = {
            uniqueId: `${item.aid}`,
            item,
          }
        })
      }
    }
  }
  finally {
    videoList.value = videoList.value.filter(video => video.item)
  }
}

defineExpose({ initData })
</script>

<template>
  <div>
    <!-- By directly using predefined unocss grid properties, it is possible to dynamically set the grid attribute -->
    <div hidden grid="~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-5" />
    <div hidden grid="~ cols-1 xl:cols-2 gap-4" />
    <div hidden grid="~ cols-1 gap-4" />

    <div
      ref="containerRef"
      m="b-0 t-0" relative w-full h-full
      :grid="gridValue"
    >
      <VideoCard
        v-for="video in videoList"
        :key="video.uniqueId"
        :skeleton="!video.item"
        :video="video.item ? {
          id: Number(video.item.aid),
          duration: video.item.duration,
          title: video.item.title,
          desc: video.item.desc,
          cover: video.item.pic,
          author: video.item.owner.name,
          authorFace: video.item.owner.face,
          mid: video.item.owner.mid,
          view: video.item.stat.view,
          danmaku: video.item.stat.danmaku,
          publishedTimestamp: video.item.pubdate,
          bvid: video.item.bvid,
          tag: video.item.rcmd_reason.content,
          cid: video.item.cid,
        } : undefined"
        show-preview
        :horizontal="gridLayout !== 'adaptive'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
