<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getCSRF, getUserID, openLinkToNewTab, removeHttpFromUrl } from '~/utils/main'
import type { FavoriteCategory, FavoriteResource } from '~/components/Topbar/types'
import emitter from '~/utils/mitt'
import { settings } from '~/logic'
import type { Media as FavoriteItem, FavoritesResult } from '~/models/apiModels/video/favorite'
import type { List as CategoryItem, FavoritesCategoryResult } from '~/models/apiModels/video/favoriteCategory'

const { t } = useI18n()

const favoriteCategories = reactive<CategoryItem[]>([])
const favoriteResources = reactive<FavoriteItem[]>([])
const categoryOptions = reactive<Array<{ value: any; label: string }>>([])

const selectedCategory = ref<FavoriteCategory>()
const activatedCategoryCover = ref<string>('')

const shouldMoveCtrlBarUp = ref<boolean>(false)
const currentPageNum = ref<number>(1)
const keyword = ref<string>('')

const isLoading = ref<boolean>(true)
const isFullPageLoading = ref<boolean>(false)
const noMoreContent = ref<boolean>()

onMounted(async () => {
  await getFavoriteCategories()
  changeCategory(favoriteCategories[0])

  emitter.off('reachBottom')
  emitter.on('reachBottom', () => {
    if (isLoading.value)
      return

    if (!noMoreContent.value)
      getFavoriteResources(selectedCategory.value!.id, ++currentPageNum.value, keyword.value)
  })

  emitter.off('pageRefresh')
  emitter.on('pageRefresh', async () => {
    favoriteResources.length = 0
    handleSearch()
  })
  emitter.off('topbarVisibleChange')
  emitter.on('topbarVisibleChange', (val) => {
    shouldMoveCtrlBarUp.value = false

    // Allow moving tabs up only when the top bar is not hidden & is set to auto-hide
    // This feature is primarily designed to compatible with the Bilibili Evolved's top bar
    // Even when the BewlyBewly top bar is hidden, the Bilibili Evolved top bar still exists, so not moving up
    if (settings.value.autoHideTopbar && settings.value.isShowTopbar) {
      if (val)
        shouldMoveCtrlBarUp.value = false

      else
        shouldMoveCtrlBarUp.value = true
    }
  })
})

onUnmounted(() => {
  emitter.off('reachBottom')
  emitter.off('pageRefresh')
  emitter.off('topbarVisibleChange')
})

async function getFavoriteCategories() {
  await browser.runtime
    .sendMessage({
      contentScriptQuery: 'getFavoriteCategories',
      mid: getUserID(),
    })
    .then((res: FavoritesCategoryResult) => {
      if (res.code === 0) {
        Object.assign(favoriteCategories, res.data.list)

        categoryOptions.length = 0
        favoriteCategories.forEach((item) => {
          categoryOptions.push({
            label: item.title,
            value: item,
          })
        })
      }
    })
}

/**
 * Get favorite video resources
 * @param mediaId
 * @param pageNum
 * @param keyword
 */
async function getFavoriteResources(
  mediaId: number,
  pageNum: number,
  keyword = '' as string,
) {
  if (pageNum === 1)
    isFullPageLoading.value = true
  isLoading.value = true
  try {
    const res: FavoritesResult = await browser.runtime
      .sendMessage({
        contentScriptQuery: 'getFavoriteResources',
        mediaId,
        pageNum,
        keyword,
      })

    if (res.code === 0) {
      activatedCategoryCover.value = res.data.info.cover

      if (Array.isArray(res.data.medias) && res.data.medias.length > 0)
        favoriteResources.push(...res.data.medias)

      if (
        res.data.medias === null
            || (res.data.medias.length < 20 && favoriteResources.length > 0)
      )
        noMoreContent.value = true
    }
  }
  finally {
    isLoading.value = false
    isFullPageLoading.value = false
  }
}

async function changeCategory(categoryItem: FavoriteCategory) {
  currentPageNum.value = 1
  selectedCategory.value = categoryItem

  favoriteResources.length = 0
  getFavoriteResources(categoryItem.id, 1)
}

function handleSearch() {
  currentPageNum.value = 1
  favoriteResources.length = 0
  getFavoriteResources(selectedCategory.value!.id, currentPageNum.value, keyword.value)
}

function handlePlayAll() {
  openLinkToNewTab(`https://www.bilibili.com/list/ml${selectedCategory.value?.id}`)
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}

function handleUnfavorite(favoriteResource: FavoriteResource) {
  browser.runtime.sendMessage({
    contentScriptQuery: 'patchDelFavoriteResources',
    resources: `${favoriteResource.id}:${favoriteResource.type}`,
    mediaId: selectedCategory.value?.id,
    csrf: getCSRF(),
  }).then((res) => {
    if (res.code === 0)
      favoriteResources.splice(favoriteResources.indexOf(favoriteResource), 1)
  })
}
</script>

<template>
  <div v-if="getCSRF()" flex="~ col md:row lg:row" gap-6>
    <main w="full md:60% lg:70% xl:75%" order="2 md:1 lg:1" relative>
      <!-- <h3 text="3xl $bew-text-1" font-bold mb-6>
        {{ selectedCategory?.title }}
      </h3> -->
      <div
        fixed z-10 absolute p-2 flex="~ gap-2"
        items-center
        bg="$bew-elevated-solid-1" rounded="$bew-radius" shadow="$bew-shadow-2" mt--2 transition="all 300 ease-in-out"
        :class="{ hide: shouldMoveCtrlBarUp }"
      >
        <Select v-model="selectedCategory" w-150px :options="categoryOptions" @change="(val) => changeCategory(val.value)" />
        <Input v-model="keyword" w-250px @enter="handleSearch" />
        <Button type="primary" @click="handleSearch">
          <template #left>
            <tabler:search />
          </template>
        </Button>
        <!-- <h3
          text="2xl $bew-text-1" font-bold w-150px
        >
          {{ selectedCategory?.title }}
        </h3> -->
      </div>
      <Empty v-if="favoriteResources.length === 0 && !isLoading" m="t-55px b-6" />
      <template v-else>
        <Transition name="fade">
          <Loading v-if="isFullPageLoading" w-full h-full pos="absolute top-0 left-0" mt--50px />
        </Transition>
        <!-- favorite list -->
        <div grid="~ 2xl:cols-4 xl:cols-3 lg:cols-2 md:cols-1 gap-5" m="t-55px b-6">
          <TransitionGroup name="list">
            <VideoCard
              v-for="item in favoriteResources" :id="item.id" :key="item.id"
              :item="item"
              :duration="item.duration"
              :title="item.title"
              :cover="item.cover"
              :author="item.upper.name"
              :author-face="item.upper.face"
              :mid="item.upper.mid"
              :view="item.cnt_info.play"
              :danmaku="item.cnt_info.danmaku"
              :published-timestamp="item.pubtime"
              :bvid="item.bvid"
              group
            >
              <template #coverTopLeft>
                <button
                  p="x-2 y-1" m="1"
                  rounded="$bew-radius"
                  text="!white xl"
                  bg="black opacity-60 hover:$bew-error-color-80"
                  opacity-0 group-hover:opacity-100
                  transform="scale-70 group-hover:scale-100"
                  duration-300
                  @click.stop="handleUnfavorite(item)"
                >
                  <Tooltip :content="$t('favorites.unfavorite')" placement="bottom" type="dark">
                    <ic-baseline-clear />
                  </Tooltip>
                </button>
              </template>
            </VideoCard>
          </TransitionGroup>
        </div>

        <!-- loading -->
        <Transition name="fade">
          <Loading
            v-if="isLoading && favoriteResources.length !== 0 && !noMoreContent"
            m="-t-4"
          />
        </Transition>
      </template>
    </main>

    <aside relative w="full md:40% lg:30% xl:25%" display="md:block none" order="1 md:2 lg:2">
      <div
        pos="sticky top-120px" flex="~ col gap-4" justify-start my-10 w-full
        h="auto md:[calc(100vh-160px)]" p-6
        rounded="$bew-radius" overflow-hidden bg="$bew-fill-3"
      >
        <div
          pos="absolute top-0 left-0" w-full h-full bg-cover bg-center
          z--1
        >
          <div absolute w-full h-full style="backdrop-filter: blur(60px) saturate(180%)" bg="$bew-fill-4" />
          <img
            v-if="activatedCategoryCover"
            :src="removeHttpFromUrl(`${activatedCategoryCover}@480w_270h_1c`)"
            w-full h-full object="cover center"
          >
        </div>

        <picture
          rounded="$bew-radius" style="box-shadow: 0 16px 24px -12px rgba(0, 0, 0, .36)"
          aspect-video mb-4 bg="$bew-fill-2"
        >
          <img
            v-if="activatedCategoryCover" :src="removeHttpFromUrl(`${activatedCategoryCover}@480w_270h_1c`)"
            rounded="$bew-radius" aspect-video w-full object-cover
          >
          <div v-else aspect-video w-full>
            <!-- <Empty /> -->
          </div>
        </picture>

        <h3 text="3xl white" fw-600 style="text-shadow: 0 0 12px rgba(0,0,0,.3)">
          {{ selectedCategory?.title }}
        </h3>
        <p flex="~ col" gap-4>
          <Button
            color="rgba(255,255,255,.35)" block text-color="white" strong flex-1
            @click="handlePlayAll"
          >
            <template #left>
              <tabler:player-play />
            </template>
            {{ t('watch_later.play_all') }}
          </Button>
        </p>
        <ul class="category-list" h-full overflow-overlay border="1 color-[rgba(255,255,255,.2)]" rounded="$bew-radius">
          <li
            v-for="item in favoriteCategories" :key="item.id"
            border-b="1 color-[rgba(255,255,255,.2)]"
            lh-30px px-4 cursor-pointer hover:bg="[rgba(255,255,255,.35)]"
            duration-300 color-white flex justify-between
            :style="{ background: item.id === selectedCategory?.id ? 'rgba(255,255,255,.35)' : '', pointerEvents: isFullPageLoading ? 'none' : 'auto' }"
            @click="changeCategory(item)"
          >
            <span>{{ item.title }}</span> <span ml-2 color-white color-opacity-60>{{ item.media_count }}</span>
          </li>
        </ul>
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
.hide {
  transform: translateY(-70px);
}

.category-list {
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, .35);
    border-radius: 20px;
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}
</style>
