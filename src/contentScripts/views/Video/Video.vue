<script lang="ts" setup>
import type { Ref, UnwrapNestedRefs } from 'vue'
import type { VideoInfoModel } from './types'
import { removeHttpFromUrl } from '~/utils'

const videoContent = ref() as Ref<HTMLElement>
const danmukuContent = ref() as Ref<HTMLElement>
const videoInfo = reactive<VideoInfoModel | {}>({}) as UnwrapNestedRefs<VideoInfoModel>

// document.body.removeChild(app)

onMounted(() => {
  getVideoInfo()

  nextTick(() => {
    const videoPlayer = document.querySelector('#playerWrap') as HTMLElement
    if (videoContent.value)
      videoContent.value.appendChild(videoPlayer)

    const danmukuBox = document.querySelector('#danmukuBox') as HTMLElement
    if (danmukuContent.value)
      danmukuContent.value.appendChild(danmukuBox)

    const app = document.querySelector('#app') as HTMLElement
    app.innerHTML = ''
  })
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

function changeUrl() {
  location.href = 'https://www.bilibili.com/video/BV1bT411D7aq/?spm_id_from=333.1007.0.0'
  // history.pushState({}, document.title, 'https://www.bilibili.com/video/BV1bT411D7aq/?spm_id_from=333.1007.0.0')
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
            w-40px mr-4 shrink-0
          >
          <div>
            <p text-xl fw-500>
              {{ videoInfo.owner?.name }}
            </p>
            <!-- <Button @click="changeUrl">
              click me
            </Button> -->
            <!-- <p>{{ videoInfo.owner }}</p> -->
          </div>
        </div>
      </section>
      <section style="white-space: pre-wrap" v-html="(videoInfo.desc_v2 ?? [''])[0].raw_text" />

      <!-- <section v-html="videoInfo.desc_v2![0].raw_text" /> -->
    </main>
    <aside w="1/4">
      <div ref="danmukuContent" rounded="$bew-radius" shadow="$bew-shadow-1" />
    </aside>
  </div>
</template>

<style lang="scss" scoped>

</style>

<style lang="scss">
#bilibili-player {
  width: 100%;
}

#bilibili-player-placeholder {
  --at-apply: shadow-$bew-shadow-2
}

.bpx-player-container {
  --at-apply: shadow-none;
}

.bpx-player-sending-area:before {
  background-color: var(--bew-fill-3)
}

.bpx-player-sending-bar .bpx-player-video-inputbar{
  background-color: var(--bew-fill-1)
}

#danmukuBox .bpx-player-auxiliary {
  --bpx-aux-header-bg: var(--bew-content-solid-1);
  --bpx-aux-header-font: var(--bew-text-1);
  --bpx-aux-content-bg: var(--bew-content-solid-1);
  --bpx-aux-content-font1: var(--bew-text-2);
  --bpx-aux-content-font2: var(--bew-text-3);
}
</style>
