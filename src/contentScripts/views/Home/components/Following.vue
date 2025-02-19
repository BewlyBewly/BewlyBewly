<script setup lang="ts">
import type { Ref } from 'vue'

import type { Author } from '~/components/VideoCard/types'
import { useBewlyApp } from '~/composables/useAppProvider'
import type { GridLayoutType } from '~/logic'
import { settings } from '~/logic'
import type { FollowingLiveResult, List as FollowingLiveItem } from '~/models/live/getFollowingLiveList'
import type { DataItem as MomentItem, MomentResult } from '~/models/moment/moment'
import api from '~/utils/api'

// https://github.com/starknt/BewlyBewly/blob/fad999c2e482095dc3840bb291af53d15ff44130/src/contentScripts/views/Home/components/ForYou.vue#L16
interface VideoElement {
  uniqueId: string // 用于标识一条视频（无法用来区分UP主联合投稿）
  bvid?: string // 用于标识UP主联合投稿视频
  item?: MomentItem
  authorList?: Author[]
}

interface LiveVideoElement {
  uniqueId: string
  item?: FollowingLiveItem
}

const props = defineProps<{
  gridLayout: GridLayoutType
}>()

const emit = defineEmits<{
  (e: 'beforeLoading'): void
  (e: 'afterLoading'): void
}>()

const gridClass = computed((): string => {
  if (props.gridLayout === 'adaptive')
    return 'grid-adaptive'
  if (props.gridLayout === 'twoColumns')
    return 'grid-two-columns'
  return 'grid-one-column'
})

const videoList = ref<VideoElement[]>([])
/**
 * Get all livestreaming videos of followed users
 */
const livePage = ref<number>(1)
const liveVideoList = ref<LiveVideoElement[]>([])
const isLoading = ref<boolean>(false)
const needToLoginFirst = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const offset = ref<string>('')
const updateBaseline = ref<string>('')
const noMoreContent = ref<boolean>(false)
const { handleReachBottom, handlePageRefresh, haveScrollbar } = useBewlyApp()

onMounted(() => {
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
  liveVideoList.value.length = 0
  livePage.value = 1
  videoList.value.length = 0
  noMoreContent.value = false

  if (settings.value.followingTabShowLivestreamingVideos)
    getLiveVideoList()
  await getData()
}

async function getData() {
  emit('beforeLoading')
  isLoading.value = true

  try {
    for (let i = 0; i < 3; i++)
      await getFollowedUsersVideos()
  }
  finally {
    isLoading.value = false
    emit('afterLoading')
  }
}

async function getLiveVideoList() {
  let lastLiveVideoListLength = liveVideoList.value.length
  try {
    const response: FollowingLiveResult = await api.live.getFollowingLiveList({
      page: livePage.value,
      page_size: 9,
    })

    if (response.code === -101) {
      noMoreContent.value = true
      needToLoginFirst.value = true
      return
    }

    if (response.code === 0) {
      if (response.data.list.length < 9)
        noMoreContent.value = true

      livePage.value++

      const resData = [] as FollowingLiveItem[]

      response.data.list.forEach((item: FollowingLiveItem) => {
        // 只保留正在直播的
        if (item.live_status === 1)
          resData.push(item)
      })

      // when videoList has length property, it means it is the first time to load
      if (!liveVideoList.value.length) {
        liveVideoList.value = resData.map(item => ({ uniqueId: `${item.roomid}`, item }))
      }
      else {
        resData.forEach((item) => {
          liveVideoList.value[lastLiveVideoListLength++] = {
            uniqueId: `${item.roomid}`,
            item,
          }
        })
      }
    }
  }
  finally {
    // 當直播列表結果大於9時（9是返回的列表數量）且如果最后一支影片還是正在直播，則繼續獲取
    if (liveVideoList.value.length > 9 && liveVideoList.value[liveVideoList.value.length - 1]?.item?.live_status === 1) {
      getLiveVideoList()
    }
  }
}

async function getFollowedUsersVideos() {
  if (noMoreContent.value)
    return

  if (offset.value === '0') {
    noMoreContent.value = true
    return
  }

  try {
    // 如果 videoList 不是空的，获取最后一个真实视频的 uniqueId 和 bvid
    let lastVideo: VideoElement | null = videoList.value.length > 0 ? videoList.value.slice(-1)[0] : null
    const lastUniqueId = lastVideo ? lastVideo.uniqueId : ''
    let lastBvid = lastVideo ? lastVideo.bvid : ''

    let i = 0
    // https://github.com/starknt/BewlyBewly/blob/fad999c2e482095dc3840bb291af53d15ff44130/src/contentScripts/views/Home/components/ForYou.vue#L208
    const pendingVideos: VideoElement[] = Array.from({ length: 30 }, () => ({
      uniqueId: `unique-id-${(videoList.value.length || 0) + i++})}`,
    } satisfies VideoElement))
    let lastVideoListLength = videoList.value.length
    videoList.value.push(...pendingVideos)

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
      if (!videoList.value.length) {
        videoList.value = resData.map(item => ({ uniqueId: `${item.id_str}`, item }))
      }
      else {
        resData.forEach((item, index) => {
          const currentUniqueId = `${item.id_str}`
          const currentBvid = item.modules.module_dynamic.major.archive?.bvid
          const author: Author = {
            name: item.modules.module_author.name,
            authorFace: item.modules.module_author.face,
            mid: item.modules.module_author.mid,
          }
          const currentVideo: VideoElement = {
            uniqueId: currentUniqueId,
            bvid: currentBvid,
            item,
            authorList: [author],
          }

          if (index === 0 && currentUniqueId === lastUniqueId) {
            // 重复视频
            return
          }
          else if (currentBvid === lastBvid) {
            // UP主联合投稿视频

            // 当联合投稿的数据是分两次获取时，有概率会出现多个重复内容
            // 遍历authorList里面每个up的mid值，如果不存在再添加up信息
            if (!lastVideo?.authorList?.some(existingAuthor => existingAuthor.mid === author.mid)) {
              lastVideo?.authorList?.push(author)
            }
            return
          }
          else {
            // UP主个人投稿视频
            videoList.value[lastVideoListLength++] = currentVideo
          }

          lastVideo = currentVideo
          lastBvid = currentBvid
        })
      }

      if (!await haveScrollbar() && !noMoreContent.value) {
        getFollowedUsersVideos()
      }
    }
    else if (response.code === -101) {
      needToLoginFirst.value = true
    }
  }
  finally {
    videoList.value = videoList.value.filter(video => video.item)
  }
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}

defineExpose({ initData })
</script>

<template>
  <div>
    <Empty v-if="needToLoginFirst" mt-6 :description="$t('common.please_log_in_first')">
      <Button type="primary" @click="jumpToLoginPage()">
        {{ $t('common.login') }}
      </Button>
    </Empty>
    <div
      v-else
      ref="containerRef"
      m="b-0 t-0" relative w-full h-full
      :class="gridClass"
    >
      <template v-if="settings.followingTabShowLivestreamingVideos">
        <VideoCard
          v-for="video in liveVideoList"
          :key="video.uniqueId"
          :skeleton="!video.item"
          :video="video.item ? {
            // id: Number(video.item.modules.module_dynamic.major.archive?.aid),
            title: `${video.item.title}`,
            cover: `${video.item.room_cover}`,
            author: {
              name: video.item.uname,
              authorFace: video.item.face,
              mid: video.item.uid,
            },
            viewStr: video.item.text_small,
            tag: video.item.area_name_v2,
            roomid: video.item.roomid,
            liveStatus: video.item.live_status,
          } : undefined"
          type="live"
          :show-watcher-later="false"
          :horizontal="gridLayout !== 'adaptive'"
        />
      </template>

      <VideoCard
        v-for="video in videoList"
        :key="video.uniqueId"
        :skeleton="!video.item"
        :video="video.item ? {
          id: Number(video.item.modules.module_dynamic.major.archive?.aid),
          durationStr: video.item.modules.module_dynamic.major.archive?.duration_text,
          title: `${video.item.modules.module_dynamic.major.archive?.title}`,
          cover: `${video.item.modules.module_dynamic.major.archive?.cover}`,
          author: video.authorList,
          viewStr: video.item.modules.module_dynamic.major.archive?.stat.play,
          danmakuStr: video.item.modules.module_dynamic.major.archive?.stat.danmaku,
          capsuleText: video.item.modules.module_author.pub_time,
          bvid: video.item.modules.module_dynamic.major.archive?.bvid,
          badge: video.item.modules.module_dynamic.major.archive?.badge.text !== '投稿视频' ? {
            bgColor: video.item.modules.module_dynamic.major.archive?.badge.bg_color,
            color: video.item.modules.module_dynamic.major.archive?.badge.color,
            iconUrl: video.item.modules.module_dynamic.major.archive?.badge.icon_url,
            text: video.item.modules.module_dynamic.major.archive?.badge.text,
          } : undefined,
        } : undefined"
        show-preview
        :horizontal="gridLayout !== 'adaptive'"
      />
    </div>

    <!-- no more content -->
    <Empty v-if="noMoreContent && !needToLoginFirst" class="pb-4" :description="$t('common.no_more_content')" />
  </div>
</template>

<style lang="scss" scoped>
.grid-adaptive {
  --uno: "grid 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 sm:cols-1 cols-1 gap-5";
}

.grid-two-columns {
  --uno: "grid cols-1 xl:cols-2 gap-4";
}

.grid-one-column {
  --uno: "grid cols-1 gap-4";
}
</style>
