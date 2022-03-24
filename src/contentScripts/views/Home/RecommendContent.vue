<template>
  <div
    m="x-22 b-0 t-0"
    grid="~ xl:cols-4 lg:cols-3 md:cols-2 gap-4"
  >
    <transition-group
      name="list"
      @enter="onEnter"
    >
      <div
        v-for="(video, index) in videoList"
        :key="video.idx"
        :data-index="index"
        class="video-card"
      >
        <a :href="'/video/av' + video.uri.split('/')[3]" target="_blank">
          <div class="thumbnail">
            <div class="duration">{{ calcCurrentTime(video.duration) }}</div>
            <div
              class="overflow-hidden w-full relative rounded-$bew-radius z-1"
              style="aspect-ratio: 16/9"
            >
              <img class="cover" :src="video.cover + '@672w_378h_1c'" loading="lazy" />
            </div>
            <img class="cover-shadow" :src="video.cover + '@672w_378h_1c'" loading="lazy" />
          </div>
          <div class="detail">
            <div class="flex">
              <a class="avatar" @click="gotoChannel(video.mid)">
                <img
                  :src="(video.face + '').replace('http:', '') + '@60w_60h_1c'"
                  width="48"
                  height="48"
                  loading="lazy"
                />
              </a>
            </div>
            <div class="meta">
              <h3 class="video-title" :title="video.title">{{ video.title }}</h3>
              <div class="channel-name" @click="gotoChannel(video.mid)">{{ video.name }}</div>
              <div class="video-info">
                {{ numFormatter(video.play) }} views
                <span class="text-xs font-light">•</span>
                {{ calcTimeSince(new Date(video.ctime * 1000)) }} ago
              </div>
            </div>
          </div>
        </a>
      </div>
    </transition-group>
  </div>

  <div
    v-if="isLoading"
    w="full"
    h="46px"
    p="y-8"
    flex="~"
    justify="center"
    items="center"
  >
    <img
      src="https://s2.loli.net/2022/03/20/4YZhnF1cmya6tHO.gif"
      alt="loading"
      w="46px"
      h="46px"
      m="r-2"
    />
    Loading more...
  </div>

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
      style="box-shadow: var(--bew-shadow-2);"
      bg="$bew-content-1"
      p="x-8 y-4"
      text="$bew-text-1"
      rounded="$bew-radius"
      flex="~"
      items="center"
      @click="onRefresh"
    >
      <tabler:refresh class="mr-2" />Click to refresh
    </button>
  </div>
</template>

<script lang="ts">
import { accessKey } from '~/logic/storage'
import { numFormatter, calcTimeSince, calcCurrentTime } from '~/utils'

export default defineComponent({
  data() {
    return {
      videoList: [] as any[],
      isLoading: true,
      numFormatter,
      calcTimeSince,
      calcCurrentTime,
      MAX_LIMIT: 150 as const,
    }
  },
  mounted() {
    this.getRecommendVideo()
    this.getRecommendVideo()
    window.onscroll = async() => {
      if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        if (!this.isLoading)
          return

        if (this.videoList.length <= (this.MAX_LIMIT - 20)) {
          await this.getRecommendVideo(this.videoList[this.videoList.length - 1]?.idx)
          await this.getRecommendVideo(this.videoList[this.videoList.length - 1]?.idx)
        }
        else {
          this.isLoading = false
        }
      }
    }
  },
  methods: {
    async getRecommendVideo(idx?: number) {
      const response = await browser.runtime
        .sendMessage({
          contentScriptQuery: 'getRecommendVideo',
          idx,
          accessKey: accessKey.value,
        })

      if (response.code === 0) {
        // when videoList has length property, it means it is the first time to load
        if (!this.videoList.length) {
          this.videoList = response.data
        }
        else {
          // else we concat the new data to the old data
          this.videoList = this.videoList.concat(response.data)
        }
      }
    },
    gotoChannel(mid: number) {
      window.open(`//space.bilibili.com/${mid}`)
    },
    onRefresh() {
      this.isLoading = true
      this.videoList = []
    },
    onEnter(el, done) {
      // el.dataset.index > 10
      const delay = (el.dataset.index / 10).toFixed(1).split('.')[1]
      el.style.transitionDelay = `${delay * 0.1}s`
      done()
      // gsap.to(el, {
      //   opacity: 1,
      //   height: '1.6em',
      //   delay: el.dataset.index * 0.15,
      //   onComplete: done,
      // })
    },
  },

})
</script>

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
  @apply p-1 rounded-$bew-radius duration-300
    z-0
    active:bg-$bew-fill-2;

  &:hover {
    @apply z-10;
  }

  .cover-shadow {
    @apply absolute top-0 left-0 w-full h-full filter -z-1
      pointer-events-none duration-600 rounded-$bew-radius
      opacity-80;
    aspect-ratio: 16/9;
  }

  &:hover .cover-shadow {
    @apply blur-lg transform;
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
      @apply flex flex-col items-start;

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
