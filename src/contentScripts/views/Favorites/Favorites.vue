<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getCSRF, getUserID, openLinkToNewTab, removeHttpFromUrl } from '~/utils/main'
import type { FavoriteCategory, FavoriteResource } from '~/components/Topbar/types'

const { t } = useI18n()

const favoriteCategories = reactive<Array<FavoriteCategory>>([])
const favoriteResources = reactive<Array<FavoriteResource>>([])

const activatedCategoryId = ref<number>(0)
const activatedFavoriteTitle = ref<string>()
const currentPageNum = ref<number>(1)
const keyword = ref<string>()

const isLoading = ref<boolean>()
const noMoreContent = ref<boolean>()

watch(activatedCategoryId, (newVal: number, oldVal: number) => {
  if (newVal === oldVal)
    return

  favoriteResources.length = 0
  // if (favoriteVideosWrap.value)
  //   scrollToTop(favoriteVideosWrap.value, 300)

  getFavoriteResources(newVal, 1)
})

onMounted(async () => {
  await getFavoriteCategories()
  activatedCategoryId.value = favoriteCategories[0].id
  activatedFavoriteTitle.value = favoriteCategories[0].title
  // getFavoriteResources()
})

/**
 * Get watch later list
 */
// function getAllWatchLaterList() {
//   isLoading.value = true
//   watchLaterList.length = 0
//   browser.runtime
//     .sendMessage({
//       contentScriptQuery: 'getAllWatchLaterList',
//     })
//     .then((res) => {
//       if (res.code === 0)
//         Object.assign(watchLaterList, res.data.list)

//       isLoading.value = false
//     })
// }

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

function deleteWatchLaterItem(index: number, aid: number) {
  // browser.runtime
  //   .sendMessage({
  //     contentScriptQuery: 'removeFromWatchLater',
  //     aid,
  //     csrf: getCSRF(),
  //   })
  //   .then((res) => {
  //     if (res.code === 0)
  //       watchLaterList.splice(index, 1)
  //   })
}

function changeCategory(categoryItem: FavoriteCategory) {
  activatedCategoryId.value = categoryItem.id
  activatedFavoriteTitle.value = categoryItem.title
}

function handlePlayAll() {
  openLinkToNewTab('https://www.bilibili.com/list/watchlater')
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}
</script>

<template>
  <div v-if="getCSRF()" flex="~ col md:row lg:row" gap-6>
    <main w="full md:60% lg:70% xl:75%" order="2 md:1 lg:1" mb-6 relative>
      <h3 text="3xl $bew-text-1" font-bold mb-6>
        {{ activatedFavoriteTitle }}
      </h3>
      <!-- <div
        fixed z-10 absolute h-60px px-4 flex items-center backdrop-glass
        bg="$bew-content-1"
      >
        <h3
          text="3xl $bew-text-1" font-bold
        >
          {{ activatedFavoriteTitle }}
        </h3>
      </div> -->
      <Empty v-if="favoriteResources.length === 0 && !isLoading" />
      <template v-else>
        <!-- favorite list -->
        <div grid="~ 2xl:cols-4 xl:cols-3 lg:cols-2 md:cols-2 gap-4">
          <VideoCard
            v-for="item in favoriteResources" :id="item.id" :key="item.id"
            :item="item"
            :duration="item.duration"
            :title="item.title"
            :cover="item.cover"
            :author="item.upper.name"
            :author-face="item.upper.face"
            :mid="item.upper.mid"
            :published-timestamp="item.pubtime"
            :bvid="item.bvid"
          />
        </div>

        <!-- loading -->
        <Transition name="fade">
          <loading
            v-if="isLoading && favoriteResources.length !== 0 && !noMoreContent"
            m="-t-4"
          />
        </Transition>
      </template>
    </main>

    <aside relative w="full md:40% lg:30% xl:25%" order="1 md:2 lg:2">
      <div
        pos="sticky top-120px" flex="~ col gap-4" justify-start my-10 w-full h="auto md:[calc(100vh-160px)]" p-6
        rounded="$bew-radius" overflow-hidden bg="$bew-fill-3"
      >
        <picture
          rounded="$bew-radius" style="box-shadow: 0 16px 24px -12px rgba(0, 0, 0, .36)"
          aspect-video mb-4 bg="$bew-fill-2"
        >
          <img
            v-if="favoriteResources[0]" :src="removeHttpFromUrl(`${favoriteResources[0].cover}@480w_270h_1c`)"
            rounded="$bew-radius" aspect-video w-full object-cover
          >
          <div v-else aspect-video w-full>
            <!-- <Empty /> -->
          </div>
        </picture>

        <h3 text="3xl white" fw-600 style="text-shadow: 0 0 12px rgba(0,0,0,.3)">
          {{ activatedFavoriteTitle }}
        </h3>
        <p flex="~ col" gap-4>
          <Button
            color="rgba(255,255,255,.35)" text-color="white" strong flex-1
            @click="handlePlayAll"
          >
            <template #left>
              <tabler:player-play />
            </template>
            {{ t('watch_later.play_all') }}
          </Button>
        </p>
        <ul h-full overflow-overlay border-t="1 color-[rgba(255,255,255,.2)]" border-b="1 color-[rgba(255,255,255,.2)]">
          <li
            v-for="item in favoriteCategories" :key="item.id"
            flex items-center
            border-b="1 color-[rgba(255,255,255,.2)]"
            h-30px px-4 cursor-pointer hover:bg="[rgba(255,255,255,.35)]"
            duration-300 color-white
            :style="{ background: item.id === activatedCategoryId ? 'rgba(255,255,255,.35)' : '' }"
            @click="() => {
              activatedCategoryId = item.id
              activatedFavoriteTitle = item.title
            }"
          >
            {{ item.title }}
          </li>
        </ul>
        <div
          v-if="favoriteResources[0]"
          pos="absolute top-0 left-0" w-full h-full bg-cover bg-center z--1
        >
          <div absolute w-full h-full style="backdrop-filter: blur(60px) saturate(180%)" bg="$bew-fill-1" />
          <img
            v-if="favoriteResources[0]"
            :src="removeHttpFromUrl(`${favoriteResources[0].cover}@480w_270h_1c`)"
            w-full h-full object="cover center"
          >
        </div>
      </div>
    </aside>
  </div>
  <Empty v-else mt-6 :description="t('common.please_log_in_first')">
    <Button type="primary" @click="jumpToLoginPage()">
      {{ $t('common.login') }}
    </Button>
  </Empty>
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
