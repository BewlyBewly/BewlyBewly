<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'

import { useBewlyApp } from '~/composables/useAppProvider'
import { settings } from '~/logic'
import type { List as VideoItem } from '~/models/video/watchLater'
import { calcCurrentTime } from '~/utils/dataFormatter'
import { openLinkToNewTab, removeHttpFromUrl } from '~/utils/main'

withDefaults(defineProps<{
  index: number
  item: VideoItem
  type?: 'watch-later' | 'feed-you' // 区分是在稍后再看还是在Feed You中使用
}>(), {
  type: 'watch-later',
})

const emit = defineEmits(['deleteItem'])

const { openIframeDrawer } = useBewlyApp()

function handleLinkClick(url: string) {
  if (settings.value.videoCardLinkOpenMode === 'drawer') {
    openIframeDrawer(url) // 在抽屉打开
  }
  else if (settings.value.videoCardLinkOpenMode === 'currentTab') {
    window.open(url, '_self') // 在当前标签页打开
  }
  else {
    openLinkToNewTab(url) // 在新标签页打开
  }
}

function deleteItem(index: number, aid: number) {
  emit('deleteItem', index, aid)
}
</script>

<template>
  <ALink
    :key="item.aid"
    :href="`https://www.bilibili.com/list/watchlater?bvid=${item.bvid}`"
    type="videoCard"
    class="group"
    flex cursor-pointer
  >
    <section
      :class="{ 'md:flex-col lg:flex-row': type === 'watch-later' }"
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
        :class="{ 'md:w-full lg:w-250px': type === 'watch-later' }"
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
          :src="removeHttpFromUrl(`${item.pic}@480w_270h_1c`)"
          :alt="item.title"
          object-cover
        >

        <!-- <div
          pos="absolute bottom-0 right-0"
          bg="black opacity-60"
          m="2"
          p="x-2 y-1"
          text="white xs"
          rounded-8
        >
          {{ calcCurrentTime(item.duration) }}
        </div> -->
        <div

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
              item.progress === -1
                ? calcCurrentTime(item.duration)
                : calcCurrentTime(item.progress)
            } /
                      ${calcCurrentTime(item.duration)}`
          }}
        </div>
        <div w-full pos="absolute bottom-0" bg="white opacity-60">
          <Progress
            :percentage="
              (item.progress / item.duration) * 100
            "
          />
        </div>
      </div>

      <!-- Description -->
      <div flex justify-between w-full h-full>
        <div flex="~ col">
          <a
            class="keep-two-lines"
            overflow="hidden"
            un-text="lg overflow-ellipsis"
            @click.stop.prevent="handleLinkClick(`https://www.bilibili.com/list/watchlater?bvid=${item.bvid}`)"
          >
            {{ item.title }}
          </a>
          <a
            un-text="$bew-text-2 sm"
            m="t-4 b-2"
            flex="~"
            items-center
            cursor-pointer
            w-fit
            rounded="$bew-radius"
            hover:color="$bew-theme-color"
            hover:bg="$bew-theme-color-10"
            duration-300
            pr-2
            :href="`//space.bilibili.com/${item.owner.mid}`" target="_blank"
            @click.stop
          >
            <img
              :src="removeHttpFromUrl(`${item.owner.face}@40w_40h_1c`)"
              w-30px
              aspect-square
              object-cover
              alt=""
              rounded="1/2"
              mr-2
            >
            {{ item.owner.name }}
          </a>
          <p display="block xl:none" text="$bew-text-3 sm" mt-auto mb-2>
            {{
              useDateFormat(item.pubdate * 1000, 'YYYY-MM-DD HH:mm:ss')
                .value
            }}
          </p>
        </div>

        <div flex items-center>
          <!-- <span>{{ item.progress === -1 ? $t('watch_later.watched') : '' }}</span> -->

          <button
            text="2xl $bew-text-3"
            hover:color="$bew-theme-color"
            opacity-0 group-hover:opacity-100
            p-2
            duration-300
            @click.prevent.stop="deleteItem(index, item.aid)"
          >
            <div i-tabler:trash />
          </button>
        </div>
      </div>
    </section>
  </ALink>
</template>
