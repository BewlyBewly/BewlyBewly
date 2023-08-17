<script setup lang="ts">
import type { Ref } from 'vue'
import type { AppVideoModel, VideoModel } from './types'
import emitter from '~/utils/mitt'
import { accessKey, settings } from '~/logic'

const videoList = reactive<VideoModel[]>([])
const appVideoList = reactive<AppVideoModel[]>([])
const isLoading = ref<boolean>(false)
const needToLoginFirst = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
let refreshIdx = 1

watch(() => settings.value.recommendationMode, (newValue, oldValue) => {
  videoList.length = 0
  appVideoList.length = 0
  if (newValue === 'web') {
    getRecommendVideos()
  }
  else {
    for (let i = 0; i < 3; i++)
      getAppRecommendVideos()
  }
})

onMounted(async () => {
  // Delay by 0.2 seconds to obtain the `settings.value.recommendationMode` value
  // otherwise the `settings.value.recommendationMode` value will be undefined
  // i have no idea to fix that...
  setTimeout(async () => {
    if (settings.value.recommendationMode === 'web') {
      getRecommendVideos()
    }
    else {
      for (let i = 0; i < 3; i++)
        await getAppRecommendVideos()
    }
  }, 200)

  emitter.off('reachBottom')
  emitter.on('reachBottom', async () => {
    if (!isLoading.value) {
      if (settings.value.recommendationMode === 'web') {
        getRecommendVideos()
      }
      else {
        for (let i = 0; i < 3; i++)
          await getAppRecommendVideos()
      }
    }
  })
})

onUnmounted(() => {
  emitter.off('reachBottom')
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
    ref="containerRef"
    m="b-0 t-0"
    grid="~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-4"
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
      />
    </template>
    <template v-else>
      <VideoCard
        v-for="(video, index) in appVideoList"
        :id="Number(video.param)"
        :key="index"
        :duration="video.duration"
        :title="video.title"
        :cover="video.cover"
        :author="video.name"
        :author-face="video.face"
        :mid="video.mid"
        :view="video.play"
        :danmaku="video.danmaku"
        :published-timestamp="video.ctime"
        :aid="Number(video.param)"
      />
    </template>

    <!-- skeleton -->
    <template v-for="item in 30" :key="item">
      <div
        v-if="isLoading"
        mb-8 pointer-events-none select-none
      >
        <div aspect-video bg="$bew-fill-4" rounded="$bew-radius" />
        <div flex mt-4>
          <div m="r-4" w="40px" h="40px" rounded="1/2" bg="$bew-fill-4" shrink-0 />
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
</style>
