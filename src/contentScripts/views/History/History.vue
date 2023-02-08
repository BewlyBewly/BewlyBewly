<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import type { HistoryItem } from './types'
import { calcCurrentTime, removeHttpFromUrl } from '~/utils'

const isLoading = ref<boolean>()
const noMoreContent = ref<boolean>()
const historyList = reactive<Array<HistoryItem>>([])

onMounted(() => {
  getHistoryList()

  window.onscroll = () => {
    if (
      window.innerHeight + window.scrollY
      >= document.body.scrollHeight - 20
    ) {
      if (isLoading.value)
        return

      getHistoryList()
    }
  }
})

onUnmounted(() => {
  // remove the global window.onscroll event
  window.onscroll = () => {}
})

/**
 * Get history list
 */
function getHistoryList() {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getHistoryList',
      type: 'all',
      viewAt:
        historyList.length > 0
          ? historyList[historyList.length - 1].view_at
          : 0,
    })
    .then((res) => {
      if (res.code === 0) {
        if (historyList.length !== 0 && res.data.list.length < 20) {
          isLoading.value = false
          noMoreContent.value = true
          return
        }

        res.data.list.forEach((item: HistoryItem) => {
          historyList.push(item)
        })

        noMoreContent.value = false
      }
      isLoading.value = false
    })
}

/**
 * Return the URL of the history item
 * @param item history item
 * @return {string} url
 */
function getHistoryUrl(item: HistoryItem) {
  // Video
  // if (activatedTab.value === 0)
  //   return item.history.bvid
  // // Live
  // else if (activatedTab.value === 1)
  //   return `//live.bilibili.com/${item.history.oid}`
  // // Article
  // else if (activatedTab.value === 2)
  //   return `/read/cv${item.history.oid}`

  return ''
}
</script>

<template>
  <div>
    <!-- historyList -->
    <transition-group name="list">
      <a
        v-for="historyItem in historyList"
        :key="historyItem.kid"
        :href="getHistoryUrl(historyItem)"
        target="_blank"
        rounded="$bew-radius"
        block
        p="2"
        m="last:b-4"
        class="group"
        hover:bg="$bew-fill-2"
        duration-300
        overflow-hidden
      >
        <section flex="~ gap-4" item-start>

          <!-- Video -->
          <div
            pos="relative" bg="$bew-fill-5"
            w="300px"
            flex="shrink-0"
            rounded="$bew-radius"
            overflow-hidden
          >
            <img
              w="300px"
              class="aspect-video"
              :src="`${removeHttpFromUrl(historyItem.cover)}@672w_378h_1c`"
              :alt="historyItem.title"
              bg="contain"
            >
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
                  historyItem.progress === -1
                    ? calcCurrentTime(historyItem.duration)
                    : calcCurrentTime(historyItem.progress)
                } /
                    ${calcCurrentTime(historyItem.duration)}`
              }}
            </div>
            <div w-full pos="absolute bottom-0" bg="white opacity-60">
              <Progress
                :percentage="(historyItem.progress / historyItem.duration) * 100"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <h3
              class="keep-two-lines"
              overflow="hidden"
              text="lg overflow-ellipsis"
            >
              {{ historyItem.title }}
            </h3>
            <div text="$bew-text-2 sm" m="t-4" flex="~" align="items-center">
              {{ historyItem.author_name }}
              <span
                v-if="historyItem.live_status === 1"
                text="$bew-theme-color"
                m="l-2"
              ><tabler:live-photo />
                Live
              </span>
            </div>
            <p text="$bew-text-2 sm">
              {{
                useDateFormat(historyItem.view_at * 1000, 'YYYY-MM-DD HH:mm:ss')
                  .value
              }}
            </p>
          </div>
        </section>
      </a>
    </transition-group>
    <!-- loading -->
    <loading v-if="isLoading && historyList.length !== 0" m="-t-4" />
  </div>
</template>

<style lang="scss" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  --at-apply: opacity-0 transform translate-y-2 transform-gpu;
}
</style>
