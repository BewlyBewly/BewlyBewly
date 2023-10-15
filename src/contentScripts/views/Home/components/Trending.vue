<script setup lang="ts">
import type { Ref } from 'vue'
import type { PopularVideoModel } from '../types'
import emitter from '~/utils/mitt'

const videoList = reactive<PopularVideoModel[]>([])
const isLoading = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const pn = ref<number>(1)

onMounted(async () => {
  await getFollowingAuthorVideos()

  emitter.off('reachBottom')
  emitter.on('reachBottom', async () => {
    if (!isLoading.value)
      await getFollowingAuthorVideos()
  })
})

onUnmounted(() => {
  emitter.off('reachBottom')
})

async function getFollowingAuthorVideos() {
  isLoading.value = true
  try {
    const response = await browser.runtime.sendMessage({
      contentScriptQuery: 'getPopularVideos',
      pn: pn.value++,
      ps: 30,
    })

    if (response.code === 0 && !response.data.no_more) {
      const resData = [] as PopularVideoModel[]

      response.data.list.forEach((item: PopularVideoModel) => {
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
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <div
      ref="containerRef"
      m="b-0 t-0" relative w-full h-full
      grid="~ cols-1 xl:cols-2 gap-4"
    >
      <VideoCard
        v-for="video in videoList"
        :id="Number(video.aid)"
        :key="video.aid"
        :duration="video.duration"
        :title="video.title"
        :desc="video.desc"
        :cover="video.pic"
        :author="video.owner.name"
        :author-face="video.owner.face"
        :mid="video.owner.mid"
        :view="video.stat.view"
        :danmaku="video.stat.danmaku"
        :published-timestamp="video.pubdate"
        :bvid="video.bvid"
        :tag="video.rcmd_reason.content"
        horizontal
        w-full
      />

      <!-- skeleton -->
      <template v-if="isLoading">
        <template v-for="item in 30" :key="item">
          <div

            :style="{
              display: 'flex',
              gap: '1.5rem',
            }"
            mb-10 pointer-events-none select-none
          >
            <!-- Cover -->
            <div :style="{ width: '250px' }" shrink-0 aspect-video h-fit bg="$bew-fill-4" rounded="$bew-radius" />
            <!-- Other Information -->
            <div
              :style="{
                width: '100%',
                marginTop: '0'
              }"
              flex="~ gap-4"
            >
              <div w-full>
                <div grid gap-2>
                  <div w-full h-5 bg="$bew-fill-3" />
                  <div w="3/4" h-5 bg="$bew-fill-3" />
                </div>
                <div grid gap-2 mt-4>
                  <div :style="{ width: '70%' }" h-4 bg="$bew-fill-2" />
                  <div w="80%" h-4 bg="$bew-fill-2" />
                </div>

                <div mt-4 flex>
                  <div v-if="item % 3 !== 0" mr-2 text="transparent sm" inline-block p="x-2 y-1" bg="$bew-fill-1" rounded-4>
                    hello world
                  </div>
                  <div text="transparent sm" inline-block p="x-2 y-1" bg="$bew-fill-1" rounded-4>
                    hello world
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>

    <Transition name="fade">
      <Loading v-if="isLoading" />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
</style>
