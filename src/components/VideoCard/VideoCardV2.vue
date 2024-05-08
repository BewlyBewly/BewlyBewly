<script setup lang="ts">
import { useElementHover, useIntersectionObserver } from '@vueuse/core'
import type { VideoCardProps } from './types'
import { calcTimeSince, numFormatter } from '~/utils/dataFormatter'
import { removeHttpFromUrl } from '~/utils/main'
import { settings } from '~/logic'
import type { VideoPreviewResult } from '~/models/video/videoPreview'

const props = withDefaults(defineProps<VideoCardProps>(), {
  topRightContent: true,
  type: 'horizontal',
  title: '',
  cover: '',
  id: 0,
})

const emit = defineEmits<{
  (e: 'moreClick', event: MouseEvent): MouseEvent
  (e: 'undo'): void
  (e: 'tellUsWhy'): void
}>()

const api = useApiClient()

const warperEl = ref<HTMLElement>()
const previewEl = ref<HTMLElement>()
const isVisible = ref<boolean>(true)
const previewVideoUrl = ref<string>()

const videoUrl = computed(() => {
  if (props.bvid || props.aid)
    return `https://www.bilibili.com/video/${props.bvid ?? `av${props.aid}`}`
  else if (props.epid)
    return `https://www.bilibili.com/bangumi/play/ss${props.epid}`
  else if (props.uri)
    return props.uri
  return ''
})
const authorUrl = computed(() => {
  if (props.authorUrl)
    return props.authorUrl
  else if (props.mid)
    return `//space.bilibili.com/${props.mid}`
  else
    return ''
})

const { resume } = useIntersectionObserver(warperEl, ([{ isIntersecting }]) => {
  isVisible.value = isIntersecting
}, { immediate: false })

const isHover = useElementHover(previewEl)
const showPreviewVideo = computed(() => props.showPreview && settings.value.enableVideoPreview && previewVideoUrl && isHover.value)

onMounted(async () => {
  setTimeout(() => resume(), 30 * 1000) // 30s
})

watch(isHover, (isHover) => {
  if (props.showPreview && settings.value.enableVideoPreview && isHover && !previewVideoUrl.value) {
    api.video.getVideoPreview({
      bvid: props.bvid,
      cid: props.cid,
    }).then((res: VideoPreviewResult) => {
      if (res.code === 0)
        previewVideoUrl.value = res.data.durl[0].url
    })
  }
})
</script>

<template>
  <div ref="warperEl" class="video-card-wrapper" :style="{ visibility: isVisible ? 'visible' : 'hidden' }">
    <!-- bewly video card -->
    <div v-if="!skeleton" flex="~ col gap-y-2" class="bewly-video-card">
      <!-- video card cover -->
      <a :href="videoUrl" target="_blank" rel="noopener noreferrer" :draggable="!showPreviewVideo">
        <div ref="previewEl" class="relative of-hidden rounded-$bew-radius" flex="~ justify-center items-center">
          <picture draggable="false">
            <source :srcset="`${removeHttpFromUrl(cover)}` + '@672w_378h_1c_!web-home-common-cover.avif'" type="image/avif">
            <source :srcset="`${removeHttpFromUrl(cover)}` + '@672w_378h_1c_!web-home-common-cover.webp'" type="image/webp">
            <img :src="`${removeHttpFromUrl(cover)}` + '@672w_378h_1c_!web-home-common-cover'" loading="lazy" class="w-full max-w-full min-h-196px align-middle aspect-video" bg="cover center">
          </picture>

          <!-- preview video -->
          <Transition name="fade">
            <div v-if="showPreviewVideo" pos="absolute top-0 left-0 bottom-0 right-0">
              <video
                autoplay muted
                :controls="settings.enableVideoCtrlBarOnVideoCard"
                class="size-full aspect-video bg-black"
              >
                <source :src="previewVideoUrl" type="video/mp4">
              </video>
            </div>
          </Transition>

          <!-- rank -->
          <div v-if="rank" pos="absolute top-1 left-1 p-2" flex="~ justify-center items-center">
            <div
              class="size-30px rounded-full shadow-$bew-shadow-1"
              bg="$bew-theme-color"
              border="1 $bew-theme-color"
              text="white center 2xl fw-bold"
            >
              {{ rank }}
            </div>
          </div>

          <div
            v-if="removed"
            flex="~ col items-center justify-center gap-2"
            pos="absolute top-0 left-0 bottom-0 right-0 z-2000"
            bg="$bew-fill-4"
            class="backdrop-blur-20px mix-blend-luminosity"
          >
            <p class="text-white text-lg">
              {{ $t('home.video_removed') }}
            </p>
            <Button
              color="rgba(255,255,255,.35)" text-color="white" size="small"
              @click.prevent="emit('undo')"
            >
              <template #left>
                <i class="i-mingcute:back-line text-lg" />
              </template>
              {{ $t('common.undo') }}
            </Button>
          </div>
        </div>
      </a>

      <!-- video card infomation -->
      <div v-if="!removed" flex="~ gap-x-4" class="p2 pt-0 group/desc">
        <!-- avatar -->
        <a
          :href="authorUrl" target="_blank" rel="noopener noreferrer"
          class="size-36px position-relative rounded-full object-cover cursor-pointer"
        >
          <img
            :src="`${removeHttpFromUrl(authorFace!)}@50w_50h_1c`"
            class="rounded-full object-cover size-36px"
            loading="lazy"
          >
          <div
            v-if="followed"
            class="size-14px rounded-full"
            pos="absolute bottom--2px right--2px"
            bg="$bew-theme-color"
            flex="~ items-center justify-center"
          >
            <i text="sm white" class="i-mingcute:check-fill size-10px" />
          </div>
        </a>

        <div flex="~ col gap-y-2" class="w-full">
          <!-- header -->
          <div class="w-full flex gap-x-2">
            <!-- title -->
            <h3
              :title="title"
              class="flex-1 min-h-[calc(((1rem*1.75)-1em)*2+1em*2)] keep-two-lines transform-translate-z-0 cursor-pointer"
              text="lg overflow-ellipsis $bew-text-1"
              hover="text-$bew-theme-color"
            >
              <a :href="videoUrl" target="_blank" rel="noopener noreferrer">
                {{ title }}
              </a>
            </h3>

            <!-- more btn -->
            <div
              v-if="moreBtn"
              flex="~ justify-center items-center"
              class="transition-opacity op-0 group-hover/desc:op-100 size-30px rounded-full cursor-pointer"
              ring="1 $bew-border-color"
              focus="ring-2"
              hover="bg-$bew-theme-color-10"
              @click.prevent="emit('moreClick', $event)"
            >
              <i class="i-mingcute:more-2-line text-lg" />
            </div>
          </div>

          <div flex="~ items-center gap-1 wrap">
            <!-- View & Danmaku Count -->
            <div
              text="$bew-text-2" rounded="$bew-radius"
              inline-block
            >
              <span v-if="view || viewStr">
                {{ view ? $t('common.view', { count: numFormatter(view) }, view) : `${viewStr}${$t('common.viewWithoutNum')}` }}
              </span>
              <template v-if="danmaku || danmakuStr">
                <span text-xs font-light mx-4px>•</span>
                <span>{{ danmaku ? $t('common.danmaku', { count: numFormatter(danmaku) }, danmaku) : `${danmakuStr}${$t('common.danmakuWithoutNum')}` }}</span>
              </template>
              <br>
            </div>
          </div>

          <div>
            <!-- Tag -->
            <span v-if="tag" class="video-tag">{{ tag }}</span>
            <span
              v-if="publishedTimestamp || capsuleText"
              class="px2 py1 rounded-$bew-radius"
              bg="$bew-fill-1"
              text="sm $bew-text-3"
            >
              {{ publishedTimestamp ? calcTimeSince(publishedTimestamp * 1000) : capsuleText?.trim() }}
            </span>

            <!-- Video type -->
            <span text="$bew-text-2" flex="~ items-center justify-center">
              <i v-if="type === 'vertical'" class="i-mingcute:cellphone-line" />
              <i v-if="type === 'bangumi'" class="i-mingcute:movie-line" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- skeleton -->
    <VideoCardSkeleton v-if="skeleton" />
  </div>
</template>

<style>
.bewly-video-card {
  --at-apply: of-hidden rounded-$bew-radius;
  /* box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.15); */
}

.video-tag {
  --at-apply: bg-$bew-theme-color-20;
  --at-apply: text-sm text-$bew-text-2 lh-6;
  --ay-apply: "rounded-$bew-radius";
}
</style>
