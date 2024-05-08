<script setup lang="ts">
import type { Ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import { Type as ThreePointV2Type } from '~/models/video/appForYou'
import type { AppForYouResult, Item as AppVideoItem, ThreePointV2 } from '~/models/video/appForYou'
import type { Item as WebVideoItem, forYouResult } from '~/models/video/forYou'
import type { GridLayout } from '~/logic'
import { accessKey, settings } from '~/logic'
import { LanguageType } from '~/enums/appEnums'
import { TVAppKey, getTvSign } from '~/utils/authProvider'
import { isVerticalVideo } from '~/utils/uriParse'
import { getLastElement } from '~/utils/array'
import type { VideoCardProps } from '~/components/VideoCard/types'

interface VideoElement {
  id: string
  item: AppVideoItem | WebVideoItem | '<slot />'
}

const props = defineProps<{
  gridLayout: GridLayout
}>()

const emit = defineEmits<{
  (e: 'beforeLoading'): void
  (e: 'afterLoading'): void
}>()

const toast = useToast()
const api = useApiClient()
const ps = ref<number>(30)
const videoList = ref<Array<VideoElement>>([])
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
const activatedVideo = ref<WebVideoItem | null>()
const dislikedVideoUniqueKeys = ref<string[]>([])
const dislikedAppVideoUniqueKeys = ref<string[]>([])
const showDislikeDialog = ref<boolean>(false)
const selectedDislikeReason = ref<number>(1)
const loadingDislikeDialog = ref<boolean>(false)

function getWebVideoProps(item?: WebVideoItem | '<slot />'): VideoCardProps {
  if (!item || item === '<slot />') {
    return {
      horizontal: props.gridLayout === 'oneColumn',
    } as VideoCardProps
  }

  return {
    id: item.id,
    duration: item.duration,
    title: item.title,
    cover: item.pic,
    author: item.owner.name,
    authorFace: item.owner.face,
    followed: !!item.is_followed,
    mid: item.owner.mid,
    view: item.stat.view,
    danmaku: item.stat.danmaku,
    publishedTimestamp: item.pubdate,
    bvid: item.bvid,
    cid: item.cid,
    uri: item.uri,
    showPreview: true,
    moreBtn: true,
    horizontal: props.gridLayout === 'oneColumn',
    moreBtnActive: item.id === activatedVideoId.value,
    removed: dislikedVideoUniqueKeys.value.includes(getVideoUniqueKey(item)),
  }
}

function getAppVideoProps(item?: AppVideoItem | '<slot />'): VideoCardProps {
  if (!item || item === '<slot />') {
    return {
      horizontal: props.gridLayout === 'oneColumn',
    } as VideoCardProps
  }

  return {
    id: item.args.aid!,
    durationStr: item.cover_right_text,
    title: item.title!,
    cover: item.cover!,
    author: item.mask?.avatar.text,
    authorFace: item.mask?.avatar.cover,
    followed: item.bottom_rcmd_reason === '已关注' || item.bottom_rcmd_reason === '已關注',
    mid: item.mask?.avatar.up_id,
    capsuleText: item.desc,
    bvid: item.bvid,
    viewStr: item.cover_left_text_1,
    danmakuStr: item.cover_left_text_2,
    cid: item.player_args?.cid,
    uri: item.uri,
    type: item.card_goto === 'bangumi' ? 'bangumi' : isVerticalVideo(item.uri!) ? 'vertical' : 'horizontal',
    showPreview: true,
    moreBtn: true,
    horizontal: props.gridLayout === 'oneColumn',
    removed: dislikedAppVideoUniqueKeys.value.includes(getAppVideoUniqueKey(item)),
  }
}

const videos = computed(() => {
  if (settings.value.recommendationMode === 'web') {
    return videoList.value.map((video) => {
      const skeleton = video.item === '<slot />'
      const item = video.item as WebVideoItem
      return {
        key: video.id,
        moreClick: (e: MouseEvent) => handleMoreClick(e, item),
        undo: () => handleUndoDislike(item),
        props: {
          skeleton,
          ...getWebVideoProps(item),
        } satisfies VideoCardProps,
      }
    })
  }

  return videoList.value.map((video) => {
    const skeleton = video.item === '<slot />'
    const item = video.item as AppVideoItem
    return {
      key: video.id,
      moreClick: (e: MouseEvent) => handleAppMoreClick(e, item),
      undo: () => handleAppUndoDislike(item),
      props: {
        skeleton,
        ...getAppVideoProps(item),
      } satisfies VideoCardProps,
    }
  })
})

const gridValue = computed((): string => {
  if (props.gridLayout === 'adaptive')
    return '~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-6'
  if (props.gridLayout === 'twoColumns')
    return '~ cols-1 sm:cols-2 lg:cols-3 xl:cols-4 gap-4'
  return '~ cols-1 gap-4'
})

onBeforeMount(async () => {
  initPageAction()
})

onActivated(() => {
  initPageAction()
})

async function initData() {
  isLoading.value = true
  await getData()
  isLoading.value = false
}

async function getData() {
  emit('beforeLoading')
  switch (settings.value.recommendationMode) {
    case 'web':
      return getWebRecommendVideos()
        .finally(() => {
          emit('afterLoading')
        })
    case 'app':
      return getAppRecommendVideos()
        .finally(() => {
          emit('afterLoading')
        })
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

async function getWebRecommendVideos() {
  try {
    const pendingVideos: VideoElement[] = Array.from({ length: ps.value }, () => ({
      id: String(useId()),
      item: '<slot />',
    } satisfies VideoElement))
    let idx = videoList.value.length
    videoList.value.push(...pendingVideos)

    const response: forYouResult = await api.video.getRecommendVideos({
      fresh_idx: refreshIdx.value++,
      ps: ps.value,
      version: 1,
    })

    if (!response.data) {
      noMoreContent.value = true
      return
    }

    if (response.code === 0) {
      response.data.item.forEach((item: WebVideoItem) => {
        videoList.value[idx++].item = item
      })
    }
    else if (response.code === 62011) {
      needToLoginFirst.value = true
    }
  }
  finally {
    // remove pending videos
    videoList.value = videoList.value.filter(video => video.item !== '<slot />')
  }
}

async function getAppRecommendVideos() {
  const pendingVideos: VideoElement[] = Array.from({ length: ps.value }, () => ({
    id: String(useId()),
    item: '<slot />',
  } satisfies VideoElement))
  let idx = videoList.value.length
  videoList.value.push(...pendingVideos)
  let count = 0
  try {
    while (count < ps.value) {
      const response: AppForYouResult = await api.video.getAppRecommendVideos({
        access_key: accessKey.value,
        s_locale: settings.value.language === LanguageType.Mandarin_TW || settings.value.language === LanguageType.Cantonese ? 'zh-Hant_TW' : 'zh-Hans_CN',
        c_locate: settings.value.language === LanguageType.Mandarin_TW || settings.value.language === LanguageType.Cantonese ? 'zh-Hant_TW' : 'zh-Hans_CN',
        appkey: TVAppKey.appkey,
        idx: videoList.value.length > 0 ? getLastElement(videoList.value.map<AppVideoItem>(el => el.item as AppVideoItem)).idx : 1,
      })

      if (response.code === 0) {
        response.data.items.forEach((item: AppVideoItem) => {
        // Remove banner & ad cards
          if (!item.card_type.includes('banner') && item.card_type !== 'cm_v1') {
            videoList.value[idx++].item = item
            count++
          }
        })
      }
      else if (response.code === 62011) {
        needToLoginFirst.value = true
        break
      }
    }
  }
  finally {
    // remove pending videos
    videoList.value = videoList.value.filter(video => video.item !== '<slot />')
  }
}

function handleMoreClick(e: MouseEvent, data: WebVideoItem) {
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

function handleUndoDislike(_video: WebVideoItem) {
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

function getVideoUniqueKey(video: WebVideoItem) {
  return video.id + (video.bvid || video.uri || '')
}

function getAppVideoUniqueKey(video: AppVideoItem) {
  return video.idx + (video.bvid || video.uri || '')
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}

defineExpose({ initData })

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

watch(() => settings.value.recommendationMode, (mode, oldMode) => {
  if (mode !== oldMode) {
    videoList.value = []
    refreshIdx.value = 1
    noMoreContent.value = false
  }
  initData()
}, { immediate: true })
</script>

<template>
  <div>
    <!-- By directly using predefined unocss grid properties, it is possible to dynamically set the grid attribute -->
    <div hidden grid="~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-5" />
    <div hidden grid="~ cols-1 xl:cols-2 gap-4" />
    <div hidden grid="~ cols-1 sm:cols-2 lg:cols-3 xl:cols-4 gap-4" />
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
      ref="containerRef"
      if="!needToLoginFirst"
      m="b-0 t-0" relative w-full h-full
      pb-4 gap-4
      :grid="gridValue"
    >
      <VideoCardV2 v-for="video in videos" v-bind="video.props" :key="video.key" @more-click="video.moreClick" @undo="video.undo" />
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
