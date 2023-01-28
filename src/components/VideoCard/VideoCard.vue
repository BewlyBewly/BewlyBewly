<script lang="ts" setup>
import type { Video } from './types'
import { accessKey, language } from '~/logic/index'
import {
  calcCurrentTime,
  calcTimeSince,
  numFormatter,
  removeHttpFromUrl,
} from '~/utils'
import { LanguageType } from '~/enums/appEnums'

const props = defineProps<{
  videoData: Video
}>()

const videoUrl = computed(() => {
  return `/video/${props.videoData.bvid}`
})

const isDislike = ref<boolean>(false)
const dislikeReasonId = ref<number | null>(null)
const showPopCtrl = ref<boolean>(false)

function gotoChannel(mid: number) {
  window.open(`//space.bilibili.com/${mid}`)
}

// function submitDislike(
//   reasonID: number,
//   goto: string,
//   id: string,
//   mid: number,
//   rid: number,
//   tagID: number,
// ) {
//   browser.runtime
//     .sendMessage({
//       contentScriptQuery: 'submitDislike',
//       accessKey: accessKey.value,
//       reasonID,
//       goto,
//       id,
//       mid,
//       rid,
//       tagID,
//     })
//     .then((res) => {
//       if (res.code === 0) {
//         isDislike.value = true
//         dislikeReasonId.value = reasonID
//       }
//     })
// }

// function undoDislike(
//   reasonID: number,
//   goto: string,
//   id: string,
//   mid: number,
//   rid: number,
//   tagID: number,
// ) {
//   browser.runtime
//     .sendMessage({
//       contentScriptQuery: 'undoDislike',
//       accessKey,
//       reasonID,
//       goto,
//       id,
//       mid,
//       rid,
//       tagID,
//     })
//     .then((res) => {
//       if (res.code === 0) {
//         isDislike.value = false
//         dislikeReasonId.value = null
//         showPopCtrl.value = false
//       }
//     })
// }
</script>

<template>
  <div
    class="video-card group"
    :class="isDislike ? 'is-dislike' : ''"
    p="1"
    m="b-8"
    border="rounded-$bew-radius"
    transition="duration-300"
    pos="relative"
    active:bg="$bew-fill-2"
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
        class="aspect-video"
      >
        {{ $t('home.video_removed') }}
        <!-- <button
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
        </button> -->
      </div>
    </template>

    <template v-else>
      <a :href="videoUrl" target="_blank">
        <div
          class="aspect-video"
          w="full"
          radius="rounded-$bew-radius"
          pos="relative"
          transition="duration-300"
          group-hover:transform="~ scale-105"
        >
          <!-- Video duration -->
          <div
            pos="absolute bottom-0 right-0"
            z="2"
            p="x-2 y-1"
            m="1"
            border="rounded-$bew-radius"
            text="!white xs"
            bg="black opacity-60"
          >
            {{ calcCurrentTime(videoData.duration) }}
          </div>

          <div
            class="aspect-video"
            w="full"
            pos="relative"
            border="rounded-$bew-radius"
            overflow="hidden"
            z="1"
            transition="duration-300"
          >
            <!-- Video cover -->
            <img
              :src="`${removeHttpFromUrl(videoData.pic)}@672w_378h_1c`"
              loading="lazy"
              class="aspect-auto"
              w="full"
              h="full"
              bg="cover center $bew-fill-3"
              transition="duration-300"
              pos="absolute"
              transform="~ scale-110"
              group-hover:transform="~ scale-100"
            >
          </div>

          <!-- Shadow of the video cover -->
          <img
            :src="`${removeHttpFromUrl(videoData.pic)}@672w_378h_1c`"
            loading="lazy"
            class="aspect-video"
            w="full"
            h="full"
            bg="cover center $bew-fill-3"
            transition="duration-600"
            pos="absolute left-0 top-0"
            filter="~ blur-0"
            z="-1"
            opacity="90"
            pointer="none"
            group-hover:filter="~ blur-2xl"
          >
        </div>
      </a>
      <div flex="~" m="t-4">
        <div class="flex">
          <a
            m="r-4"
            w="48px"
            h="48px"
            border="rounded-$bew-radius"
            overflow="hidden"
            object="center cover"
            bg="$bew-fill-3"
            cursor="pointer"
            @click="gotoChannel(videoData.owner.mid)"
          >
            <img
              :src="`${removeHttpFromUrl(videoData.owner.face)}@60w_60h_1c`"
              width="48"
              height="48"
              loading="lazy"
            >
          </a>
        </div>
        <div class="meta" flex="~ col" w="full" align="items-start">
          <div flex="~" justify="between" w="full" pos="relative">
            <h3
              class="keep-two-lines"
              cursor="pointer"
              text="lg overflow-ellipsis space-normal $bew-text-1"
              h="max-13"
              overflow="hidden"
            >
              <a :href="videoUrl" target="_blank" :title="videoData.title">
                {{ videoData.title }}</a>
            </h3>

            <!-- <div
              id="dislike-control-btn"
              class="icon-btn"
              p="t-0.15rem x-2"
              pointer="auto"
              display="invisible"
              group-hover:display="visible"
              @click.stop="showPopCtrl = !showPopCtrl"
            >
              <tabler:dots-vertical text="lg" />
            </div> -->

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

              <!-- dislike reason popup -->
              <!-- <div
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
              </div> -->
            </template>
          </div>
          <div
            class="channel-name"
            text="base $bew-text-2"
            m="t-2"
            @click="gotoChannel(videoData.owner.mid)"
          >
            {{ videoData.owner.name }}
          </div>
          <div class="video-info" text="base $bew-text-2">
            {{ numFormatter(videoData.stat.view)
            }}{{
              language === LanguageType.English
                ? ` ${$t('common.view', videoData.stat.view)}`
                : $t('common.view', videoData.stat.view)
            }}
            <span class="text-xs font-light">•</span>
            {{ calcTimeSince(videoData.pubdate * 1000)
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
.video-card.is-dislike {
  > *:not(#dislike-control) {
    --at-apply: invisible pointer-events-none duration-0 transition-none;
  }
}
</style>
