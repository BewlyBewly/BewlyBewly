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
    gotoChannel(mid: number) {
      window.open(`//space.bilibili.com/${mid}`)
    },
    gotoVideo(uri: string) {
      window.open(`/video/av${uri.split('/')[3]}`)
    },
    submitDislike(
      videoIndex: number,
      reasonID: number,
      goto: string,
      id: string,
      mid: string,
      rid: string,
      tagID: string,
    ) {
      browser.runtime
        .sendMessage({
          contentScriptQuery: 'submitDislike',
          accessKey: this.accessKey,
          reasonID,
          goto,
          id,
          mid,
          rid,
          tagID,
        })
        .then((res) => {
          if (res.code === 0) {
            this.videoList[videoIndex].isDislike = true
            this.videoList[videoIndex].selectedReasonID = reasonID
          }
        })
    },
    undoDislike(
      videoIndex: number,
      reasonID: number,
      goto: string,
      id: string,
      mid: string,
      rid: string,
      tagID: string,
    ) {
      browser.runtime
        .sendMessage({
          contentScriptQuery: 'undoDislike',
          accessKey: this.accessKey,
          reasonID,
          goto,
          id,
          mid,
          rid,
          tagID,
        })
        .then((res) => {
          if (res.code === 0) {
            this.videoList[videoIndex].isDislike = false
            this.videoList[videoIndex].selectedReasonID = undefined
            this.videoList[videoIndex].openControl = false
          }
        })
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
    <transition-group name="list" @enter="onEnter">
      <div
        v-for="(video, index) in videoList"
        :key="video.idx"
        :data-index="index"
        class="video-card"
        :class="video.isDislike ? 'is-dislike' : ''"
      >
        <!-- Undo control -->
        <template v-if="video.isDislike">
          <div
            id="dislike-control"
            pos="absolute top-0 left-0"
            w="full"
            h="auto"
            flex="~ col"
            justify="center"
            align="content-center"
            border="solid $bew-fill-1"
            text="$bew-text-3 sm center"
            rounded="$bew-radius"
            style="aspect-ratio: 16/9"
          >
            {{ $t('home.video_removed') }}
            <button
              text="$bew-theme-color base"
              font="bold"
              m="t-4"
              @click="
                undoDislike(
                  index,
                  video.selectedReasonID,
                  video.goto,
                  video.param,
                  video.mid,
                  video.tid,
                  video.tag.tag_id,
                )
              "
            >
              {{ $t('common.undo') }}
            </button>
          </div>
        </template>
        <template v-else>
          <a :href="`/video/av${video.uri.split('/')[3]}`" target="_blank">
            <div class="thumbnail">
              <div class="duration">{{ calcCurrentTime(video.duration) }}</div>
              <div
                class="overflow-hidden w-full relative rounded-$bew-radius z-1"
                style="aspect-ratio: 16/9"
              >
                <img
                  class="cover"
                  :src="`${video.cover.replace('http:', '')}@672w_378h_1c`"
                  loading="lazy"
                >
              </div>
              <img
                class="cover-shadow"
                :src="`${video.cover.replace('http:', '')}@672w_378h_1c`"
                loading="lazy"
              >
            </div>
          </a>
          <div class="detail">
            <div class="flex">
              <a
                class="avatar"
                cursor="pointer"
                @click="gotoChannel(video.mid)"
              >
                <img
                  :src="`${`${video.face}`.replace('http:', '')}@60w_60h_1c`"
                  width="48"
                  height="48"
                  loading="lazy"
                >
              </a>
            </div>
            <div class="meta">
              <div flex="~" justify="between" w="full" pos="relative">
                <h3
                  class="video-title"
                  :title="video.title"
                  cursor="pointer"
                  @click="gotoVideo(video.uri)"
                >
                  {{ video.title }}
                </h3>

                <div
                  id="dislike-control-btn"
                  class="icon-btn"
                  p="t-0.15rem x-2"
                  pointer="auto"
                  @click.stop="video.openControl = !video.openControl"
                >
                  <tabler:dots-vertical text="lg" />
                </div>

                <!-- dislike control -->
                <template v-if="video.openControl">
                  <!-- cover mask -->
                  <div
                    pos="fixed top-0 left-0"
                    w="full"
                    h="full"
                    z="30"
                    @click="video.openControl = false"
                  />

                  <div
                    pos="absolute top-9 right-0"
                    p="2"
                    z="30"
                    w="180px"
                    bg="$bew-content-1"
                    rounded="$bew-radius"
                    style="
                      box-shadow: var(--bew-shadow-2);
                      backdrop-filter: var(--bew-filter-glass);
                    "
                  >
                    <p p="2" text="$bew-text-3">
                      {{ $t('home.not_interested_in') }}
                    </p>
                    <ul>
                      <li
                        v-for="reason in video.dislike_reasons"
                        :key="reason.reason_id"
                        p="2"
                        m="b-1"
                        cursor="pointer"
                        hover:bg="$bew-fill-2"
                        transition="all duration-300"
                        rounded="$bew-radius"
                        @click.stop="
                          submitDislike(
                            index,
                            reason.reason_id,
                            video.goto,
                            video.param,
                            video.mid,
                            video.tid,
                            video.tag.tag_id,
                          )
                        "
                      >
                        {{ reason.reason_name }}
                      </li>
                    </ul>
                  </div>
                </template>
              </div>
              <div class="channel-name" @click="gotoChannel(video.mid)">
                {{ video.name }}
              </div>
              <div class="video-info">
                {{ numFormatter(video.play)
                }}{{
                  language === LanguageType.English
                    ? ` ${$t('common.view', video.play)}`
                    : $t('common.view', video.play)
                }}
                <span class="text-xs font-light">•</span>
                {{ calcTimeSince(new Date(video.ctime * 1000))
                }}{{
                  language === LanguageType.English
                    ? ` ${$t('common.ago')}`
                    : $t('common.ago')
                }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition-group>
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

.video-card {
  @apply p-1 mb-8 rounded-$bew-radius duration-300
    relative
    active:bg-$bew-fill-2;

  &.is-dislike {
    > *:not(#dislike-control) {
      @apply invisible pointer-events-none duration-0 transition-none;
    }
  }

  .cover-shadow {
    @apply absolute top-0 left-0 w-full h-full filter -z-1
      pointer-events-none duration-600 rounded-$bew-radius opacity-70;
    aspect-ratio: 16/9;
  }

  &:hover .cover-shadow {
    @apply blur-2xl transform;
  }

  .thumbnail {
    @apply w-full rounded-$bew-radius relative duration-300;
    aspect-ratio: 16/9;

    .duration {
      @apply absolute z-2 bottom-0 right-0 px-2 py-1
        m-1 rounded-$bew-radius text-xs
        text-white
        bg-black bg-opacity-60;
    }

    .cover {
      @apply w-full h-full bg-cover bg-center transform scale-110 duration-300
        absolute bg-$bew-fill-3;
      aspect-ratio: 16/9;
    }
  }

  &:hover .thumbnail {
    @apply transform scale-105;
  }

  &:hover .cover {
    @apply transform scale-100;
  }

  .detail {
    @apply flex mt-4;

    .avatar {
      @apply mr-4 h-48px rounded-$bew-radius overflow-hidden
        object-center object-cover
        bg-$bew-fill-3;
    }

    .meta {
      @apply flex flex-col items-start '!w-full';

      .video-title {
        @apply text-lg max-h-13 overflow-hidden overflow-ellipsis whitespace-normal
         text-$bew-text-1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .channel-name,
      .video-info {
        @apply text-base text-$bew-text-2;
      }

      .channel-name {
        @apply mt-2;
      }
    }
  }
}
</style>
