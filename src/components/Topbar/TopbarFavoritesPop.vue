<script setup lang="ts">
import type { Ref } from 'vue'
import { onMounted, reactive, ref, watch } from 'vue'
import type { FavoriteCategory, FavoriteResource } from './types'
import { getUserID, removeHttpFromUrl } from '~/utils/main'
import { calcCurrentTime } from '~/utils/dataFormatter'

const favoriteCategories = reactive<Array<FavoriteCategory>>([])
const favoriteResources = reactive<Array<FavoriteResource>>([])

const activatedMediaId = ref<number>(0)
const activatedFavoriteTitle = ref<string>()
const currentPageNum = ref<number>(1)
const keyword = ref<string>()

const isLoading = ref<boolean>(false)
// when noMoreContent is true, the user can't scroll down to load more content
const noMoreContent = ref<boolean>(false)
const favoriteVideosWrap = ref<HTMLElement>() as Ref<HTMLElement>

const favoritesPageUrl = computed(() => {
  return `//space.bilibili.com/${getUserID()}/favlist?fid=${
    activatedMediaId.value
  }`
})

watch(activatedMediaId, (newVal: number, oldVal: number) => {
  if (newVal === oldVal)
    return

  favoriteResources.length = 0
  if (favoriteVideosWrap.value)
    scrollToTop(favoriteVideosWrap.value, 300)

  getFavoriteResources(newVal, 1)
})

onMounted(async () => {
  await getFavoriteCategories()
  activatedMediaId.value = favoriteCategories[0].id
  activatedFavoriteTitle.value = favoriteCategories[0].title
  getFavoriteResources(
    activatedMediaId.value,
    currentPageNum.value++,
    keyword.value,
  )

  if (favoriteVideosWrap.value) {
    favoriteVideosWrap.value.addEventListener('scroll', () => {
      // When you scroll to the bottom, they will automatically
      // add the next page of data to the history list
      if (
        favoriteVideosWrap.value.clientHeight
          + favoriteVideosWrap.value.scrollTop
          >= favoriteVideosWrap.value.scrollHeight - 20
        && favoriteResources.length > 0
        && !isLoading.value
      ) {
        if (activatedMediaId.value && !noMoreContent.value)
          getFavoriteResources(activatedMediaId.value, currentPageNum.value++)
      }
    })
  }
})

async function getFavoriteCategories() {
  await browser.runtime
    .sendMessage({
      contentScriptQuery: 'getFavoriteCategories',
      mid: getUserID(),
    })
    .then((res) => {
      if (res.code === 0) {
        Object.assign(favoriteCategories, res.data.list)
        noMoreContent.value = false
      }
      isLoading.value = false
    })
}

/**
 * Get favorite video resources
 * @param mediaId
 * @param pageNum
 * @param keyword
 */
function getFavoriteResources(
  mediaId: number,
  pageNum: number,
  keyword = '' as string,
) {
  isLoading.value = true
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getFavoriteResources',
      mediaId,
      pageNum,
      keyword,
    })
    .then((res) => {
      if (res.code === 0) {
        if (
          res.data.medias === null
          || (res.data.medias.length < 20 && favoriteResources.length > 0)
        ) {
          isLoading.value = false
          noMoreContent.value = true
          return
        }

        res.data.medias.forEach((item: FavoriteResource) => {
          favoriteResources.push(item)
        })
        noMoreContent.value = false
      }
      isLoading.value = false
    })
}

function changeCategory(categoryItem: FavoriteCategory) {
  activatedMediaId.value = categoryItem.id
  activatedFavoriteTitle.value = categoryItem.title
}

/**
 * smooth scroll to the top of the html element
 */
function scrollToTop(element: HTMLElement, duration: number) {
  // cancel if already on top
  if (element.scrollTop === 0)
    return

  const cosParameter = element.scrollTop / 2
  let scrollCount = 0
  let oldTimestamp = 0

  function step(newTimestamp: number) {
    if (oldTimestamp !== 0) {
      // if duration is 0 scrollCount will be Infinity
      scrollCount += (Math.PI * (newTimestamp - oldTimestamp)) / duration
      if (scrollCount >= Math.PI)
        return (element.scrollTop = 0)
      element.scrollTop = cosParameter + cosParameter * Math.cos(scrollCount)
    }
    oldTimestamp = newTimestamp
    window.requestAnimationFrame(step)
  }
  window.requestAnimationFrame(step)
}
</script>

<template>
  <div
    bg="$bew-elevated-solid-1"
    w="500px"
    h="430px"
    rounded="$bew-radius"
    pos="relative"
    style="box-shadow: var(--bew-shadow-2)"
  >
    <!-- top bar -->
    <header
      flex="~" items-center justify-between
      p="x-6"
      pos="fixed top-0 left-0"
      w="full"
      h-50px
      bg="$bew-content-1"
      z="2"
      un-border="!rounded-t-$bew-radius"
      backdrop-glass
    >
      <h3 cursor="pointer" font-600 @click="scrollToTop(favoriteVideosWrap, 300)">
        {{ activatedFavoriteTitle }}
      </h3>

      <a :href="favoritesPageUrl" target="_blank" flex="~" items="center">
        <span text="sm">{{ $t('common.view_all') }}</span>
      </a>
    </header>

    <main flex="~" overflow-hidden rounded="$bew-radius">
      <aside
        w="120px"
        h="430px"
        overflow="y-scroll"
        un-border="rounded-l-$bew-radius"
        flex="shrink-0"
      >
        <ul grid="~ cols-1" bg="$bew-fill-2">
          <li
            v-for="item in favoriteCategories"
            :key="item.id"
            :class="activatedMediaId === item.id ? 'activated-category' : ''"
            p="y-2 x-6"
            first:m="t-[50px]"
            cursor="pointer"
            transition="~ duration-300"
            @click="changeCategory(item)"
          >
            {{ item.title }}
          </li>
        </ul>
      </aside>

      <!-- Favorite videos wrapper -->
      <div
        ref="favoriteVideosWrap"
        flex="~ col gap-4 1"
        h="430px"
        overflow="y-scroll"
        p="x-4"
        pos="relative"
      >
        <!-- loading -->
        <Loading
          v-if="isLoading && favoriteResources.length === 0"
          pos="absolute left-0"
          bg="$bew-content-1"
          z="1"
          w="full"
          h="full"
          flex="~"
          items="center"
          rounded="$bew-radius"
        />

        <!-- empty -->
        <Empty
          v-if="!isLoading && favoriteResources.length === 0"
          w="full"
          h="full"
        />

        <!-- historys -->
        <TransitionGroup name="list">
          <a
            v-for="item in favoriteResources"
            :key="item.id"
            :href="`//www.bilibili.com/video/${item.bvid}`"
            target="_blank"
            hover:bg="$bew-fill-2"
            rounded="$bew-radius"
            p="2"
            m="first:t-50px last:b-4"
            class="group"
            transition="~ duration-300"
          >
            <section flex="~ gap-4" item-start>
              <div
                bg="$bew-fill-1"
                w="150px"
                flex="shrink-0"
                rounded="$bew-radius-half"
                overflow="hidden"
              >
                <div pos="relative">
                  <img
                    w="150px"
                    class="aspect-video"
                    :src="`${removeHttpFromUrl(item.cover)}@256w_144h_1c`"
                    :alt="item.title"
                    bg="contain"
                  >
                  <div
                    pos="absolute bottom-0 right-0"
                    bg="black opacity-60"
                    m="1"
                    p="x-2 y-1"
                    text="white xs"
                    rounded-full
                  >
                    {{ calcCurrentTime(item.duration) }}
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div>
                <h3
                  class="keep-two-lines"
                >
                  {{ item.title }}
                </h3>
                <div
                  text="$bew-text-2 sm"
                  m="t-4"
                  flex="~"
                  items-center
                >
                  {{ item.upper.name }}
                </div>
              </div>
            </section>
          </a>
        </TransitionGroup>

        <!-- loading -->
        <Transition name="fade">
          <Loading v-if="isLoading && favoriteResources.length !== 0" m="-t-4" />
        </Transition>
      </div>
    </main>
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

.activated-category {
  --at-apply: bg-$bew-theme-color text-white;
}
</style>
