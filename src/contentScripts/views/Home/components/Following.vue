<script setup lang="ts">
import type { Ref } from 'vue'

import Button from '~/components/Button.vue'
import Empty from '~/components/Empty.vue'
import Loading from '~/components/Loading.vue'
import VideoCard from '~/components/VideoCard/VideoCard.vue'
import VideoCardSkeleton from '~/components/VideoCard/VideoCardSkeleton.vue'
import { useApiClient } from '~/composables/api'
import { useBewlyApp } from '~/composables/useAppProvider'
import type { GridLayout } from '~/logic'
import type { DataItem as MomentItem, MomentResult } from '~/models/moment/moment'

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

const videoList = reactive<MomentItem[]>([])
const isLoading = ref<boolean>(false)
const needToLoginFirst = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const offset = ref<string>('')
const updateBaseline = ref<string>('')
const noMoreContent = ref<boolean>(false)
const { handleReachBottom, handlePageRefresh } = useBewlyApp()

onMounted(async () => {
  initData()
  initPageAction()
})

onActivated(() => {
  initPageAction()
})

function initPageAction() {
  handleReachBottom.value = async () => {
    if (isLoading.value)
      return
    if (noMoreContent.value)
      return

    getData()
  }
  handlePageRefresh.value = async () => {
    if (isLoading.value)
      return

    initData()
  }
}

async function initData() {
  offset.value = ''
  updateBaseline.value = ''
  videoList.length = 0
  noMoreContent.value = false

  await getData()
}

async function getData() {
  for (let i = 0; i < 3; i++)
    await getFollowedUsersVideos()
}

async function getFollowedUsersVideos() {
  if (noMoreContent.value)
    return

  if (offset.value === '0') {
    noMoreContent.value = true
    return
  }

  emit('beforeLoading')
  isLoading.value = true
  try {
    const response: MomentResult = await api.moment.getMoments({
      type: 'video',
      offset: Number(offset.value),
      update_baseline: updateBaseline.value,
    })

    if (response.code === -101) {
      noMoreContent.value = true
      needToLoginFirst.value = true
      return
    }

    if (response.code === 0) {
      offset.value = response.data.offset
      updateBaseline.value = response.data.update_baseline

      const resData = [] as MomentItem[]

      response.data.items.forEach((item: MomentItem) => {
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
    else if (response.code === -101) {
      needToLoginFirst.value = true
    }
  }
  finally {
    isLoading.value = false
    emit('afterLoading')
  }
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}

defineExpose({ initData })
</script>

<template>
  <div>
    <!-- By directly using predefined unocss grid properties, it is possible to dynamically set the grid attribute -->
    <div hidden grid="~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-5" />
    <div hidden grid="~ cols-1 xl:cols-2 gap-4" />
    <div hidden grid="~ cols-1 gap-4" />

    <Empty v-if="needToLoginFirst" mt-6 :description="$t('common.please_log_in_first')">
      <Button type="primary" @click="jumpToLoginPage()">
        {{ $t('common.login') }}
      </Button>
    </Empty>
    <div
      v-else
      ref="containerRef"
      m="b-0 t-0" relative w-full h-full
      :grid="gridValue"
    >
      <VideoCard
        v-for="video in videoList"
        :key="video.modules.module_dynamic.major.archive?.aid"
        :video="{
          id: Number(video.modules.module_dynamic.major.archive?.aid),
          durationStr: video.modules.module_dynamic.major.archive?.duration_text,
          title: `${video.modules.module_dynamic.major.archive?.title}`,
          cover: `${video.modules.module_dynamic.major.archive?.cover}`,
          author: video.modules.module_author.name,
          authorFace: video.modules.module_author.face,
          mid: video.modules.module_author.mid,
          viewStr: video.modules.module_dynamic.major.archive?.stat.play,
          danmakuStr: video.modules.module_dynamic.major.archive?.stat.danmaku,
          capsuleText: video.modules.module_author.pub_time,
          bvid: video.modules.module_dynamic.major.archive?.bvid,
        }"
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

    <!-- no more content -->
    <Empty v-if="noMoreContent && !needToLoginFirst" class="pb-4" :description="$t('common.no_more_content')" />

    <Transition name="fade">
      <Loading v-if="isLoading" />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
</style>
