<script lang="ts">
import { accessKey, language } from '~/logic/index'
import { calcCurrentTime, calcTimeSince, numFormatter } from '~/utils'
import { LanguageType } from '~/enums/appEnums'

export default defineComponent({
  data() {
    return {
      videoList: [] as any[],
      isLoading: true,
      numFormatter,
      calcTimeSince,
      calcCurrentTime,
      MAX_LIMIT: 150 as const,
      accessKey,
      LanguageType,
      language,
    }
  },
  mounted() {
    // need to wait for accessKey to be loaded, otherwise the accessKey will be undefined
    setTimeout(() => {
      this.getRecommendVideos()
      this.getRecommendVideos()
    }, 2000)

    window.onscroll = async () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        if (!this.isLoading)
          return

        if (this.videoList.length <= this.MAX_LIMIT - 20) {
          await this.getRecommendVideos(
            this.videoList[this.videoList.length - 1]?.idx,
          )
          await this.getRecommendVideos(
            this.videoList[this.videoList.length - 1]?.idx,
          )
        }
        else {
          this.isLoading = false
        }
      }
    }
  },
  methods: {
    async getRecommendVideos(idx?: number) {
      const response = await browser.runtime.sendMessage({
        contentScriptQuery: 'getRecommendVideos',
        idx,
        accessKey: this.accessKey,
      })

      if (response.code === 0) {
        const resData = [] as any[]
        response.data.forEach((item: any) => {
          // remove ad videos
          if (!item.ad_cb)
            resData.push(item)
        })

        // when videoList has length property, it means it is the first time to load
        if (!this.videoList.length) {
          this.videoList = resData
        }
        else {
          // else we concat the new data to the old data
          this.videoList = this.videoList.concat(resData)
        }
      }
    },
    onRefresh() {
      this.isLoading = true
      this.videoList = []
    },
    onEnter(el: Element, done: () => void) {
      const element = el as HTMLElement
      element.style.transitionDelay = '0.1s'
      done()
    },
  },
})
</script>

<template>
  <div
    m="lg:x-22 <lg:x-16 b-0 t-0"
    grid="~ xl:cols-4 lg:cols-3 md:cols-2 gap-4"
  >
    <TransitionGroup name="list" @enter="onEnter">
      <VideoCard
        v-for="(video) in videoList"
        :key="video.idx"
        :cover="video.cover"
        :duration="video.duration"
        :mid="video.mid"
        :title="video.title"
        :author-avatar="video.face"
        :param="video.param"
        :view-count="video.play"
        :channel-name="video.name"
        :ctime="video.ctime"
        :dislike-reasons="video.dislike_reasons"
        :goto="video.goto"
        :tid="video.tid"
        :tag="video.tag"
      />
    </TransitionGroup>
  </div>

  <loading v-if="isLoading" />

  <div
    v-if="!isLoading"
    style="height: 100px"
    w="full"
    p="y-8"
    flex="~"
    items="center"
    justify="center"
  >
    <button
      style="box-shadow: var(--bew-shadow-1)"
      bg="!$bew-theme-color"
      w="60px"
      h="60px"
      text="white 2xl"
      rounded="full"
      flex="~"
      justify="center"
      items="center"
      @click="onRefresh"
    >
      <tabler:refresh />
    </button>
  </div>
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
