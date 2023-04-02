<script setup lang="ts">
// import { accessKey, language } from '~/logic/index'
import type { Video } from '~/components/VideoCard/types'

const videoList = reactive<Video[]>([])
const isLoading = ref<boolean>(false)
const needToLoginFirst = ref<boolean>(false)
let refreshIdx = 1

onMounted(() => {
  getRecommendVideos()

  window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 20) {
      if (isLoading.value)
        return

      getRecommendVideos()
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
      const resData = [] as Video[]

      response.data.item.forEach((item: Video) => {
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

    <!-- skeleton -->
    <template v-for="item in 30" :key="item">
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
