<script setup lang="ts">
import type { Ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import { Type as ThreePointV2Type } from '~/models/video/appForYou'
import type { AppForYouResult, Item as AppVideoItem, ThreePointV2 } from '~/models/video/appForYou'
import type { Item as VideoItem, forYouResult } from '~/models/video/forYou'
import type { GridLayout } from '~/logic'
import { accessKey, settings } from '~/logic'
import { LanguageType } from '~/enums/appEnums'
import { TVAppKey, getTvSign } from '~/utils/authProvider'
import { isVerticalVideo } from '~/utils/uriParse'

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

const toast = useToast()
const api = useApiClient()
const videoList = reactive<VideoItem[]>([])
const appVideoList = reactive<AppVideoItem[]>([])
const isLoading = ref<boolean>(true)
const needToLoginFirst = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const refreshIdx = ref<number>(1)
const noMoreContent = ref<boolean>(false)
const { handleReachBottom, handlePageRefresh, scrollbarRef } = useBewlyApp()
const showVideoOptions = ref<boolean>(false)
const appVideoOptions = ref<ThreePointV2[] | undefined>([])
const videoOptions = reactive<{ id: number, name: string }[]>([
  { id: 1, name: '不感兴趣' },
  { id: 2, name: '不想看此UP主' },
])
const videoOptionsPosition = reactive<{ top: string, left: string }>({ top: '0', left: '0' })
const activatedAppVideoIdx = ref<number>(0)
const activatedAppVideo = ref<AppVideoItem | null>()
const activatedVideoId = ref<number>(0)
const activatedVideo = ref<VideoItem | null>()
const videoCardRef = ref(null)
const dislikedVideoUniqueKeys = ref<string[]>([])
const dislikedAppVideoUniqueKeys = ref<string[]>([])
const showDislikeDialog = ref<boolean>(false)
const selectedDislikeReason = ref<number>(1)
const loadingDislikeDialog = ref<boolean>(false)

onKeyStroke((e: KeyboardEvent) => {
  if (showDislikeDialog.value) {
    const dislikeReasons = activatedAppVideo.value?.three_point_v2?.find(option => option.type === ThreePointV2Type.Dislike)?.reasons || []

    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault()
      dislikeReasons.forEach((reason) => {
        if (dislikeReasons[Number(e.key) - 1] && reason.id === dislikeReasons[Number(e.key) - 1].id)
          selectedDislikeReason.value = reason.id
      })
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const currentIndex = dislikeReasons.findIndex(reason => selectedDislikeReason.value === reason.id)
      if (currentIndex > 0)
        selectedDislikeReason.value = dislikeReasons[currentIndex - 1].id
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const currentIndex = dislikeReasons.findIndex(reason => selectedDislikeReason.value === reason.id)
      if (currentIndex < dislikeReasons.length - 1)
        selectedDislikeReason.value = dislikeReasons[currentIndex + 1].id
    }
  }
})

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
    const response: forYouResult = await api.video.getRecommendVideos({
      fresh_idx: refreshIdx.value++,
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
    const response: AppForYouResult = await api.video.getAppRecommendVideos({
      access_key: accessKey.value,
      s_locale: settings.value.language === LanguageType.Mandarin_TW || settings.value.language === LanguageType.Cantonese ? 'zh-Hant_TW' : 'zh-Hans_CN',
      c_locale: settings.value.language === LanguageType.Mandarin_TW || settings.value.language === LanguageType.Cantonese ? 'zh-Hant_TW' : 'zh-Hans_CN',
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

function handleMoreClick(e: MouseEvent, data: VideoItem) {
  if (activatedVideo.value && activatedVideoId.value === data.id) {
    closeVideoOptions()
    return
  }

  showVideoOptions.value = true
  activatedVideoId.value = data.id
  activatedVideo.value = data
  const osInstance = scrollbarRef.value?.osInstance()
  const scrollTop = osInstance.elements().viewport.scrollTop || 0
  // videoOptions.value = data.three_point_v2
  videoOptionsPosition.top = `${e.clientY + scrollTop}px`
  videoOptionsPosition.left = `${e.clientX}px`
}

function handleAppMoreClick(e: MouseEvent, data: AppVideoItem) {
  if (activatedAppVideo.value && activatedAppVideoIdx.value === data.idx) {
    closeAppVideoOptions()
    return
  }

  showVideoOptions.value = true
  activatedAppVideoIdx.value = data.idx
  activatedAppVideo.value = data
  const osInstance = scrollbarRef.value?.osInstance()
  const scrollTop = osInstance.elements().viewport.scrollTop || 0
  appVideoOptions.value = data.three_point_v2
  videoOptionsPosition.top = `${e.clientY + scrollTop}px`
  videoOptionsPosition.left = `${e.clientX}px`
}

function handleMoreCommand(_command: number) {
  closeVideoOptions()
  activatedVideo.value && dislikedVideoUniqueKeys.value.push(getVideoUniqueKey(activatedVideo.value))
}

function handleAppMoreCommand(command: ThreePointV2Type) {
  closeAppVideoOptions()

  switch (command) {
    case ThreePointV2Type.Feedback:
      break
    case ThreePointV2Type.Dislike:
      openAppDislikeDialog()
      break
  }
}

function closeVideoOptions() {
  showVideoOptions.value = false
  activatedVideoId.value = 0
}

function closeAppVideoOptions() {
  showVideoOptions.value = false
  activatedAppVideoIdx.value = 0
}

function openAppDislikeDialog() {
  selectedDislikeReason.value = 1
  showDislikeDialog.value = true
}

function closeDislikeDialog() {
  showDislikeDialog.value = false
}

function handleAppDislike() {
  loadingDislikeDialog.value = true
  const params = {
    access_key: accessKey.value,
    goto: activatedAppVideo.value?.goto,
    id: activatedAppVideo.value?.param,
    // https://github.com/magicdawn/bilibili-app-recommend/blob/cb51f75f415f48235ce048537f2013122c16b56b/src/components/VideoCard/card.service.ts#L115
    idx: (Date.now() / 1000).toFixed(0),
    reason_id: selectedDislikeReason.value,
    build: 74800100,
    device: 'pad',
    mobi_app: 'iphone',
    appkey: TVAppKey.appkey,
  }

  api.video.dislikeVideo({
    ...params,
    sign: getTvSign(params),
  })
    .then((res) => {
      if (res.code === 0)
        activatedAppVideo.value && dislikedAppVideoUniqueKeys.value.push(getAppVideoUniqueKey(activatedAppVideo.value))
      else
        toast.error(res.message)
    })
    .finally(() => {
      loadingDislikeDialog.value = false
    })
}

function handleUndoDislike(_video: VideoItem) {
  dislikedVideoUniqueKeys.value = dislikedVideoUniqueKeys.value.filter(currentKey =>
    currentKey !== (activatedVideo.value ? getVideoUniqueKey(activatedVideo.value) : ''),
  )
}

function handleAppUndoDislike(video: AppVideoItem) {
  const params = {
    access_key: accessKey.value,
    goto: video.goto,
    id: video.param,
    // https://github.com/magicdawn/bilibili-app-recommend/blob/cb51f75f415f48235ce048537f2013122c16b56b/src/components/VideoCard/card.service.ts#L115
    idx: (Date.now() / 1000).toFixed(0),
    reason_id: selectedDislikeReason.value, // 1 means dislike, e.g. {"id": 1, "name": "不感兴趣","toast": "将减少相似内容推荐"}
    build: 74800100,
    device: 'pad',
    mobi_app: 'iphone',
    appkey: TVAppKey.appkey,
  }

  api.video.undoDislikeVideo({
    ...params,
    sign: getTvSign(params),
  }).then((res) => {
    if (res.code === 0) {
      dislikedAppVideoUniqueKeys.value = dislikedAppVideoUniqueKeys.value.filter(currentKey =>
        currentKey !== (activatedAppVideo.value ? getAppVideoUniqueKey(activatedAppVideo.value) : ''),
      )
    }
    else {
      toast.error(res.message)
    }
  })
}

function getVideoUniqueKey(video: VideoItem) {
  return video.id + (video.bvid || video.uri || '')
}

function getAppVideoUniqueKey(video: AppVideoItem) {
  return video.idx + (video.bvid || video.uri || '')
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

    <!-- more popup -->
    <div v-show="showVideoOptions">
      <div
        pos="fixed top-0 left-0" w-full h-full z-1
        @click="closeAppVideoOptions"
      />
      <div
        style="backdrop-filter: var(--bew-filter-glass-1);"
        :style="{ transform: `translate(${videoOptionsPosition.left}, ${videoOptionsPosition.top})` }"
        p-2 bg="$bew-elevated-1" rounded="$bew-radius" pos="absolute top-0 left-0"
        w-150px m="t-4 l-[calc(-150px+1rem)]"
        shadow="$bew-shadow-1" z-10
      >
        <ul flex="~ col gap-1">
          <template v-if="settings.recommendationMode === 'app'">
            <template v-for="option in appVideoOptions" :key="option.type">
              <li
                v-if="option.type !== ThreePointV2Type.WatchLater && option.type !== ThreePointV2Type.Feedback"
                bg="hover:$bew-fill-2" p="x-4 y-2" rounded="$bew-radius-half" cursor-pointer
                @click="handleAppMoreCommand(option.type)"
              >
                <span v-if="option.type === ThreePointV2Type.Dislike">{{ $t('home.not_interested') }}</span>
                <span v-else>{{ option.title }}</span>
              </li>
            </template>
          </template>
          <template v-else>
            <li
              v-for="option in videoOptions" :key="option.id"
              bg="hover:$bew-fill-2" p="x-4 y-2" rounded="$bew-radius-half" cursor-pointer
              @click="handleMoreCommand(option.id)"
            >
              {{ option.name }}
            </li>
          </template>
        </ul>
      </div>
    </div>

    <!-- dislike dialog -->
    <Dialog
      v-if="showDislikeDialog"
      :title="$t('home.tell_us_why')"
      width="400px"
      append-to-bewly-body
      :loading="loadingDislikeDialog"
      @close="closeDislikeDialog"
      @confirm="handleAppDislike"
    >
      <ul flex="~ col gap-2">
        <li
          v-for="(reason, index) in activatedAppVideo?.three_point_v2?.find(option => option.type === ThreePointV2Type.Dislike)?.reasons"
          :key="reason.id"
          :class="{ 'activated-dislike-reason': selectedDislikeReason === reason.id }"
          p="x-6 y-4" rounded="$bew-radius" cursor-pointer bg="$bew-fill-1 hover:$bew-fill-2"
          flex="~ gap-2 items-center justify-between"
          @click="selectedDislikeReason = reason.id"
        >
          <div flex="~ gap-2">
            <div
              bg="$bew-theme-color" color-white w-20px h-20px rounded-10
              flex="~ justify-center items-center"
            >
              {{ index + 1 }}
            </div>
            {{ reason.name }}
          </div>
          <line-md:confirm v-if="selectedDislikeReason === reason.id" />
        </li>
      </ul>
    </Dialog>

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
          :followed="!!video.is_followed"
          :mid="video.owner.mid"
          :view="video.stat.view"
          :danmaku="video.stat.danmaku"
          :published-timestamp="video.pubdate"
          :bvid="video.bvid"
          :cid="video.cid"
          :uri="video.uri"
          show-preview
          :horizontal="gridLayout !== 'adaptive'"
          more-btn
          :more-btn-active="video.id === activatedVideoId"
          :removed="dislikedVideoUniqueKeys.includes(getVideoUniqueKey(video))"
          @more-click="(e) => handleMoreClick(e, video)"
          @undo="handleUndoDislike(video)"
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
          :followed="video?.bottom_rcmd_reason === '已关注' || video?.bottom_rcmd_reason === '已關注'"
          :mid="video?.mask?.avatar.up_id "
          :capsule-text="video?.desc?.split('·')[1]"
          :bvid="video.bvid"
          :view-str="video.cover_left_text_1"
          :danmaku-str="video.cover_left_text_2"
          :cid="video?.player_args?.cid"
          :uri="video.uri"
          :type="video.card_goto === 'bangumi' ? 'bangumi' : isVerticalVideo(video.uri!) ? 'vertical' : 'horizontal'"
          show-preview
          :horizontal="gridLayout !== 'adaptive'"
          more-btn
          :more-btn-active="video.idx === activatedAppVideoIdx"
          :removed="dislikedAppVideoUniqueKeys.includes(getAppVideoUniqueKey(video))"
          @more-click="(e) => handleAppMoreClick(e, video)"
          @undo="handleAppUndoDislike(video)"
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
.activated-dislike-reason {
  --at-apply: bg-$bew-theme-color-20 color-$bew-theme-color;
}
</style>
