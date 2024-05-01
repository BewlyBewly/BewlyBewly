<script lang="ts" setup>
import type { Ref, UnwrapNestedRefs } from 'vue'
import { useDateFormat } from '@vueuse/core'
import type { Comment, UserCardInfo, VideoInfo } from './types'
import { getCSRF, removeHttpFromUrl } from '~/utils/main'
import { calcTimeSince, numFormatter } from '~/utils/dataFormatter'

const api = useApiClient()
const videoContent = ref() as Ref<HTMLElement>
// const commentContent = ref() as Ref<HTMLElement>
const danmukuContent = ref() as Ref<HTMLElement>
const recommendedContent = ref() as Ref<HTMLElement>
const videoEpisodeList = ref() as Ref<HTMLElement>
const videoInfo = reactive<VideoInfo | NonNullable<unknown>>({}) as UnwrapNestedRefs<VideoInfo>
const userCardInfo = reactive<UserCardInfo | NonNullable<unknown>>({}) as UnwrapNestedRefs<UserCardInfo>
// const videoPlayerPreviousPosition = reactive<{ right: string; bottom: string }>({ right: '0', bottom: '0' })
const commentList = reactive<Comment[]>([])
const commentPageInfo = reactive<any>({})

onMounted(async () => {
  window.onload = () => {
    nextTick(async () => {
      const videoPlayer = document.querySelector('#playerWrap') as HTMLElement
      if (videoContent.value && videoPlayer)
        videoContent.value.appendChild(videoPlayer)

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
      // const videoPlayerContainer = document.querySelector('#bilibili-player .bpx-player-container') as HTMLElement
      // videoPlayerContainer.dataset.screen = 'normal'
      // videoPlayerContainer.style.right = '0'
      // videoPlayerContainer.style.bottom = '0'

      const app = document.querySelector('#app') as HTMLElement
      app.innerHTML = ''

      await getVideoInfo()
      getVideoComments()
    })
  }
})

// watch(() => 'location.href', async (newValue, oldValue) => {
//   console.log('location change')

//   await getVideoInfo()
//   getVideoComments()
// }, { deep: true })

onUnmounted(() => {
  window.onload = () => {}
})

async function getVideoInfo() {
  // e.g. https://www.bilibili.com/video/BV1vx4y1V7VD/
  const url = location.href
  // url.match(/video\/[0-9a-zA-Z]*/) = ['video/BV1vx4y1V7VD/', index: 25, input: 'https://www.bilibili.com/video/BV1vx4y1V7VD/', groups: undefined]
  // url.match(/video\/[0-9a-zA-Z]*/)[0] = 'video/BV1vx4y1V7VD/'
  const videoId = url.match(/video\/[0-9a-zA-Z]*\/?/)![0].split('/')[1]
  const isBV = videoId.startsWith('BV')

  let res
  if (isBV)
    res = await api.video.getVideoInfo({ videoId })
  else
    res = await api.video.getVideoInfo({ aid: videoId.replace('av', '') })
  if (res.code === 0) {
    Object.assign(videoInfo, res.data.View)
    Object.assign(userCardInfo, res.data.Card)
  }
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
  api.video.getVideoComments({
    csrf: getCSRF(),
    oid: videoInfo.aid,
    pn: 1,
    sort: 1,
  }).then((res) => {
    if (res.code === 0) {
      Object.assign(commentList, res.data.replies)
      Object.assign(commentPageInfo, res.data.page)
    }
  })
}

function setupCommentEmote(content: string, emote: any) {
  let result = `${content}`

  if (!emote || Object.keys(emote).length === 0)
    return content

  Object.keys(emote).forEach((key) => {
    if (emote[key].meta.size === 1) {
      result = result.replaceAll(key, `
      <img 
        src="${removeHttpFromUrl(emote[key].url)}@40w_40h.webp" width="20" height="20" 
        style="vertical-align: text-bottom; display: inline" 
      />`)
    }
    else {
      result = result.replaceAll(key, `
      <img 
        src="${removeHttpFromUrl(emote[key].url)}@112w_112h.webp" width="50" height="50" 
        style="vertical-align: text-bottom; display: inline" 
      />`)
    }
  })
  return result
}
</script>

<template>
  <div class="video-page-wrapper" flex gap-6 m-auto>
    <main w="3/4" min-w-640px flex="~ col gap-4">
      <div ref="videoContent" bg="$bew-fill-1" />
      <!-- <DPlayer /> -->
      <section>
        <p text-2xl fw-600>
          {{ videoInfo.title }}
        </p>
        <p text="$bew-text-2" flex gap-4 lh-6>
          <span>{{ $t('common.view', { count: videoInfo.stat?.view }) }}</span>
          <span>{{ videoInfo.stat?.danmaku }} danmaku</span>
        </p>
      </section>
      <section bg="$bew-content-solid-1" rounded="$bew-radius" p-4>
        <section
          flex justify-between bg="$bew-fill-1" rounded="$bew-radius" p-2
          mb-4 relative z-1
          overflow-hidden
        >
          <img
            v-if="videoInfo.owner?.face"
            :src="`${videoInfo.owner?.face}@60w_60h_1c`"
            :alt="videoInfo.owner.name" object-cover
            blur-lg pointer-events-none z--1
            w-full h-full pos="absolute top-0 left-0"
            opacity-30
          >
          <div flex relative z-1>
            <img
              v-if="videoInfo.owner?.face"
              :src="`${videoInfo.owner?.face}@60w_60h_1c`"
              :alt="videoInfo.owner.name" rounded="$bew-radius" aspect-square
              w-40px mr-4 shrink-0
            >
            <div>
              <p text-base fw-500>
                {{ videoInfo.owner?.name }}
              </p>
              <p text="sm $bew-text-2">
                {{ numFormatter(userCardInfo.follower) }} subscribers
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

      <!-- Comments -->
      <section>
        <h2 text-2xl bold mb-6>
          {{ commentPageInfo.acount }} Comments
        </h2>
        <ul>
          <li
            v-for="comment in commentList" :key="comment.rpid" flex="~ gap-4" mb-6
          >
            <div shrink-0>
              <img
                :src="`${removeHttpFromUrl(comment.member.avatar)}@60w_60h_1c`" alt=""
                aspect-square w-40px
                rounded="$bew-radius"
              >
            </div>
            <div w-full>
              <!-- username & sending time -->
              <div mb-2 lh-6 flex gap-2 items-center>
                <h3 fw-600>
                  {{ comment.member.uname }}
                </h3>
                <div class="group">
                  <span text="$bew-text-2" cursor-pointer v-text="calcTimeSince(comment.ctime * 1000)" />
                  <span
                    bg="black dark:white" text="white dark:black sm"
                    p="x-2 y-1" ml-2 rounded-8 pointer-events-none
                    opacity="0 group-hover:100" duration-300
                    v-text="useDateFormat(comment.ctime * 1000, 'YYYY-MM-DD HH:mm:ss').value"
                  />
                </div>
              </div>

              <span v-html="setupCommentEmote(comment.content.message, comment.content.emote)" />

              <div>
                <ul v-if="comment.replies" mt-6>
                  <li
                    v-for="reply in comment.replies" :key="reply.rpid" flex="~ gap-4" mb-6
                  >
                    <div shrink-0>
                      <img
                        :src="`${removeHttpFromUrl(reply.member.avatar)}@60w_60h_1c`" alt=""
                        aspect-square w-30px
                        rounded="$bew-radius"
                      >
                    </div>
                    <div>
                      <!-- username & sending time -->
                      <div mb-2 lh-6 flex gap-2 items-center>
                        <h3 fw-600>
                          {{ reply.member.uname }}
                        </h3>
                        <div class="group">
                          <span text="$bew-text-2" cursor-pointer v-text="calcTimeSince(reply.ctime * 1000)" />
                          <span
                            bg="black dark:white" text="white dark:black sm"
                            p="x-2 y-1" ml-2 rounded-8 pointer-events-none
                            opacity="0 group-hover:100"
                            duration-300
                            v-text="useDateFormat(reply.ctime * 1000, 'YYYY-MM-DD HH:mm:ss').value"
                          />
                        </div>
                      </div>

                      <span v-html="setupCommentEmote(reply.content.message, reply.content.emote)" />
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
