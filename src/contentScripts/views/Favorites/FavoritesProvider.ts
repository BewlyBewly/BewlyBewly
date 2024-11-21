import { useI18n } from 'vue-i18n'

import type { FavoriteCategory, FavoriteResource } from '~/components/TopBar/types'
import { useBewlyApp } from '~/composables/useAppProvider'
import type { FavoritesResult, Media as FavoriteItem } from '~/models/video/favorite'
import type { FavoritesCategoryResult, List as CategoryItem } from '~/models/video/favoriteCategory'
import api from '~/utils/api'
import { getCSRF, getUserID } from '~/utils/main'

export function favoritesProvider() {
  const { haveScrollbar } = useBewlyApp()
  const { t } = useI18n()

  const favoriteCategories = reactive<CategoryItem[]>([])
  const favoriteResources = reactive<FavoriteItem[]>([])
  const categoryOptions = reactive<Array<{ value: any, label: string }>>([])

  const selectedCategory = ref<FavoriteCategory>()
  const activatedCategoryCover = ref<string>('')

  const shouldMoveCtrlBarUp = ref<boolean>(false)
  const currentPageNum = ref<number>(1)
  const keyword = ref<string>('')
  const isLoading = ref<boolean>(false)
  const isFullPageLoading = ref<boolean>(false)
  const noMoreContent = ref<boolean>(false)

  async function getFavoriteCategories() {
    await api.favorite.getFavoriteCategories({
      up_mid: getUserID(),
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
   * @param media_id
   * @param pn
   * @param keyword
   */
  async function getFavoriteResources(
    media_id: number,
    pn: number,
    keyword = '' as string,
  ) {
    // if (pn === 1)
    //   isFullPageLoading.value = true
    isLoading.value = true
    try {
      const res: FavoritesResult = await api.favorite.getFavoriteResources({
        media_id,
        pn,
        keyword,
      })

      if (res.code === 0) {
        activatedCategoryCover.value = res.data.info.cover

        if (Array.isArray(res.data.medias) && res.data.medias.length > 0)
          favoriteResources.push(...res.data.medias)

        if (!res.data.medias)
          noMoreContent.value = true

        if (!haveScrollbar() && !noMoreContent.value)
          await getFavoriteResources(selectedCategory.value!.id, ++currentPageNum.value, keyword)
      }
    }
    finally {
      isLoading.value = false
      // isFullPageLoading.value = false
    }
  }

  async function changeCategory(categoryItem: FavoriteCategory) {
    if (isLoading.value)
      return
    currentPageNum.value = 1
    selectedCategory.value = categoryItem
    favoriteResources.length = 0
    noMoreContent.value = false

    getFavoriteResources(categoryItem.id, 1)
  }

  function handleSearch() {
    currentPageNum.value = 1
    favoriteResources.length = 0
    noMoreContent.value = false

    getFavoriteResources(selectedCategory.value!.id, currentPageNum.value, keyword.value)
  }

  function handleUnfavorite(favoriteResource: FavoriteResource) {
    const result = confirm(
      t('favorites.unfavorite_confirm'),
    )
    if (result) {
      api.favorite.patchDelFavoriteResources({
        resources: `${favoriteResource.id}:${favoriteResource.type}`,
        media_id: selectedCategory.value?.id,
        csrf: getCSRF(),
      }).then((res) => {
        if (res.code === 0)
          favoriteResources.splice(favoriteResources.indexOf(favoriteResource as FavoriteItem), 1)
      })
    }
  }

  return {
    favoriteCategories,
    favoriteResources,
    categoryOptions,
    selectedCategory,
    activatedCategoryCover,
    shouldMoveCtrlBarUp,
    currentPageNum,
    keyword,
    isLoading,
    isFullPageLoading,
    noMoreContent,
    getFavoriteCategories,
    getFavoriteResources,
    changeCategory,
    handleUnfavorite,
    handleSearch,
  }
}
