<script lang="ts" setup>
import { Icon } from '@iconify/vue'

import Button from '~/components/Button.vue'
import { useApiClient } from '~/composables/api'
import { settings } from '~/logic'
import type { VideoPreviewResult } from '~/models/video/videoPreview'
import { calcCurrentTime, calcTimeSince, numFormatter } from '~/utils/dataFormatter'
import { getCSRF, removeHttpFromUrl } from '~/utils/main'

import Tooltip from '../Tooltip.vue'
import VideoCardSkeleton from './VideoCardSkeleton.vue'

interface Props {
  skeleton?: boolean
  video?: Video
  showWatcherLater?: boolean
  horizontal?: boolean
  showPreview?: boolean
  moreBtn?: boolean
  moreBtnActive?: boolean
  removed?: boolean
}

interface Video {
  id: number
  duration?: number
  durationStr?: string
  title: string
  desc?: string
  cover: string
  author?: string
  authorFace?: string
  /** After set the `authorUrl`, clicking the author's name or avatar will navigate to this url. It won't be affected by mid */
  authorUrl?: string
  mid?: number
  view?: number
  viewStr?: string
  danmaku?: number
  danmakuStr?: string
  publishedTimestamp?: number
  capsuleText?: string
  bvid?: string
  aid?: number
  /** After set the `url`, clicking the video will navigate to this url. It won't be affected by aid, bvid or epid */
  url?: string
  /** If you want to show preview video, you should set the cid value */
  cid?: number
  epid?: number
  followed?: boolean
  tag?: string
  rank?: number
  type?: 'horizontal' | 'vertical' | 'bangumi'
}

const props = withDefaults(defineProps<Props>(), {
  showWatcherLater: true,
})

const emit = defineEmits<{
  (e: 'moreClick', event: MouseEvent): MouseEvent
  (e: 'undo'): void
  (e: 'tellUsWhy'): void
}>()

const api = useApiClient()

// Used to click and control herf attribute
const isClick = ref<boolean>(false)

function getCurrentVideoUrl(video: Video) {
  const baseUrl = `https://www.bilibili.com/video/${video.bvid ?? `av${video.aid}`}`
  const currentTime = getCurrentTime()
  return currentTime && currentTime > 5 ? `${baseUrl}/?t=${currentTime}` : baseUrl
}

const videoUrl = computed(() => {
  if (props.removed || !isClick.value || !props.video)
    return undefined

  if (props.video.url)
    return props.video.url
  else if (props.video.bvid || props.video.aid)
    return getCurrentVideoUrl(props.video)
  else if (props.video.epid)
    return `https://www.bilibili.com/bangumi/play/ep${props.video.epid}`
  else
    return ''
})

const authorJumpUrl = computed(() => {
  if (!props.video)
    return

  if (props.video.authorUrl)
    return props.video.authorUrl
  else if (props.video.mid)
    return `//space.bilibili.com/${props.video.mid}`
  else
    return ''
})

const wValue = computed((): string => {
  if (props.horizontal)
    return 'xl:280px lg:250px md:200px 200px'
  else
    return 'w-full'
})

const isInWatchLater = ref<boolean>(false)
const isHover = ref<boolean>(false)
const mouseEnterTimeOut = ref()
const mouseLeaveTimeOut = ref()
const previewVideoUrl = ref<string>('')
const contentVisibility = ref<'auto' | 'visible'>('auto')
const videoElement = ref<HTMLVideoElement | null>(null)

function getCurrentTime() {
  if (videoElement.value) {
    const currentTime = videoElement.value.currentTime
    return currentTime
  }
  return null
}

watch(() => isHover.value, (newValue) => {
  if (!props.video || !newValue)
    return

  if (props.showPreview && settings.value.enableVideoPreview
    && !previewVideoUrl.value && props.video.cid) {
    api.video.getVideoPreview({
      bvid: props.video.bvid,
      cid: props.video.cid,
    }).then((res: VideoPreviewResult) => {
      if (res.code === 0)
        previewVideoUrl.value = res.data.durl[0].url
    })
  }
})

function toggleWatchLater() {
  if (!props.video)
    return

  if (!isInWatchLater.value) {
    api.watchlater.saveToWatchLater({
      aid: props.video.id,
      csrf: getCSRF(),
    })
      .then((res) => {
        if (res.code === 0)
          isInWatchLater.value = true
      })
  }
  else {
    api.watchlater.removeFromWatchLater({
      aid: props.video.id,
      csrf: getCSRF(),
    })
      .then((res) => {
        if (res.code === 0)
          isInWatchLater.value = false
      })
  }
}

function handleMouseEnter() {
  // fix #789
  contentVisibility.value = 'visible'
  if (settings.value.hoverVideoCardDelayed) {
    mouseEnterTimeOut.value = setTimeout(() => {
      isHover.value = true
      clearTimeout(mouseLeaveTimeOut.value)
    }, 1200)
  }
  else {
    mouseEnterTimeOut.value = setTimeout(() => {
      isHover.value = true
      clearTimeout(mouseLeaveTimeOut.value)
    }, 500)
  }
}

function handelMouseLeave() {
  contentVisibility.value = 'auto'
  isHover.value = false
  clearTimeout(mouseEnterTimeOut.value)
  clearTimeout(mouseLeaveTimeOut.value)
}

function switchClickState(flag: boolean) {
  if (flag) {
    isClick.value = flag
  }
  else {
    setTimeout(() => {
      isClick.value = flag
    })
  }
}

function handleMoreBtnClick(event: MouseEvent) {
  emit('moreClick', event)
}

function handleUndo() {
  emit('undo')
}
</script>

<template>
  <div
    :style="{ contentVisibility }"
    intrinsic-size-300px
    duration-300 ease-in-out
    rounded="$bew-radius"
    ring="hover:8 hover:$bew-fill-2 active:8 active:$bew-fill-3"
    bg="hover:$bew-fill-2 active:$bew-fill-3"
    transform="~ translate-z-0"
    mb-4
  >
    <!-- By directly using predefined unocss width properties, it is possible to dynamically set the width attribute -->
    <div hidden w="xl:280px lg:250px md:200px 200px" />
    <div hidden w="full" />

    <div v-if="!skeleton && video">
      <div
        class="video-card group"
        w="full"
        rounded="$bew-radius"
      >
        <a
          :style="{ display: horizontal ? 'flex' : 'block', gap: horizontal ? '1.5rem' : '0' }"
          :href="videoUrl" target="_blank" rel="noopener noreferrer"
          @mouseenter="handleMouseEnter"
          @mouseleave="handelMouseLeave"
          @mousedown="switchClickState(true)"
          @mouseup="switchClickState(false)"
          @dragend="switchClickState(false)"
        >
          <!-- Cover -->
          <div
            class="group/cover"
            shrink-0
            :w="wValue" h-fit relative bg="$bew-skeleton" rounded="$bew-radius"
            cursor-pointer
            group-hover:z-2
            transform="~ translate-z-0"
          >
            <!-- Video cover -->
            <img
              :src="`${removeHttpFromUrl(video.cover)}@672w_378h_1c`"
              loading="lazy"
              w="full" max-w-full align-middle aspect-video
              bg="cover center"
              rounded="$bew-radius"
            >

            <div
              v-if="removed"
              pos="absolute top-0 left-0" w-full h-fit aspect-video flex="~ col gap-2 items-center justify-center"
              bg="$bew-fill-4" backdrop-blur-20px mix-blend-luminosity rounded="$bew-radius" z-2
            >
              <p mb-2 color-white text-lg>
                {{ $t('home.video_removed') }}
              </p>
              <Button
                color="rgba(255,255,255,.35)" text-color="white" size="small"
                @click.prevent="handleUndo"
              >
                <template #left>
                  <div i-mingcute-back-line text-lg />
                </template>
                {{ $t('common.undo') }}
              </Button>
            </div>

            <!-- Video preview -->
            <Transition v-if="!removed && showPreview && settings.enableVideoPreview" name="fade">
              <video
                v-if="previewVideoUrl && isHover"
                ref="videoElement"
                autoplay muted
                :controls="settings.enableVideoCtrlBarOnVideoCard"
                :style="{ pointerEvents: settings.enableVideoCtrlBarOnVideoCard ? 'auto' : 'none' }"
                pos="absolute top-0 left-0" w-full aspect-video rounded="$bew-radius" bg-black
                @mouseenter="handleMouseEnter"
              >
                <source :src="previewVideoUrl" type="video/mp4">
              </video>
            </Transition>

            <!-- Ranking Number -->
            <div
              v-if="video.rank"
              pos="absolute top-0"
              p-2 group-hover:opacity-0
              duration-300
            >
              <div
                v-if="Number(video.rank) <= 3"
                bg="$bew-theme-color" text-center lh-0 h-30px w-30px
                text-white rounded="1/2" shadow="$bew-shadow-1"
                border="1 $bew-theme-color"
                grid="~ place-content-center"
                text="xl" fw-bold
              >
                {{ video.rank }}
              </div>
              <div
                v-else
                bg="$bew-elevated-solid" text-center lh-30px h-30px w-30px
                rounded="1/2" shadow="$bew-shadow-1"
                border="1 $bew-border-color"
              >
                {{ video.rank }}
              </div>
            </div>

            <template v-if="!removed">
              <!-- Video Duration -->
              <div
                v-if="video.duration || video.durationStr"
                pos="absolute bottom-0 right-0"
                z="2"
                p="x-2 y-1"
                m="1"
                rounded="$bew-radius"
                text="!white xs"
                bg="black opacity-60"
                class="group-hover:opacity-0"
                duration-300
              >
                {{ video.duration ? calcCurrentTime(video.duration) : video.durationStr }}
              </div>

              <div
                class="opacity-0 group-hover/cover:opacity-100"
                transform="scale-70 group-hover/cover:scale-100"
                duration-300
                pos="absolute top-0 left-0" z-2
              >
                <slot name="coverTopLeft" />
              </div>

              <!-- Watcher later button -->
              <button
                v-if="showWatcherLater"
                pos="absolute top-0 right-0" z="2"
                p="x-2 y-1" m="1"
                rounded="$bew-radius"
                text="!white xl"
                bg="black opacity-60"
                class="opacity-0 group-hover/cover:opacity-100"
                transform="scale-70 group-hover/cover:scale-100"
                duration-300
                @click.prevent="toggleWatchLater"
              >
                <Tooltip v-if="!isInWatchLater" :content="$t('common.save_to_watch_later')" placement="bottom-right" type="dark">
                  <div i-mingcute:carplay-line />
                </Tooltip>
                <Tooltip v-else :content="$t('common.added')" placement="bottom-right" type="dark">
                  <Icon icon="line-md:confirm" />
                </Tooltip>
              </button>
            </template>
          </div>

          <!-- Other Information -->
          <div
            v-if="!removed"
            :style="{
              width: horizontal ? '100%' : 'unset',
              marginTop: horizontal ? '0' : '1rem',
            }"
            flex="~"
          >
            <!-- Author Avatar -->
            <div v-if="!horizontal" flex>
              <a
                v-if="video.authorFace"
                :href="authorJumpUrl" target="_blank" rel="noopener noreferrer"
                m="r-4" w="36px" h="36px" rounded="1/2"
                object="center cover" bg="$bew-skeleton" cursor="pointer"
                position-relative
                @click.stop=""
              >
                <img
                  rounded="1/2"
                  :src="`${removeHttpFromUrl(video.authorFace)}@50w_50h_1c`"
                  width="36"
                  height="36"
                  loading="lazy"
                >
                <div
                  v-if="video.followed"
                  pos="absolute bottom--2px right--2px"
                  w-14px h-14px
                  bg="$bew-theme-color"
                  rounded="1/2"
                  grid place-items-center
                >
                  <div color-white text-sm class="i-mingcute:check-fill w-10px h-10px" />
                </div>
              </a>
            </div>
            <div class="group/desc" flex="~ col" w="full" align="items-start">
              <div flex="~ gap-1 justify-between items-start" w="full" pos="relative">
                <h3
                  class="keep-two-lines"
                  text="lg overflow-ellipsis $bew-text-1"
                  cursor="pointer"
                >
                  <a :href="videoUrl" target="_blank" :title="video.title" rel="noopener noreferrer">
                    {{ video.title }}
                  </a>
                </h3>

                <div
                  v-if="moreBtn"
                  class="opacity-0 group-hover/desc:opacity-100"
                  :class="{ 'more-active': moreBtnActive }"
                  shrink-0 w-30px h-30px m="t--3px r--8px" translate-x--8px
                  grid place-items-center cursor-pointer rounded="50%" duration-300
                  @click.prevent="handleMoreBtnClick"
                >
                  <div i-mingcute:more-2-line text="lg" />
                </div>
              </div>
              <div text="base $bew-text-2" w-fit m="t-2" flex="~ items-center wrap">
                <!-- Author Avatar -->
                <span
                  :style="{
                    marginBottom: horizontal ? '0.5rem' : '0',
                  }"
                  flex="inline items-center"
                >
                  <div v-if="horizontal" flex>
                    <a
                      v-if="video.authorFace"
                      :href="authorJumpUrl" target="_blank" rel="noopener noreferrer"
                      m="r-2" w="30px" h="30px" rounded="1/2"
                      object="center cover" bg="$bew-skeleton" cursor="pointer" relative
                      @click.stop=""
                    >
                      <img
                        :src="`${removeHttpFromUrl(video.authorFace)}@50w_50h_1c`"
                        width="30"
                        height="30"
                        loading="lazy"
                        object-cover rounded="1/2"
                      >
                      <div
                        v-if="video.followed"
                        pos="absolute bottom--2px right--2px"
                        w-14px h-14px
                        bg="$bew-theme-color"
                        rounded="1/2"
                        grid place-items-center
                      >
                        <div color-white text-sm class="i-mingcute:check-fill w-10px h-10px" />
                      </div>
                    </a>
                  </div>

                  <a
                    v-if="video.author"
                    class="channel-name"
                    un-text="hover:$bew-text-1"
                    cursor-pointer mr-4
                    :href="authorJumpUrl" target="_blank" rel="noopener noreferrer"
                    @click.stop=""
                  >
                    <span>{{ video.author }}</span>
                  </a>
                </span>
              </div>

              <div flex="~ items-center gap-1 wrap">
                <!-- View & Danmaku Count -->
                <div
                  text="$bew-text-2" rounded="$bew-radius"
                  inline-block
                >
                  <span v-if="video.view || video.viewStr">
                    {{ video.view ? $t('common.view', { count: numFormatter(video.view) }, video.view) : `${video.viewStr}${$t('common.viewWithoutNum')}` }}
                  </span>
                  <template v-if="video.danmaku || video.danmakuStr">
                    <span text-xs font-light mx-4px>•</span>
                    <span>{{ video.danmaku ? $t('common.danmaku', { count: numFormatter(video.danmaku) }, video.danmaku) : `${video.danmakuStr}${$t('common.danmakuWithoutNum')}` }}</span>
                  </template>
                  <br>
                </div>
              </div>
              <div mt-2 flex="~ gap-1">
                <!-- Tag -->
                <span
                  v-if="video.tag"
                  text="$bew-theme-color sm" lh-6 p="x-2" rounded="$bew-radius" bg="$bew-theme-color-20"
                >
                  {{ video.tag }}
                </span>
                <span
                  v-if="video.publishedTimestamp || video.capsuleText"
                  bg="$bew-fill-1" p="x-2" rounded="$bew-radius" text="sm $bew-text-3" lh-6
                  mr-1
                >
                  {{ video.publishedTimestamp ? calcTimeSince(video.publishedTimestamp * 1000) : video.capsuleText?.trim() }}
                </span>
                <!-- Video type -->
                <span text="$bew-text-2" grid="~ place-items-center">
                  <div v-if="video.type === 'vertical'" i-mingcute:cellphone-2-line />
                  <div v-else-if="video.type === 'bangumi'" i-mingcute:movie-line />
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>

    <!-- skeleton -->
    <VideoCardSkeleton
      v-if="skeleton"
      :horizontal="horizontal"
      important-mb-0
    />
  </div>
</template>

<style lang="scss" scoped>
.more-active {
  --uno: "opacity-100 bg-$bew-fill-3";
}
</style>
