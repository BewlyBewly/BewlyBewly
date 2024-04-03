<script setup lang="ts">
import type { Ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { Type as ThreePointV2Type } from '~/models/video/appForYou'
import type { AppForYouResult, Item as AppVideoItem, ThreePointV2 } from '~/models/video/appForYou'
import type { Item as VideoItem, forYouResult } from '~/models/video/forYou'
import type { GridLayout } from '~/logic'
import { accessKey, settings } from '~/logic'
import { LanguageType } from '~/enums/appEnums'
import { TVAppKey } from '~/utils/authProvider'

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

const videoList = reactive<VideoItem[]>([])
const appVideoList = reactive<AppVideoItem[]>([])
const isLoading = ref<boolean>(true)
const needToLoginFirst = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const refreshIdx = ref<number>(1)
const noMoreContent = ref<boolean>(false)
const { handleReachBottom, handlePageRefresh, scrollbarRef } = useBewlyApp()
const showVideoOptions = ref<boolean>(false)
const videoOptions = ref<ThreePointV2[] | undefined>([])
const videoOptionsPosition = reactive<{ top: string, left: string }>({ top: '0', left: '0' })
// const activatedVideoId = ref<number>(0)
const activatedVideo = ref<AppVideoItem | null>()
const videoCardRef = ref(null)
const dislikedVideoIds = ref<number[]>([])

watch(() => settings.value.recommendationMode, () => {
  initData()
})

onMounted(async () => {
  // Delay by 0.2 seconds to obtain the `settings.value.recommendationMode` value
  // otherwise the `settings.value.recommendationMode` value will be undefined
  // i have no idea to fix that...
  setTimeout(async () => {
    initData()
  }, 200)

  initPageAction()
})

onActivated(() => {
  initPageAction()
})

async function initData() {
  videoList.length = 0
  appVideoList.length = 0
  await getData()
}

async function getData() {
  if (settings.value.recommendationMode === 'web') {
    getRecommendVideos()
  }
  else {
    for (let i = 0; i < 3; i++)
      await getAppRecommendVideos()
  }
}

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

async function getRecommendVideos() {
  emit('beforeLoading')
  isLoading.value = true
  try {
    const response: forYouResult = await browser.runtime.sendMessage({
      contentScriptQuery: 'getRecommendVideos',
      refreshIdx: refreshIdx.value++,
    })

    if (!response.data) {
      noMoreContent.value = true
      return
    }

    if (response.code === 0) {
      const resData = [] as VideoItem[]

      response.data.item.forEach((item: VideoItem) => {
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
    else if (response.code === 62011) {
      needToLoginFirst.value = true
    }
  }
  finally {
    isLoading.value = false
    emit('afterLoading')
  }
}

async function getAppRecommendVideos() {
  emit('beforeLoading')
  isLoading.value = true
  try {
    const response: AppForYouResult = await browser.runtime.sendMessage({
      contentScriptQuery: 'getAppRecommendVideos',
      accessKey: accessKey.value,
      sLocale: settings.value.language !== LanguageType.Mandarin_CN ? 'zh-Hant_TW' : 'zh-Hans_CN',
      cLocale: settings.value.language !== LanguageType.Mandarin_CN ? 'zh-Hant_TW' : 'zh-Hans_CN',
      appkey: TVAppKey.appkey,
      idx: appVideoList.length > 0 ? appVideoList[appVideoList.length - 1].idx : 1,
    })

    if (response.code === 0) {
      const resData = [] as AppVideoItem[]

      response.data.items.forEach((item: AppVideoItem) => {
        // Remove banner & ad cards
        if (!item.card_type.includes('banner') && item.card_type !== 'cm_v1')
          resData.push(item)
      })

      // when videoList has length property, it means it is the first time to load
      if (!appVideoList.length) {
        Object.assign(appVideoList, resData)
      }
      else {
        // else we concat the new data to the old data
        Object.assign(appVideoList, appVideoList.concat(resData))
      }
    }
    else if (response.code === 62011) {
      needToLoginFirst.value = true
    }
  }
  finally {
    isLoading.value = false
    emit('afterLoading')
  }
}

function handleMoreClick(e: MouseEvent, data: AppVideoItem) {
  if (activatedVideo.value && activatedVideo.value?.idx === data.idx) {
    closeVideoOptions()
    return
  }

  showVideoOptions.value = true
  activatedVideo.value = data
  const osInstance = scrollbarRef.value?.osInstance()
  const scrollTop = osInstance.elements().viewport.scrollTop || 0
  videoOptions.value = data.three_point_v2
  videoOptionsPosition.top = `${e.clientY + scrollTop}px`
  videoOptionsPosition.left = `${e.clientX}px`
}

function handleMoreCommand(command: ThreePointV2Type) {
  if (activatedVideo.value)
    dislikedVideoIds.value.push(activatedVideo.value.idx)

  switch (command) {
    case ThreePointV2Type.Feedback:
      break
    case ThreePointV2Type.Dislike:
      dislikedVideoIds.value.push(activatedVideo.value!.idx)
      closeVideoOptions()
      break
  }

  // if (command === 'close')
  //   closeVideoOptions()
}

function closeVideoOptions() {
  showVideoOptions.value = false
  activatedVideo.value = null
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

    <!-- dislike popup -->
    <div v-show="showVideoOptions">
      <div
        pos="fixed top-0 left-0" w-full h-full z-1
        @click="closeVideoOptions"
      />
      <div
        style="backdrop-filter: var(--bew-filter-glass-1);"
        :style="{ transform: `translate(${videoOptionsPosition.left}, ${videoOptionsPosition.top})` }"
        p-2 bg="$bew-elevated-1" rounded="$bew-radius" pos="absolute top-0 left-0"
        w-150px m="t-4 l-[calc(-150px+1rem)]"
        shadow="$bew-shadow-1" z-10
      >
        <ul flex="~ col gap-1">
          <template v-for="option in videoOptions" :key="option.type">
            <li
              v-if="option.type !== ThreePointV2Type.WatchLater"
              bg="hover:$bew-fill-2" p="x-4 y-2" rounded="$bew-radius-half" cursor-pointer
              @click="handleMoreCommand(option.type)"
            >
              {{ option.title }}
            </li>
          </template>
        </ul>
      </div>
    </div>

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
      <template v-if="settings.recommendationMode === 'web'">
        <VideoCard
          v-for="video in videoList"
          :id="video.id"
          :key="video.id"
          :duration="video.duration"
          :title="video.title"
          :cover="video.pic"
          :author="video.owner.name"
          :author-face="video.owner.face"
          :mid="video.owner.mid"
          :view="video.stat.view"
          :danmaku="video.stat.danmaku"
          :published-timestamp="video.pubdate"
          :bvid="video.bvid"
          :cid="video.cid"
          :uri="video.uri"
          show-preview
          :horizontal="gridLayout !== 'adaptive'"
        />
      </template>
      <template v-else>
        <VideoCard
          v-for="video in appVideoList"
          :id="video.args.aid ?? 0"
          ref="videoCardRef"
          :key="video.args.aid"
          :duration-str="video.cover_right_text"
          :title="`${video.title}`"
          :cover="`${video.cover}`"
          :author="video?.mask?.avatar.text"
          :author-face="video?.mask?.avatar.cover"
          :mid="video?.mask?.avatar.up_id "
          :capsule-text="video?.desc?.split('·')[1]"
          :bvid="video.bvid"
          :view-str="video.cover_left_text_1"
          :danmaku-str="video.cover_left_text_2"
          :cid="video?.player_args?.cid"
          :uri="video.uri"
          show-preview
          :horizontal="gridLayout !== 'adaptive'"
          more-btn
          :more-btn-active="video.idx === activatedVideo?.idx"
          :show-dislike-options="dislikedVideoIds.includes(video.idx)"
          :dislike-reasons="video.three_point_v2?.find(option => option.type === ThreePointV2Type.Dislike)?.reasons || []"
          @more-click="(e) => handleMoreClick(e, video)"
        />
        <!-- :more-options="video.three_point_v2" -->
      </template>

      <!-- skeleton -->
      <template v-if="isLoading">
        <VideoCardSkeleton
          v-for="item in 30" :key="item"
          :horizontal="gridLayout !== 'adaptive'"
        />
      </template>
    </div>

    <!-- no more content -->
    <Empty v-if="noMoreContent" class="pb-4" :description="$t('common.no_more_content')" />

    <Transition name="fade">
      <Loading v-if="isLoading" />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
</style>
