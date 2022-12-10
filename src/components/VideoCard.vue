<script lang="ts" setup>
import { accessKey, language } from '~/logic/index'
import { calcCurrentTime, calcTimeSince, numFormatter } from '~/utils'
import { LanguageType } from '~/enums/appEnums'

defineProps<{
  cover: string
  duration: number
  mid: number
  title: string
  authorAvatar: string
  param: string
  viewCount: number
  channelName: string
  // Created time
  ctime: number
  dislikeReasons: Array<{ reason_id: number; reason_name: string }>
  goto: string
  tid: number
  tag: { tag_id: number; tag_name: string }
}>()

const isDislike = ref<boolean>(false)
const dislikeReasonId = ref<number | null>(null)
const showPopCtrl = ref<boolean>(false)

function gotoChannel(mid: number) {
  window.open(`//space.bilibili.com/${mid}`)
}

function gotoVideo(param: string) {
  window.open(`/video/av${param}`)
}

function submitDislike(
  reasonID: number,
  goto: string,
  id: string,
  mid: number,
  rid: number,
  tagID: number,
) {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'submitDislike',
      accessKey,
      reasonID,
      goto,
      id,
      mid,
      rid,
      tagID,
    })
    .then((res) => {
      if (res.code === 0) {
        isDislike.value = true
        dislikeReasonId.value = reasonID
      }
    })
}

function undoDislike(
  reasonID: number,
  goto: string,
  id: string,
  mid: number,
  rid: number,
  tagID: number,
) {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'undoDislike',
      accessKey,
      reasonID,
      goto,
      id,
      mid,
      rid,
      tagID,
    })
    .then((res) => {
      if (res.code === 0) {
        isDislike.value = false
        dislikeReasonId.value = null
        showPopCtrl.value = false
      }
    })
}
</script>

<template>
  <div
    class="video-card group" :class="isDislike ? 'is-dislike' : ''"
  >
    <!-- Undo control -->
    <template v-if="isDislike">
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
              dislikeReasonId ? dislikeReasonId : 0,
              goto,
              param,
              mid,
              tid,
              tag.tag_id,
            )
          "
        >
          {{ $t('common.undo') }}
        </button>
      </div>
    </template>
    <template v-else>
      <a :href="`/video/av${param}`" target="_blank">
        <div class="thumbnail">
          <div class="duration">{{ calcCurrentTime(duration) }}</div>
          <div
            w="full"
            pos="relative"
            border="rounded-$bew-radius"
            overflow="hidden"
            z="1"
            style="aspect-ratio: 16/9;"
          >
            <img
              class="cover"
              :src="`${cover.replace('http:', '')}@672w_378h_1c`"
              loading="lazy"
            >
          </div>
          <img
            class="cover-shadow"
            :src="`${cover.replace('http:', '')}@672w_378h_1c`"
            loading="lazy"
          >
        </div>
      </a>
      <div class="detail">
        <div class="flex">
          <a class="avatar" cursor="pointer" @click="gotoChannel(mid)">
            <img
              :src="`${`${authorAvatar}`.replace('http:', '')}@60w_60h_1c`"
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
              :title="title"
              cursor="pointer"
              @click="gotoVideo(param)"
            >
              {{ title }}
            </h3>

            <div
              id="dislike-control-btn"
              class="icon-btn"
              p="t-0.15rem x-2"
              pointer="auto"
              display="invisible"
              group-hover:display="visible"
              @click.stop="showPopCtrl = !showPopCtrl"
            >
              <tabler:dots-vertical text="lg" />
            </div>

            <!-- dislike control -->
            <template v-if="showPopCtrl">
              <!-- cover mask -->
              <div
                pos="fixed top-0 left-0"
                w="full"
                h="full"
                z="30"
                @click="showPopCtrl = false"
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
                    v-for="reason in dislikeReasons"
                    :key="reason.reason_id"
                    p="2"
                    m="b-1"
                    cursor="pointer"
                    hover:bg="$bew-fill-2"
                    transition="all duration-300"
                    rounded="$bew-radius"
                    @click.stop="
                      submitDislike(
                        reason.reason_id,
                        goto,
                        param,
                        mid,
                        tid,
                        tag.tag_id,
                      )
                    "
                  >
                    {{ reason.reason_name }}
                  </li>
                </ul>
              </div>
            </template>
          </div>
          <div class="channel-name" @click="gotoChannel(mid)">
            {{ channelName }}
          </div>
          <div class="video-info">
            {{ numFormatter(viewCount)
            }}{{
              language === LanguageType.English
                ? ` ${$t('common.view', viewCount)}`
                : $t('common.view', viewCount)
            }}
            <span class="text-xs font-light">•</span>
            {{ calcTimeSince(ctime * 1000)
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
</template>

<style lang="scss" scoped>
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
