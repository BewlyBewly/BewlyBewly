<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'

import type { List as HistoryItem } from '~/models/history/history'
import { Business } from '~/models/history/history'
import { calcCurrentTime } from '~/utils/dataFormatter'
import { removeHttpFromUrl } from '~/utils/main'

withDefaults(defineProps<{
  index: number
  historyItem: HistoryItem
  type?: 'history' | 'feed-you' // 区分是在观看历史还是在Feed You中使用
}>(), {
  type: 'history',
})

const emit = defineEmits(['deleteItem'])

const HistoryBusiness = computed(() => {
  return Business
})

/**
 * Return the URL of the history item
 * @param item history item
 * @return {string} url
 */
function getHistoryUrl(item: HistoryItem): string {
  if (item.uri)
    return item.uri

  // Video
  if (item.history.business === Business.ARCHIVE) {
    if (item?.videos && item.videos > 0)
      return `https://www.bilibili.com/video/${item.history.bvid}?p=${item.history.page}`
    return `https://www.bilibili.com/video/${item.history.bvid}`
  }
  // Live
  else if (item.history.business === Business.LIVE) {
    return `https://live.bilibili.com/${item.history.oid}`
  }
  // Article
  else if (item.history.business === Business.ARTICLE || item.history.business === Business.ARTICLE_LIST) {
    if (item.history.cid === 0)
      return `https://www.bilibili.com/read/cv${item.history.oid}`
    else
      return `https://www.bilibili.com/read/cv${item.history.cid}`
  }
  return ''
}

function getHistoryItemCover(item: HistoryItem) {
  if (item.history.business === 'article' || item.history.business === 'article-list') {
    if (item.covers)
      return removeHttpFromUrl(`${item.covers[0]}`)
  }

  return removeHttpFromUrl(item.cover)
}

function deleteItem(index: number, item: HistoryItem) {
  emit('deleteItem', index, item)
}
</script>

<template>
  <ALink
    type="videoCard"
    :href="getHistoryUrl(historyItem)"
    block
    class="group"
    flex
    cursor-pointer
  >
    <!-- time slot -->
    <div
      :class="{ 'xl:flex! items-center justify-center': type === 'history' }"
      mr-8 px-4
      b-l="~ 2px dashed $bew-fill-2"
      group-hover:b-l="$bew-theme-color-40"
      shrink-0
      relative
      duration-300
      hidden
    >
      <!-- hidden lg:flex -->
      <!-- Dot -->
      <i
        pos="absolute left--1px"
        w-2
        h-2
        rounded-6
        bg="$bew-fill-3"
        group-hover:bg="$bew-theme-color"
        transform="~ translate-x--1/2"
        duration-300
      />
      <div
        text="sm $bew-text-3"
        group-hover:text="$bew-theme-color"
        bg="$bew-fill-1"
        group-hover:bg="$bew-theme-color-20"
        p="x-3 y-1"
        rounded-8
        duration-300
      >
        {{
          useDateFormat(historyItem.view_at * 1000, 'YYYY-MM-DD HH:mm:ss')
            .value
        }}
      </div>
    </div>

    <section
      :class="{ 'md:flex-col lg:flex-row': type === 'history' }"
      rounded="$bew-radius"
      flex="~ gap-6 col items-start"
      relative
      group-hover:bg="$bew-fill-2"
      duration-300 w-full
      p-2 m-1
      content-visibility-auto
    >
      <!-- Cover -->
      <div
        :class="{ 'md:w-full lg:w-250px': type === 'history' }"
        pos="relative"
        bg="$bew-skeleton"
        w="full"
        flex="shrink-0"
        rounded="$bew-radius"
        overflow-hidden
        aspect-video
      >
        <img
          w="full"
          aspect-video
          :src="`${getHistoryItemCover(historyItem)}@480w_270h_1c`"
          :alt="historyItem.title"
          object-cover
        >

        <span
          v-if="historyItem.history.business !== HistoryBusiness.ARCHIVE"
          pos="absolute right-0 top-0"
          bg="$bew-theme-color"
          text="xs white"
          p="x-2 y-1"
          m-1
          rounded="$bew-radius-half"
        >
          <template
            v-if="historyItem.history.business === HistoryBusiness.LIVE"
          >
            Livestreaming
          </template>
          <template
            v-else-if="historyItem.history.business === HistoryBusiness.PGC"
          >
            PGC
          </template>
        </span>

        <div
          v-if="
            historyItem.history.business === HistoryBusiness.ARCHIVE
              || historyItem.history.business === HistoryBusiness.PGC
          "
          pos="absolute bottom-0 right-0"
          bg="black opacity-60"
          m="2"
          p="x-2 y-1"
          text="white xs"
          rounded-8
        >
          <!--  When progress = -1 means that the user watched the full video -->
          {{
            `${
              historyItem.progress === -1
                ? calcCurrentTime(historyItem.duration)
                : calcCurrentTime(historyItem.progress)
            } /
                      ${calcCurrentTime(historyItem.duration)}`
          }}
        </div>
        <div w-full pos="absolute bottom-0" bg="white opacity-60">
          <Progress
            v-if="
              historyItem.history.business === HistoryBusiness.ARCHIVE
                || historyItem.history.business === HistoryBusiness.PGC
            "
            :percentage="
              (historyItem.progress / historyItem.duration) * 100
            "
          />
        </div>
      </div>

      <!-- Description -->
      <div flex justify-between w-full h-full>
        <div flex="~ col">
          <a
            :href="`${getHistoryUrl(historyItem)}`" target="_blank"
            :title="historyItem.show_title ? historyItem.show_title : historyItem.title"
          >
            <h3
              class="keep-two-lines"
              overflow="hidden"
              text="lg overflow-ellipsis"
            >
              {{ historyItem.show_title ? historyItem.show_title : historyItem.title }}
            </h3>
          </a>
          <a
            un-text="$bew-text-2 sm"
            m="t-4 b-2"
            flex="~ items-center"
            cursor-pointer
            w-fit
            rounded="$bew-radius"
            hover:color="$bew-theme-color"
            hover:bg="$bew-theme-color-10"
            duration-300
            pr-2
            :href="historyItem.author_mid ? `https://space.bilibili.com/${historyItem.author_mid}` : historyItem.uri" target="_blank"
          >
            <img
              :src="
                removeHttpFromUrl(`${historyItem.author_face
                  ? historyItem.author_face
                  : historyItem.cover}@40w_40h_1c`)
              "
              w-30px
              aspect-square
              object-cover
              alt=""
              rounded="1/2"
              mr-2
            >
            {{
              historyItem.author_name
                ? historyItem.author_name
                : historyItem.title
            }}
            <span
              v-if="historyItem.live_status === 1"
              text="$bew-theme-color"
              flex
              items-center
              gap-1
              m="l-2"
            ><div i-tabler:live-photo />
              Live
            </span>
          </a>
          <div
            display="xl:none"
            flex items-center
            text="$bew-text-3 sm"
            mt-auto
          >
            <span text-xl mr-2 lh-0>
              <i
                v-if="historyItem.history.dt === 1 || historyItem.history.dt === 3 || historyItem.history.dt === 5 || historyItem.history.dt === 7"
                i-mingcute:cellphone-line
              />
              <i v-if="historyItem.history.dt === 2" i-mingcute:tv-1-line />
              <i
                v-if="historyItem.history.dt === 4 || historyItem.history.dt === 6" i-mingcute:pad-line
              />
              <i v-if="historyItem.history.dt === 33" i-mingcute:tv-2-line />
            </span>
            <span>
              {{
                useDateFormat(historyItem.view_at * 1000, 'YYYY-MM-DD HH:mm:ss')
                  .value
              }}
            </span>
          </div>
        </div>

        <button
          text="2xl $bew-text-3"
          hover:color="$bew-theme-color"
          opacity-0 group-hover:opacity-100
          p-2
          duration-300
          @click.prevent.stop="deleteItem(index, historyItem)"
        >
          <div i-tabler:trash />
        </button>
      </div>
    </section>
  </ALink>
</template>
