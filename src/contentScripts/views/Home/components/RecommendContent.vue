<script setup lang="ts">
import { accessKey, language } from '~/logic/index'
import { calcCurrentTime, calcTimeSince, numFormatter } from '~/utils'
import { LanguageType } from '~/enums/appEnums'
import type { Video } from '~/components/VideoCard/types'

const videoList = reactive<Video[]>([])
const isLoading = ref<boolean>(false)
let refreshIdx = 1

onMounted(() => {
  getRecommendVideos(refreshIdx)

  window.onscroll = async () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 20) {
      if (isLoading.value)
        return

      isLoading.value = true
      refreshIdx++
      await getRecommendVideos(refreshIdx)
      isLoading.value = false
    }
  }
})

async function getRecommendVideos(idx?: number) {
  const response = await browser.runtime.sendMessage({
    contentScriptQuery: 'getRecommendVideos',
    refreshIdx: idx,
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
}

function onEnter(el: Element, done: () => void) {
  const element = el as HTMLElement
  element.style.transitionDelay = '0.1s'
  done()
}
</script>

<template>
  <div
    m="b-0 t-0"
    grid="~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-4"
  >
    <TransitionGroup name="list" @enter="onEnter">
      <VideoCard
        v-for="video in videoList"
        :key="video.id"
        :video-data="video"
      />
    </TransitionGroup>
  </div>

  <loading v-if="isLoading" />
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
