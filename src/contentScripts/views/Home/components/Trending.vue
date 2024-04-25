<script setup lang="ts">
import type { Ref } from 'vue'
import type { GridLayout } from '~/logic'
import type { TrendingResult, List as VideoItem } from '~/models/video/trending'

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
const videoList = reactive<VideoItem[]>([])
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
  videoList.length = 0
  pn.value = 1
  await getData()
}

async function getData() {
  await getTrendingVideos()
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

  emit('beforeLoading')
  isLoading.value = true
  try {
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
    emit('afterLoading')
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
        :horizontal="gridLayout !== 'adaptive'"
      />

      <!-- skeleton -->
      <template v-if="isLoading">
        <VideoCardSkeleton
          v-for="item in 30" :key="item"
          :horizontal="gridLayout !== 'adaptive'"
        />
      </template>
    </div>

    <Transition name="fade">
      <Loading v-if="isLoading" />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
</style>
