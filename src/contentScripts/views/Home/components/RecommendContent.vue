<script setup lang="ts">
import type { AppVideoModel, VideoModel } from './types'
import { accessKey, settings } from '~/logic'

const videoList = reactive<VideoModel[]>([])
const appVideoList = reactive<AppVideoModel[]>([])
const isLoading = ref<boolean>(false)
const needToLoginFirst = ref<boolean>(false)
let refreshIdx = 1

watch(() => settings.value.recommendationMode, (newValue, oldValue) => {
  videoList.length = 0
  appVideoList.length = 0
  if (newValue === 'web') { getRecommendVideos() }
  else {
    for (let i = 0; i < 3; i++)
      getAppRecommendVideos()
  }
})

onMounted(async () => {
  // Delay by 0.2 seconds to obtain the `settings.value.recommendationMode` value
  // otherwise the `settings.value.recommendationMode` value will be undefined
  // i have no idea to fix that...
  setTimeout(() => {
    if (settings.value.recommendationMode === 'web') { getRecommendVideos() }
    else {
      for (let i = 0; i < 3; i++)
        getAppRecommendVideos()
    }
  }, 200)

  window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 20) {
      if (isLoading.value)
        return

      if (settings.value.recommendationMode === 'web') { getRecommendVideos() }
      else {
        for (let i = 0; i < 3; i++)
          getAppRecommendVideos()
      }
    }
  }
})

onUnmounted(() => {
  // remove the global window.onscroll event
  window.onscroll = () => {}
})

async function getRecommendVideos() {
  isLoading.value = true
  try {
    const response = await browser.runtime.sendMessage({
      contentScriptQuery: 'getRecommendVideos',
      refreshIdx: refreshIdx++,
    })

    if (response.code === 0) {
      const resData = [] as VideoModel[]

      response.data.item.forEach((item: VideoModel) => {
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
  }
}

async function getAppRecommendVideos() {
  isLoading.value = true
  try {
    const response = await browser.runtime.sendMessage({
      contentScriptQuery: 'getAppRecommendVideos',
      accessKey: accessKey.value,
      idx: 1,
    })

    if (response.code === 0) {
      const resData = [] as AppVideoModel[]

      response.data.forEach((item: AppVideoModel) => {
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
  }
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}
</script>

<template>
  <Empty v-if="needToLoginFirst" mt-6 :description="$t('common.please_log_in_first')">
    <Button type="primary" @click="jumpToLoginPage()">
      {{ $t('common.login') }}
    </Button>
  </Empty>
  <div
    v-else
    m="b-0 t-0"
    grid="~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-4"
  >
    <template v-if="settings.recommendationMode === 'web'">
      <VideoCard
        v-for="video in videoList"
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
      />
    </template>
    <template v-else>
      <VideoCard
        v-for="(video, index) in appVideoList"
        :key="index"
        :duration="video.duration ?? 0"
        :title="video.title"
        :cover="video.cover ?? ''"
        :author="video.name ?? ''"
        :author-face="video.face ?? ''"
        :mid="video.mid ?? 0"
        :view="video.play ?? 0"
        :danmaku="video.danmaku ?? 0"
        :published-timestamp="video.ctime ?? 0"
        :aid="Number(video.param)"
      />
    </template>

    <!-- skeleton -->
    <template v-for="item in (settings.recommendationMode === 'web' ? 30 : 10)" :key="item">
      <div
        v-if="isLoading"
        mb-8 pointer-events-none select-none
      >
        <div aspect-video bg="$bew-fill-4" rounded="$bew-radius" />
        <div flex mt-4>
          <div m="r-4" w="48px" h="48px" rounded="$bew-radius" bg="$bew-fill-4" shrink-0 />
          <div w-full>
            <div grid gap-2>
              <div w-full h-5 bg="$bew-fill-3" />
              <div w="3/4" h-5 bg="$bew-fill-3" />
            </div>
            <div grid gap-2 mt-4>
              <div w="50%" h-4 bg="$bew-fill-2" />
              <div w="80%" h-4 bg="$bew-fill-2" />
            </div>
            <div text="transparent sm" inline-block mt-4 p="x-2 y-1" bg="$bew-fill-1" rounded-4>
              hello world
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <Transition name="fade">
    <Loading v-if="isLoading" />
  </Transition>
</template>

<style lang="scss" scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: opacity 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  display: none;
}
</style>
