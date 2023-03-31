<script setup lang="ts">
import { accessKey, language } from '~/logic/index'
import { calcCurrentTime, calcTimeSince, numFormatter } from '~/utils'
import { LanguageType } from '~/enums/appEnums'
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

function onEnter(el: Element, done: () => void) {
  const element = el as HTMLElement
  element.style.transitionDelay = '0.1s'
  done()
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
    <TransitionGroup name="list" @enter="onEnter">
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
    </TransitionGroup>
  </div>

  <Loading v-if="isLoading" />
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
