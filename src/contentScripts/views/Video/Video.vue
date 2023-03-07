<script lang="ts" setup>
import type { Ref, UnwrapNestedRefs } from 'vue'
import { useDateFormat } from '@vueuse/core'
import type { Comment, VideoInfo } from './types'
import { getCSRF, removeHttpFromUrl } from '~/utils'

const videoContent = ref() as Ref<HTMLElement>
// const commentContent = ref() as Ref<HTMLElement>
const danmukuContent = ref() as Ref<HTMLElement>
const recommendedContent = ref() as Ref<HTMLElement>
const videoEpisodeList = ref() as Ref<HTMLElement>
const videoInfo = reactive<VideoInfo | {}>({}) as UnwrapNestedRefs<VideoInfo>
const videoPlayerPreviousPosition = reactive<{ right: string; bottom: string }>({ right: '0', bottom: '0' })
const commentList = reactive<Comment[]>([])
const commentPageInfo = reactive<any>({})

onMounted(async () => {
  window.onload = () => {
    const videoPlayer = document.querySelector('#playerWrap') as HTMLElement
    if (videoContent.value && videoPlayer)
      videoContent.value.appendChild(videoPlayer)

    // const comment = document.querySelector('#comment') as HTMLElement
    // if (commentContent.value && comment)
    //   commentContent.value.appendChild(comment)

    const danmukuBox = document.querySelector('#danmukuBox') as HTMLElement
    if (danmukuContent.value && danmukuBox)
      danmukuContent.value.appendChild(danmukuBox)

    const recoList = document.querySelector('#reco_list') as HTMLElement
    if (recommendedContent.value && recoList)
      recommendedContent.value.appendChild(recoList)

    const multiPage = document.querySelector('#multi_page') as HTMLElement
    if (videoEpisodeList.value && multiPage)
      videoEpisodeList.value.appendChild(multiPage)

    // setupVideoSize()
    const videoPlayerContainer = document.querySelector('#bilibili-player .bpx-player-container') as HTMLElement
    videoPlayerContainer.dataset.screen = 'normal'
    videoPlayerContainer.style.right = '0'
    videoPlayerContainer.style.bottom = '0'

    // const app = document.querySelector('#app') as HTMLElement
    // app.innerHTML = ''
  }

  await getVideoInfo()
  getVideoComments()
})

onUnmounted(() => {
  window.onload = () => {}
})

async function getVideoInfo() {
  // e.g. https://www.bilibili.com/video/BV1vx4y1V7VD/
  const url = location.href
  // url.match(/video\/[0-9a-zA-Z]*/) = ['video/BV1vx4y1V7VD/', index: 25, input: 'https://www.bilibili.com/video/BV1vx4y1V7VD/', groups: undefined]
  // url.match(/video\/[0-9a-zA-Z]*/)[0] = 'video/BV1vx4y1V7VD/'
  const bvid = url.match(/video\/[0-9a-zA-Z]*\/?/)![0].split('/')[1]
  const res = await browser.runtime.sendMessage({ contentScriptQuery: 'getVideoInfo', bvid })
  if (res.code === 0)
    Object.assign(videoInfo, res.data)
}

// function setupVideoSize() {
//   const videoPlayerContainer = document.querySelector('#bilibili-player .bpx-player-container') as HTMLElement
//   const playerTopWrap = videoPlayerContainer.querySelector('.bpx-player-top-wrap') as HTMLElement
//   const playerTopIssue = videoPlayerContainer.querySelector('.bpx-player-top-issue') as HTMLElement
//   const playerStateWrap = videoPlayerContainer.querySelector('.bpx-player-state-wrap') as HTMLElement
//   const playerStatePlay = videoPlayerContainer.querySelector('.bpx-player-state-play') as HTMLElement
//   const playerToastWrap = videoPlayerContainer.querySelector('.bpx-player-toast-wrap') as HTMLElement
//   const playerControlWrap = videoPlayerContainer.querySelector('.bpx-player-control-wrap') as HTMLElement
//   const playerControlMask = videoPlayerContainer.querySelector('.bpx-player-control-mask') as HTMLElement

//   videoPlayerPreviousPosition.right = videoPlayerContainer.style.right ?? '0'
//   videoPlayerPreviousPosition.bottom = videoPlayerContainer.style.bottom ?? '0'

//   videoPlayerContainer.dataset.screen = 'normal'

//   window.onscroll = () => {
//     if (window.scrollY > videoPlayerContainer.offsetHeight) {
//       videoPlayerContainer.dataset.screen = 'mini'

//       playerTopWrap.style.display = 'none'
//       playerTopIssue.style.display = 'none'
//       playerStateWrap.style.display = 'none'
//       playerStatePlay.style.display = 'none'
//       playerToastWrap.style.display = 'none'
//       playerControlWrap.style.display = 'none'
//       playerControlMask.style.display = 'none'

//       if (videoPlayerPreviousPosition.right && videoPlayerPreviousPosition.bottom) {
//         videoPlayerContainer.style.right = structuredClone(videoPlayerPreviousPosition.right)
//         videoPlayerContainer.style.bottom = structuredClone(videoPlayerPreviousPosition.bottom)
//       }
//     }
//     else {
//       videoPlayerContainer.dataset.screen = 'normal'
//       videoPlayerPreviousPosition.right = structuredClone(videoPlayerContainer.style.right)
//       videoPlayerPreviousPosition.bottom = structuredClone(videoPlayerContainer.style.bottom)

//       console.log(videoPlayerPreviousPosition)

//       videoPlayerContainer.style.right = '0'
//       videoPlayerContainer.style.bottom = '0'

//       playerTopWrap.style.display = ''
//       playerTopIssue.style.display = ''
//       playerStateWrap.style.display = ''
//       playerStatePlay.style.display = ''
//       playerToastWrap.style.display = ''
//       playerControlWrap.style.display = ''
//       playerControlMask.style.display = ''
//     }
//   }
// }

function getVideoComments() {
  browser.runtime.sendMessage({
    contentScriptQuery: 'getVideoComments',
    csrf: getCSRF(),
    oid: videoInfo.aid,
    pn: 1,
  }).then((res) => {
    if (res.code === 0) {
      Object.assign(commentList, res.data.replies)
      Object.assign(commentPageInfo, res.data.page)
    }
  })
}
</script>

<template>
  <div class="video-page-wrapper" flex gap-6 m-auto>
    <main w="3/4" min-w-640px flex="~ col gap-6">
      <div ref="videoContent" bg="$bew-fill-1" />
      <section>
        <p text-2xl fw-600>
          {{ videoInfo.title }}
        </p>
      </section>
      <section bg="$bew-content-solid-1" rounded="$bew-radius" p-4>
        <section flex justify-between bg="$bew-fill-1" rounded="$bew-radius" p-2 mb-4>
          <div flex>
            <img
              v-if="videoInfo.owner?.face"
              :src="`${videoInfo.owner?.face}@60w_60h_1c`"
              :alt="videoInfo.owner.name" rounded="$bew-radius" aspect-square
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
      </section>

      <section>
        <h2 text-2xl bold mb-6>
          {{ commentPageInfo.acount }} Comments
        </h2>
        <ul>
          <li v-for="comment in commentList" :key="comment.rpid" flex="~ gap-6" mb-6>
            <div shrink-0>
              <img
                :src="`${removeHttpFromUrl(comment.member.avatar)}@60w_60h_1c`" alt=""
                aspect-square w-40px
                rounded="$bew-radius-half"
              >
            </div>
            <div>
              <h3 fw-600 lh-6 mb-2>
                {{ comment.member.uname }}
              </h3>
              <div>
                <p>{{ comment.content.message }}</p>
                <p>{{ useDateFormat(comment.ctime * 1000, 'YYYY-MM-DD HH:mm:ss') }}</p>
                <ul v-if="comment.replies" mt-6>
                  <li v-for="reply in comment.replies" :key="reply.rpid" flex="~ gap-6" mb-6>
                    <div shrink-0>
                      <img
                        :src="`${removeHttpFromUrl(reply.member.avatar)}@60w_60h_1c`" alt=""
                        aspect-square w-40px
                        rounded="$bew-radius-half"
                      >
                    </div>
                    <div>
                      <h3 fw-600 lh-6 mb-2>
                        {{ reply.member.uname }}
                      </h3>
                      <p>{{ reply.content.message }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </main>

    <aside w="1/4" min-w-400px>
      <section ref="danmukuContent" rounded="$bew-radius" shadow="$bew-shadow-1" mb-3 />
      <section ref="videoEpisodeList" rounded="$bew-radius" shadow="$bew-shadow-1" />
      <section ref="recommendedContent" />
    </aside>
  </div>
</template>

<style lang="scss" scoped>
.video-page-wrapper {
  width: 100%;
  min-width: 1040px;
}

@media screen and (max-height: 800px) {
  .video-page-wrapper {
    width: 80%;
  }
}

@media screen and (max-height: 600px) {
  .video-page-wrapper {
    width: 60%;
  }
}

@media screen and (max-height: 500px) {
  .video-page-wrapper {
    width: 40%;
  }
}
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

.video-page-game-card-small {
  display: none;
}
</style>
