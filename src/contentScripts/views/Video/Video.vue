<script lang="ts" setup>
import type { Ref, UnwrapNestedRefs } from 'vue'
import type { VideoInfoModel } from './types'
import { removeHttpFromUrl } from '~/utils'

const videoContent = ref() as Ref<HTMLElement>
const videoInfo = reactive<VideoInfoModel | {}>({}) as UnwrapNestedRefs<VideoInfoModel>

// document.body.removeChild(app)

onMounted(() => {
  // const app = document.querySelector('#app') as HTMLElement
  // app.innerHTML = ''
  getVideoInfo()

  const videoPlayer = document.querySelector('#playerWrap') as HTMLElement
  if (videoContent.value)
    videoContent.value.appendChild(videoPlayer)
})

function getVideoInfo() {
  // e.g. https://www.bilibili.com/video/BV1vx4y1V7VD/
  const url = location.href
  // url.match(/video\/[0-9a-zA-Z]*/) = ['video/BV1vx4y1V7VD/', index: 25, input: 'https://www.bilibili.com/video/BV1vx4y1V7VD/', groups: undefined]
  // url.match(/video\/[0-9a-zA-Z]*/)[0] = 'video/BV1vx4y1V7VD/'
  const bvid = url.match(/video\/[0-9a-zA-Z]*\/?/)![0].split('/')[1]
  browser.runtime.sendMessage({ contentScriptQuery: 'getVideoInfo', bvid })
    .then((res) => {
      if (res.code === 0)
        Object.assign(videoInfo, res.data)
    })
}
</script>

<template>
  <div flex gap-6>
    <main w="3/4" grid gap-6>
      <div ref="videoContent" w-full bg="$bew-fill-1" />
      <section>
        <p text-2xl fw-600>
          {{ videoInfo.title }}
        </p>
      </section>
      <section flex justify-between bg="$bew-content-solid-1" rounded="$bew-radius" p-4>
        <div flex>
          <img
            v-if="videoInfo.owner?.face"
            :src="`${videoInfo.owner?.face}@60w_60h_1c`"
            :alt="videoInfo.owner.name" rounded="$bew-radius-half" aspect-square
            w-40px mr-4
          >
          <div>
            <p text-xl fw-500>
              {{ videoInfo.owner?.name }}
            </p>
            <!-- <p>{{ videoInfo.owner }}</p> -->
          </div>
        </div>
      </section>
      <!-- <section>
        {{ JSON.stringify(videoInfo.desc_v2[0].raw_text) }}
      </section> -->
      <!-- <section v-html="videoInfo.desc_v2[0].raw_text" /> -->
    </main>
    <aside w="1/4" bg="$bew-fill-1" />
  </div>
</template>

<style lang="scss" scoped>

</style>

<style>
#bilibili-player {
  width: 100%;
}
</style>
