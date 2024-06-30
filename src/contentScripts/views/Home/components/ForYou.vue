<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onKeyStroke } from '@vueuse/core'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import Button from '~/components/Button.vue'
import Dialog from '~/components/Dialog.vue'
import Empty from '~/components/Empty.vue'
import VideoCard from '~/components/VideoCard/VideoCard.vue'
import { useApiClient } from '~/composables/api'
import { useBewlyApp } from '~/composables/useAppProvider'
import { FilterType, useFilter } from '~/composables/useFilter'
import { LanguageType } from '~/enums/appEnums'
import type { GridLayout } from '~/logic'
import { accessKey, settings } from '~/logic'
import type { AppForYouResult, Item as AppVideoItem, ThreePointV2 } from '~/models/video/appForYou'
import { Type as ThreePointV2Type } from '~/models/video/appForYou'
import type { forYouResult, Item as VideoItem } from '~/models/video/forYou'
import { getTvSign, TVAppKey } from '~/utils/authProvider'
import { isVerticalVideo } from '~/utils/uriParse'

const props = defineProps<{
  gridLayout: GridLayout
}>()

const emit = defineEmits<{
  (e: 'beforeLoading'): void
  (e: 'afterLoading'): void
}>()

const filterFunc = useFilter([FilterType.duration, FilterType.viewCount], [['duration'], ['stat', 'view']])
const appFilterFunc = useFilter([FilterType.duration, FilterType.viewCountStr], [['player_args', 'duration'], ['cover_left_text_1']])

const { t } = useI18n()

// https://github.com/starknt/BewlyBewly/blob/fad999c2e482095dc3840bb291af53d15ff44130/src/contentScripts/views/Home/components/ForYou.vue#L16
interface VideoElement {
  uniqueId: string
  item?: VideoItem
}

interface AppVideoElement {
  uniqueId: string
  item?: AppVideoItem
}

const gridValue = computed((): string => {
  if (props.gridLayout === 'adaptive')
    return '~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-5'
  if (props.gridLayout === 'twoColumns')
    return '~ cols-1 xl:cols-2 gap-4'
  return '~ cols-1 gap-4'
})

const toast = useToast()
const api = useApiClient()
const videoList = ref<VideoElement[]>([])
const appVideoList = ref<AppVideoElement[]>([])
const isLoading = ref<boolean>(false)
const needToLoginFirst = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const refreshIdx = ref<number>(1)
const noMoreContent = ref<boolean>(false)
const { handleReachBottom, handlePageRefresh, scrollbarRef, haveScrollbar } = useBewlyApp()
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
const pageSize = 30

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
  videoList.value.length = 0
  appVideoList.value.length = 0
  await getData()
}

async function getData() {
  emit('beforeLoading')
  isLoading.value = true
  try {
    if (settings.value.recommendationMode === 'web') {
      await getRecommendVideos()
    }
    else {
      for (let i = 0; i < 3; i++)
        await getAppRecommendVideos()
    }
  }
  finally {
    isLoading.value = false
    emit('afterLoading')
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
  try {
    let i = 0
    const pendingVideos: VideoElement[] = Array.from({ length: pageSize }, () => ({
      uniqueId: `unique-id-${(videoList.value.length || 0) + i++})}`,
    } satisfies VideoElement))
    videoList.value.push(...pendingVideos)

    const response: forYouResult = await api.video.getRecommendVideos({
      fresh_idx: refreshIdx.value++,
      ps: pageSize,
    })

    if (!response.data) {
      noMoreContent.value = true
      return
    }

    if (response.code === 0) {
      const resData = [] as VideoItem[]

      response.data.item.forEach((item: VideoItem) => {
        if (!filterFunc.value || filterFunc.value(item))
          resData.push(item)
      })

      // when videoList has length property, it means it is the first time to load
      if (!videoList.value.length) {
        videoList.value = resData.map(item => ({ uniqueId: `${item.id}`, item }))
      }
      else {
        resData.forEach((item) => {
          videoList.value.push({
            uniqueId: `${item.id}`,
            item,
          })
        })
      }

      if (!haveScrollbar()) {
        getRecommendVideos()
      }
    }
    else if (response.code === 62011) {
      needToLoginFirst.value = true
    }
  }
  finally {
    videoList.value = videoList.value.filter(video => video.item)
  }
}

async function getAppRecommendVideos() {
  try {
    let i = 0
    const pendingVideos: AppVideoElement[] = Array.from({ length: pageSize }, () => ({
      uniqueId: `unique-id-${(appVideoList.value.length || 0) + i++})}`,
    } satisfies AppVideoElement))
    appVideoList.value.push(...pendingVideos)

    const response: AppForYouResult = await api.video.getAppRecommendVideos({
      access_key: accessKey.value,
      s_locale: settings.value.language === LanguageType.Mandarin_TW || settings.value.language === LanguageType.Cantonese ? 'zh-Hant_TW' : 'zh-Hans_CN',
      c_locate: settings.value.language === LanguageType.Mandarin_TW || settings.value.language === LanguageType.Cantonese ? 'zh-Hant_TW' : 'zh-Hans_CN',
      appkey: TVAppKey.appkey,
      idx: appVideoList.value.length > 0 ? appVideoList.value[appVideoList.value.length - 1].item?.idx : 1,
    })

    if (response.code === 0) {
      const resData = [] as AppVideoItem[]

      response.data.items.forEach((item: AppVideoItem) => {
        // Remove banner & ad cards
        if (!item.card_type.includes('banner') && item.card_type !== 'cm_v1' && (!appFilterFunc.value || appFilterFunc.value(item)))
          resData.push(item)
      })

      // when videoList has length property, it means it is the first time to load
      if (!appVideoList.value.length) {
        appVideoList.value = resData.map(item => ({ uniqueId: `${item.idx}`, item }))
      }
      else {
        resData.forEach((item) => {
          appVideoList.value.push({
            uniqueId: `${item.idx}`,
            item,
          })
        })
      }

      if (!haveScrollbar()) {
        getAppRecommendVideos()
      }
    }
    else if (response.code === 62011) {
      needToLoginFirst.value = true
    }
  }
  finally {
    appVideoList.value = appVideoList.value.filter(video => video.item)
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
  activatedVideoId.value = 0
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
  if (!accessKey.value) {
    toast.warning(t('auth.auth_access_key_first'))
    return
  }

  loadingDislikeDialog.value = true
  const params = {
    access_key: accessKey.value,
    goto: activatedAppVideo.value?.goto,
    id: Number(activatedAppVideo.value?.param),
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
    id: Number(video.param),
    // https://github.com/magicdawn/bilibili-app-recommend/blob/cb51f75f415f48235ce048537f2013122c16b56b/src/components/VideoCard/card.service.ts#L115
    idx: Number((Date.now() / 1000).toFixed(0)),
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

function getVideoUniqueKey(video: VideoItem): string {
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
        p-2 bg="$bew-elevated" rounded="$bew-radius" pos="absolute top-0 left-0"
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
          <Icon
            v-if="selectedDislikeReason === reason.id" icon="line-md:confirm"
            w-18px h-18px
          />
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
          :key="video.uniqueId"
          :skeleton="!video.item"
          :video="video.item ? {
            id: video.item.id,
            duration: video.item.duration,
            title: video.item.title,
            cover: video.item.pic,
            author: video.item.owner.name,
            authorFace: video.item.owner.face,
            followed: !!video.item.is_followed,
            mid: video.item.owner.mid,
            view: video.item.stat.view,
            danmaku: video.item.stat.danmaku,
            publishedTimestamp: video.item.pubdate,
            bvid: video.item.bvid,
            cid: video.item.cid,
          } : undefined"
          show-preview
          :horizontal="gridLayout !== 'adaptive'"
          more-btn
          :more-btn-active="video.item && video.item.id === activatedVideoId"
          :removed="video.item && dislikedVideoUniqueKeys.includes(getVideoUniqueKey(video.item))"
          @more-click="(e) => handleMoreClick(e, video.item!)"
          @undo="handleUndoDislike(video.item!)"
        />
      </template>
      <template v-else>
        <VideoCard
          v-for="video in appVideoList"
          :key="video.uniqueId"
          ref="videoCardRef"
          :skeleton="!video.item"
          :video="video.item ? {
            id: video.item.args.aid ?? 0,
            durationStr: video.item.cover_right_text,
            title: `${video.item.title}`,
            cover: `${video.item.cover}`,
            author: video.item?.mask?.avatar.text,
            authorFace: video.item?.mask?.avatar.cover || video.item?.avatar?.cover,
            followed: video.item?.bottom_rcmd_reason === '已关注' || video.item?.bottom_rcmd_reason === '已關注',
            mid: video.item?.mask?.avatar.up_id,
            capsuleText: video.item?.desc?.split('·')[1],
            bvid: video.item.bvid,
            viewStr: video.item.cover_left_text_1,
            danmakuStr: video.item.cover_left_text_2,
            cid: video.item?.player_args?.cid,
            url: video.item?.goto === 'bangumi' ? video.item.uri : '',
            type: video.item.card_goto === 'bangumi' ? 'bangumi' : isVerticalVideo(video.item.uri!) ? 'vertical' : 'horizontal',
          } : undefined"
          show-preview
          :horizontal="gridLayout !== 'adaptive'"
          more-btn
          :more-btn-active="video.item && video.item.idx === activatedAppVideoIdx"
          :removed="video.item && dislikedAppVideoUniqueKeys.includes(getAppVideoUniqueKey(video.item))"
          @more-click="(e) => handleAppMoreClick(e, video.item!)"
          @undo="handleAppUndoDislike(video.item!)"
        />
        <!-- :more-options="video.three_point_v2" -->
      </template>
    </div>

    <!-- no more content -->
    <Empty v-if="noMoreContent" class="pb-4" :description="$t('common.no_more_content')" />
  </div>
</template>

<style lang="scss" scoped>
.activated-dislike-reason {
  --uno: "bg-$bew-theme-color-20 color-$bew-theme-color";
}
</style>
