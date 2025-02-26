<script setup lang="ts">
import { onClickOutside, onKeyStroke, useMouseInElement } from '@vueuse/core'
import type { Ref, UnwrapNestedRefs } from 'vue'

import { useBewlyApp } from '~/composables/useAppProvider'
import { useDark } from '~/composables/useDark'
import { useDelayedHover } from '~/composables/useDelayedHover'
import { OVERLAY_SCROLL_BAR_SCROLL, TOP_BAR_VISIBILITY_CHANGE } from '~/constants/globalEvents'
import { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'
import api from '~/utils/api'
import { getUserID, isHomePage, isInIframe } from '~/utils/main'
import emitter from '~/utils/mitt'
import { createTransformer } from '~/utils/transformer'

import BewlyOrBiliPageSwitcher from './components/BewlyOrBiliPageSwitcher.vue'
import ChannelsPop from './components/ChannelsPop.vue'
import FavoritesPop from './components/FavoritesPop.vue'
import HistoryPop from './components/HistoryPop.vue'
import MomentsPop from './components/MomentsPop.vue'
import MorePop from './components/MorePop.vue'
import NotificationsDrawer from './components/NotificationsDrawer.vue'
import NotificationsPop from './components/NotificationsPop.vue'
import UploadPop from './components/UploadPop.vue'
import UserPanelPop from './components/UserPanelPop.vue'
import WatchLaterPop from './components/WatchLaterPop.vue'
import { updateInterval } from './notify'
import type { UnReadDm, UnReadMessage, UserInfo } from './types'

// import { useTopBarStore } from '~/stores/topBarStore'

// const popups = { NotificationsPop, MomentsPop, FavoritesPop, HistoryPop }

// const topBarStore = useTopBarStore()

// const topBarItems = computed(() => {
//   return topBarStore.topBarItems
// })

const { activatedPage, scrollbarRef, reachTop } = useBewlyApp()
const { isDark } = useDark()

const mid = getUserID() || ''
const userInfo = reactive<UserInfo | NonNullable<unknown>>({}) as UnwrapNestedRefs<UserInfo>

const hideTopBar = ref<boolean>(false)
const headerTarget = ref(null)
const { isOutside: isOutsideTopBar } = useMouseInElement(headerTarget)

// initially, assume the user is logged in cuz data retrieval is slow, which may show the login
// button even after login. if the user is not logged in, the login button will show up later
const isLogin = ref<boolean>(true)

const logo = ref<HTMLElement>() as Ref<HTMLElement>
const avatarImg = ref<HTMLImageElement>() as Ref<HTMLImageElement>
const avatarShadow = ref<HTMLImageElement>() as Ref<HTMLImageElement>

const scrollTop = ref<number>(0)
const oldScrollTop = ref<number>(0)

const drawerVisible = reactive({
  notifications: false,
})

const isSearchPage = computed((): boolean => {
  if (/https?:\/\/search.bilibili.com\/.*$/.test(location.href))
    return true
  return false
})

// 當使用背景時，強制 icon 變白色用於區分背景
const forceWhiteIcon = computed((): boolean => {
  if (
    // 首頁使用原生 bilibili 首頁時由於原版有 banner，所以強制 icon 變白色用於區分背景
    (isHomePage() && settings.value.useOriginalBilibiliHomepage)
    || (isInIframe() && isHomePage())
    // 分區頁面由於上面有背景，所以強制 icon 變白色用於區分背景
    // channel, anime, chinese anime, tv shows, movie, variety shows, mooc but not including video page
    || (
      /https?:\/\/(?:www.)?bilibili.com\/(?:v|anime|guochuang|tv|movie|variety|mooc).*/.test(location.href)
      && !/https?:\/\/(?:www.)?bilibili.com\/video.*/.test(location.href)
    )
    // user space page 空間頁
    || /https?:\/\/space.bilibili\.com\.*/.test(location.href)
    // premium page bilibili 大會員頁
    || /https?:\/\/account\.bilibili\.com\/big.*$/.test(location.href)
  ) {
    return true
  }
  if (!isHomePage()) {
    return false
  }
  if (activatedPage.value === AppPage.Search) {
    if (settings.value.individuallySetSearchPageWallpaper) {
      if (settings.value.searchPageWallpaper)
        return true
      return false
    }
    return !!settings.value.wallpaper
  }
  else {
    if (settings.value.wallpaper) {
      return true
    }
    else {
      if (settings.value.useSearchPageModeOnHomePage) {
        if (settings.value.individuallySetSearchPageWallpaper && !!settings.value.searchPageWallpaper)
          return true
        else if (settings.value.wallpaper)
          return true
      }
    }
    return false
  }
})

const showSearchBar = computed((): boolean => {
  if (isHomePage()) {
    if (settings.value.useOriginalBilibiliHomepage)
      return true
    if (activatedPage.value === AppPage.Search)
      return false
    if (settings.value.useSearchPageModeOnHomePage && activatedPage.value === AppPage.Home && reachTop.value)
      return false
  }
  else {
    if (isSearchPage.value)
      return false
  }
  return true
})

const isTopBarFixed = computed((): boolean => {
  if (
    isHomePage()
    // video page
    || /https?:\/\/(?:www.)?bilibili.com\/(?:video|list)\/.*/.test(location.href)
    // anime playback & movie page
    || /https?:\/\/(?:www.)?bilibili.com\/bangumi\/play\/.*/.test(location.href)
    // moment page
    || /https?:\/\/t.bilibili.com.*/.test(location.href)
    // channel, anime, chinese anime, tv shows, movie, variety shows, mooc
    || /https?:\/\/(?:www.)?bilibili.com\/(?:v|anime|guochuang|tv|movie|variety|mooc).*/.test(location.href)
    // articles page
    || /https?:\/\/(?:www.)?bilibili.com\/read\/home.*/.test(location.href)
    // premium page bilibili 大會員頁
    || /https?:\/\/account\.bilibili\.com\/big.*$/.test(location.href)
  ) {
    return true
  }
  return false
})

const showTopBar = computed((): boolean => {
  if (
    // Creative center page
    /https?:\/\/member.bilibili.com\/platform.*/.test(location.href)
    // https://github.com/BewlyBewly/BewlyBewly/issues/1276
    || /https?:\/\/(?:www\.)?bilibili\.com\/read\/(?:preview|pcpreview).*/.test(location.href)
  ) {
    return false
  }
  if (settings.value.showTopBar)
    return true
  return false
})

// #region Popups visibility control
const popupVisible = reactive({
  channels: false,
  userPanel: false,
  notifications: false,
  moments: false,
  favorites: false,
  history: false,
  watchLater: false,
  upload: false,
  more: false,
})

function closeAllTopBarPopup(exceptionKey?: keyof typeof popupVisible) {
  Object.keys(popupVisible).forEach((key) => {
    if (key !== exceptionKey)
      popupVisible[key as keyof typeof popupVisible] = false
  })
}

// Channels
const channels = setupTopBarItemHoverEvent('channels')
// Avatar
const avatar = setupTopBarItemHoverEvent('userPanel')
// Notifications
const notifications = setupTopBarItemHoverEvent('notifications')
// Moments
const moments = setupTopBarItemHoverEvent('moments')
// Favorites
const favorites = setupTopBarItemHoverEvent('favorites')
// History
const history = setupTopBarItemHoverEvent('history')
// Watch Later
const watchLater = setupTopBarItemHoverEvent('watchLater')
// Upload
const upload = setupTopBarItemHoverEvent('upload')
// More
const more = setupTopBarItemHoverEvent('more')

const topBarItemElements: Record<keyof typeof popupVisible, Ref<HTMLElement | undefined>> = {
  channels,
  userPanel: avatar,
  notifications,
  moments,
  favorites,
  history,
  watchLater,
  upload,
  more,
}

const avatarTransformer = setupTopBarItemTransformer('userPanel')
const notificationsTransformer = setupTopBarItemTransformer('notifications')
const momentsTransformer = setupTopBarItemTransformer('moments')
const favoritesTransformer = setupTopBarItemTransformer('favorites')
const historyTransformer = setupTopBarItemTransformer('history')
const watchLaterTransformer = setupTopBarItemTransformer('watchLater')
const uploadTransformer = setupTopBarItemTransformer('upload')
const moreTransformer = setupTopBarItemTransformer('more')

function setupTopBarItemTransformer(key: keyof typeof popupVisible) {
  const transformer = createTransformer(topBarItemElements[key], {
    x: '0px',
    y: '50px',
    centerTarget: {
      x: true,
    },
  })

  return transformer
}

function setupTopBarItemHoverEvent(key: keyof typeof popupVisible) {
  return useDelayedHover({
    enterDelay: 320,
    leaveDelay: 320,
    beforeEnter: () => closeAllTopBarPopup(key),
    enter: () => {
      popupVisible[key] = true
    },
    leave: () => {
      popupVisible[key] = false
    },
  })
}

const currentClickedTopBarItem = ref<keyof typeof popupVisible | null>(null)

function handleClickTopBarItem(event: MouseEvent, key: keyof typeof popupVisible) {
  if (settings.value.touchScreenOptimization) {
    event.preventDefault()
    closeAllTopBarPopup(key)
    popupVisible[key] = !popupVisible[key]
    currentClickedTopBarItem.value = key
  }
}

Object.entries(topBarItemElements).forEach(([key, val]) => {
  onClickOutside(val, () => {
    if (currentClickedTopBarItem.value === key)
      popupVisible[key as keyof typeof popupVisible] = false
  })
})

// #endregion

watch(() => settings.value.autoHideTopBar, (newVal) => {
  if (!newVal)
    toggleTopBarVisible(true)
})

watch(
  () => popupVisible.notifications,
  (newVal, oldVal) => {
    // Stop loading new message counts on the message page, because it resets to 0 when the
    // users reads the messages on this page
    if (oldVal === undefined && /https?:\/\/message.bilibili.com.*$/.test(location.href))
      return

    if (newVal === oldVal)
      return

    if (!newVal)
      getUnreadMessageCount()
  },
  { immediate: true },
)

watch(
  () => popupVisible.moments,
  async (newVal, oldVal) => {
    if (newVal === oldVal)
      return

    if (!newVal)
      await getTopBarNewMomentsCount()
  },
  { immediate: true },
)

watch(() => popupVisible.favorites, (newVal, oldVal) => {
  if (newVal === oldVal)
    return
  if (newVal) {
    nextTick(() => {
      if (favoritesTransformer.value)
      // @ts-expect-error allow
        favoritesTransformer.value.refreshFavoriteResources()
    })
  }
})

watch(activatedPage, () => {
  toggleTopBarVisible(true)
})

onMounted(() => {
  initData()
  nextTick(() => {
    toggleTopBarVisible(true)
    emitter.off(OVERLAY_SCROLL_BAR_SCROLL)
    if (isHomePage() && !settings.value.useOriginalBilibiliHomepage) {
      emitter.on(OVERLAY_SCROLL_BAR_SCROLL, () => {
        handleScroll()
      })
    }
    else {
      window.addEventListener('scroll', handleScroll)
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  emitter.off(OVERLAY_SCROLL_BAR_SCROLL)
})

async function initData() {
  await getUserInfo()

  // automatically update notifications and moments count
  setInterval(() => {
    getUnreadMessageCount()
    getTopBarNewMomentsCount()
  }, updateInterval)
}

function handleScroll() {
  if (isHomePage() && !settings.value.useOriginalBilibiliHomepage) {
    const osInstance = scrollbarRef.value?.osInstance()
    scrollTop.value = osInstance.elements().viewport.scrollTop as number
  }
  else {
    scrollTop.value = document.documentElement.scrollTop
  }

  if (scrollTop.value === 0)
    toggleTopBarVisible(true)

  if (settings.value.autoHideTopBar && isOutsideTopBar && scrollTop.value !== 0) {
    if (scrollTop.value > oldScrollTop.value)
      toggleTopBarVisible(false)

    else
      toggleTopBarVisible(true)
  }

  oldScrollTop.value = scrollTop.value
}

async function getUserInfo() {
  try {
    const res = await api.user.getUserInfo()

    if (res.code === 0) {
      isLogin.value = true
      Object.assign(userInfo, res.data)
    }
    // Account not logged in
    else if (res.code === -101) {
      isLogin.value = false
    }
  }
  catch (error) {
    isLogin.value = false
    console.error(error)
  }
}

// #region Notifications
const unReadMessage = reactive<UnReadMessage | NonNullable<unknown>>(
  {},
) as UnwrapNestedRefs<UnReadMessage>
const unReadDm = reactive<UnReadDm>({} as UnwrapNestedRefs<UnReadDm>)
const unReadMessageCount = ref<number>(0)

async function getUnreadMessageCount() {
  if (!isLogin.value)
    return

  let result = 0

  try {
    let res
    res = await api.notification.getUnreadMsg()
    if (res.code === 0) {
      Object.assign(unReadMessage, res.data)
      Object.entries(unReadMessage).forEach(([key, value]) => {
        if (key !== 'up' && key !== 'recv_reply' && key !== 'recv_like') {
          if (typeof value === 'number')
            result += value
        }
      })
    }

    res = await api.notification.getUnreadDm()
    if (res.code === 0) {
      Object.assign(unReadDm, res.data)
      if (typeof unReadDm.follow_unread === 'number')
        result += unReadDm.follow_unread
    }
  }
  catch (error) {
    console.error(error)
  }
  finally {
    unReadMessageCount.value = result
  }
}

const notificationsDrawerUrl = ref<string>('https://message.bilibili.com/')
function handleNotificationsItemClick(item: { name: string, url: string, unreadCount: number, icon: string }) {
  if (settings.value.openNotificationsPageAsDrawer) {
    drawerVisible.notifications = true
    notificationsDrawerUrl.value = item.url
  }
}
// #endregion

// #region Moments
const newMomentsCount = ref<number>(0)

async function getTopBarNewMomentsCount() {
  if (!isLogin.value)
    return

  let result = 0

  try {
    const res = await api.moment.getTopBarNewMomentsCount()
    if (res.code === 0) {
      if (typeof res.data.update_info.item.count === 'number')
        result = res.data.update_info.item.count
    }
  }
  finally {
    newMomentsCount.value = result
  }
}
// #endregion

// https://github.com/BewlyBewly/BewlyBewly/issues/1220
onKeyStroke('/', () => {
  toggleTopBarVisible(true)
})

function toggleTopBarVisible(visible: boolean) {
  hideTopBar.value = !visible
  emitter.emit(TOP_BAR_VISIBILITY_CHANGE, visible)
}

defineExpose({
  toggleTopBarVisible,
  handleScroll,
})
</script>

<template>
  <Transition name="top-bar">
    <header
      v-if="showTopBar"
      ref="headerTarget"
      w="full" transition="all 300 ease-in-out"
      :class="{ 'hide': hideTopBar, 'force-white-icon': forceWhiteIcon }"
      :style="{ position: isTopBarFixed ? 'fixed' : 'absolute' }"
    >
      <main
        max-w="$bew-page-max-width"
        flex="~ justify-between items-center gap-4"
        p="x-12" m-auto
        h="$bew-top-bar-height"
      >
        <!-- Top bar mask -->
        <div
          v-if="!reachTop"
          style="
            mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 1) 24px, rgba(0, 0, 0, 0.9) 44px, transparent);
          "
          :style="{ backdropFilter: settings.disableFrostedGlass ? 'none' : 'blur(12px)' }"
          pos="absolute top-0 left-0" w-full h="[calc(var(--bew-top-bar-height)+16px)]"
          pointer-events-none transform-gpu
        />

        <div
          pos="absolute top-0 left-0" w-full
          pointer-events-none opacity-100 duration-300
          :style="{
            background: `linear-gradient(to bottom, ${
              forceWhiteIcon
                ? 'rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4) calc(var(--bew-top-bar-height) / 2)'
                : 'color-mix(in oklab, var(--bew-bg), transparent 20%), color-mix(in oklab, var(--bew-bg), transparent 40%) calc(var(--bew-top-bar-height) / 2)'
            }, transparent)`,
            opacity: reachTop ? 0.8 : 1,
            height: reachTop ? 'var(--bew-top-bar-height)' : 'calc(var(--bew-top-bar-height) + 20px)',
          }"
        />

        <!-- Top bar theme color gradient -->
        <Transition name="fade">
          <div
            v-if="settings.showTopBarThemeColorGradient && !forceWhiteIcon && reachTop && isDark"
            pos="absolute top-0 left-0" w-full h="$bew-top-bar-height" pointer-events-none
            :style="{ background: 'linear-gradient(to bottom, var(--bew-theme-color-10), transparent)' }"
          />
        </Transition>

        <div shrink-0 flex="inline xl:1 justify-start items-center gap-2" pos="relative" z-1>
          <div
            ref="channels"
            z-1 relative w-fit
          >
            <a
              ref="logo" href="//www.bilibili.com"
              target="_top"
              class="group logo"
              :class="{
                activated: popupVisible.channels,
              }"
              grid="~ place-items-center"
              rounded="46px" duration-300
              w-46px h-46px transform-gpu
              bg="hover:$bew-theme-color"
              @click="event => handleClickTopBarItem(event, 'channels')"
            >
              <svg
                t="1720198072316" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="1477" width="36" height="36"
                :style="{
                  fill: forceWhiteIcon ? 'white' : 'var(--bew-theme-color)',
                  filter: forceWhiteIcon ? 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.6))' : 'drop-shadow(0 0 4px var(--bew-theme-color-60))',
                }"
                group-hover:fill="!white"
                group-hover:filter="!none"
                duration-300 mt--1px
              >
                <path d="M450.803484 456.506027l-120.670435 23.103715 10.333298 45.288107 119.454151-23.102578-9.117014-45.289244z m65.04448 120.060586c-29.483236 63.220622-55.926329 15.502222-55.926328 15.502223l-19.754098 12.768142s38.90176 53.192249 75.986489 12.764729c43.770311 40.42752 77.203911-13.068516 77.203911-13.068516l-17.934791-11.55072c0.001138-0.304924-31.305956 44.983182-59.575183-16.415858z m59.57632-74.773617L695.182222 524.895573l10.029511-45.288106-120.364373-23.103716-9.423076 45.289245z m237.784178-88.926436c-1.905778-84.362809-75.487004-100.540871-75.487004-100.540871s-57.408853-0.316302-131.944676-0.95232l54.237867-52.332089s8.562916-10.784996-6.026809-22.834062c-14.592-12.051342-15.543182-6.660551-20.615396-3.487289-4.441884 3.169849-69.462471 66.920676-80.878933 78.340551-29.494613 0-60.2624-0.319716-90.075591-0.319716h10.466418s-77.705671-76.754489-82.781298-80.241777c-5.075627-3.488427-5.709369-8.56064-20.616533 3.487289-14.589724 12.05248-6.026809 22.8352-6.026809 22.8352l55.504213 53.919288c-60.261262 0-112.280462 0.319716-136.383147 1.268623-78.025387 22.521173-71.99744 100.859449-71.99744 100.859449s0.950044 168.100978 0 253.103217c8.562916 85.00224 73.899804 98.636231 73.899805 98.636231s26.007324 0.63488 45.357511 0.63488c1.900089 5.391929 3.486151 32.034133 33.302756 32.034134 29.495751 0 33.30048-32.034133 33.30048-32.034134s217.263218-0.950044 235.340231-0.950044c0.953458 9.196658 5.394204 33.619058 35.207395 33.303893 29.494613-0.636018 31.714418-35.20512 31.714418-35.20512s10.151253-0.95232 40.280747 0c70.413653-13.005938 74.534684-95.468658 74.534684-95.468657s-1.265209-169.689316-0.312889-254.056676zM752.628622 681.8304c0 13.319964-10.467556 24.102684-23.471218 24.102684H300.980907c-13.003662 0-23.47008-10.78272-23.47008-24.102684V397.961671c0-13.32224 10.467556-24.106098 23.47008-24.106098h428.176497c13.003662 0 23.471218 10.783858 23.471218 24.106098v283.868729z" p-id="1478" /></svg>
            </a>

            <Transition name="slide-in">
              <ChannelsPop
                v-if="popupVisible.channels"
                class="bew-popover"
                pos="!left-0 !top-50px"
                transform="!translate-x-0"
              />
            </Transition>
          </div>

          <BewlyOrBiliPageSwitcher v-if="settings.showBewlyOrBiliPageSwitcher" z-1 />
        </div>

        <!-- search bar -->
        <div flex="inline 1 md:justify-center items-center" w="full">
          <Transition name="slide-out">
            <SearchBar
              v-if="showSearchBar"
              class="search-bar"
              :style="{
                '--b-search-bar-normal-color': settings.disableFrostedGlass ? 'var(--bew-elevated)' : 'color-mix(in oklab, var(--bew-elevated-solid), transparent 60%)',
                '--b-search-bar-hover-color': 'var(--bew-elevated-hover)',
                '--b-search-bar-focus-color': 'var(--bew-elevated)',
                '--b-search-bar-normal-icon-color': forceWhiteIcon && !settings.disableFrostedGlass ? 'white' : 'var(--bew-text-1)',
                '--b-search-bar-normal-text-color': forceWhiteIcon && !settings.disableFrostedGlass ? 'white' : 'var(--bew-text-1)',
              }"
            />
          </Transition>
        </div>

        <!-- right content -->
        <div
          class="right-side"
          flex="inline xl:1 justify-end items-center"
        >
          <div
            class="others"
            flex="~ items-center gap-1" h-46px px-5px
            text="$bew-text-1"
            transform-gpu
          >
            <div
              v-if="!isLogin"
              class="right-side-item"
              important-w-auto
            >
              <a href="https://passport.bilibili.com/login" class="login">
                <div i-solar:user-circle-bold-duotone class="text-xl mr-2" />{{
                  $t('topbar.sign_in')
                }}
              </a>
            </div>
            <template v-if="isLogin">
              <!-- TODO: need to refactor to this -->
              <!-- <div display="lg:flex none">
              <div v-for="item in topBarItems" :key="item.i18nKey" class="right-side-item">
                <a :href="item.url" target="_blank" :title="$t(item.i18nKey)">
                  <Icon :icon="item.icon" />
                </a>

                <Component
                  :is="popups[item.popup] ?? 'div'"
                  v-if="item.popup"
                  class="bew-popover"
                />
              </div>
            </div> -->

              <!-- TODO: need to refactor to above code -->
              <div class="hidden lg:flex" gap-1>
                <!-- Moments -->
                <div
                  ref="moments"
                  class="right-side-item"
                  :class="{ active: popupVisible.moments }"
                  @click="event => handleClickTopBarItem(event, 'moments')"
                >
                  <template v-if="newMomentsCount > 0">
                    <div
                      v-if="settings.topBarIconBadges === 'number'"
                      class="unread-num-dot"
                    >
                      {{ newMomentsCount > 99 ? '99+' : newMomentsCount }}
                    </div>
                    <div
                      v-else-if="settings.topBarIconBadges === 'dot'"
                      class="unread-dot"
                    />
                  </template>
                  <ALink
                    :class="{ 'white-icon': forceWhiteIcon }"
                    href="https://t.bilibili.com"
                    :title="$t('topbar.moments')"
                    type="topBar"
                  >
                    <div i-tabler:windmill />
                  </ALink>

                  <Transition name="slide-in">
                    <MomentsPop
                      v-show="popupVisible.moments"
                      ref="momentsTransformer"
                      class="bew-popover"
                      @click.stop="() => {}"
                    />
                  </Transition>
                </div>

                <!-- Favorites -->
                <div
                  ref="favorites"
                  class="right-side-item"
                  :class="{ active: popupVisible.favorites }"
                  @click="event => handleClickTopBarItem(event, 'favorites')"
                >
                  <ALink
                    :class="{ 'white-icon': forceWhiteIcon }"
                    :href="`https://space.bilibili.com/${mid}/favlist`"
                    :title="$t('topbar.favorites')"
                    type="topBar"
                  >
                    <div i-mingcute:star-line />
                  </ALink>

                  <Transition name="slide-in">
                    <KeepAlive>
                      <FavoritesPop
                        v-if="popupVisible.favorites"
                        ref="favoritesTransformer"
                        class="bew-popover"
                        @click.stop="() => {}"
                      />
                    </KeepAlive>
                  </Transition>
                </div>

                <!-- History -->
                <div
                  ref="history"
                  class="right-side-item"
                  :class="{ active: popupVisible.history }"
                  @click="event => handleClickTopBarItem(event, 'history')"
                >
                  <ALink
                    :class="{ 'white-icon': forceWhiteIcon }"
                    href="https://www.bilibili.com/history"
                    :title="$t('topbar.history')"
                    type="topBar"
                  >
                    <div i-mingcute:time-line />
                  </ALink>

                  <Transition name="slide-in">
                    <HistoryPop
                      v-if="popupVisible.history"
                      ref="historyTransformer"
                      class="bew-popover"
                      @click.stop="() => {}"
                    />
                  </Transition>
                </div>

                <!-- Watch later -->
                <div
                  ref="watchLater"
                  class="right-side-item"
                  :class="{ active: popupVisible.watchLater }"
                  @click="event => handleClickTopBarItem(event, 'watchLater')"
                >
                  <ALink
                    :class="{ 'white-icon': forceWhiteIcon }"
                    href="https://www.bilibili.com/watchlater/list"
                    :title="$t('topbar.watch_later')"
                    type="topBar"
                  >
                    <div i-mingcute:carplay-line />
                  </ALink>

                  <Transition name="slide-in">
                    <WatchLaterPop
                      v-if="popupVisible.watchLater"
                      ref="watchLaterTransformer"
                      class="bew-popover"
                      @click.stop="() => {}"
                    />
                  </Transition>
                </div>

                <!-- Creative center -->
                <div class="right-side-item">
                  <a
                    :class="{ 'white-icon': forceWhiteIcon }"
                    href="https://member.bilibili.com/platform/home"
                    target="_blank"
                    :title="$t('topbar.creative_center')"
                  >
                    <div i-mingcute:bulb-line />
                  </a>
                </div>
              </div>

              <!-- More -->
              <div
                ref="more"
                class="right-side-item lg:!hidden flex"
                :class="{ active: popupVisible.more }"
                @click="event => handleClickTopBarItem(event, 'more')"
              >
                <a
                  :class="{ 'white-icon': forceWhiteIcon }"
                  title="More"
                >
                  <div i-mingcute:menu-line />
                </a>

                <Transition name="slide-in">
                  <MorePop
                    v-show="popupVisible.more"
                    ref="moreTransformer"
                    class="bew-popover"
                    @click.stop="() => {}"
                  />
                </Transition>
              </div>

              <div class="hidden lg:flex" gap-1 items-center>
                <!-- Divider -->
                <div
                  :class="{ 'white-icon': forceWhiteIcon }"
                  w-2px h-16px bg="$bew-border-color" mx-1
                  rounded-4px
                />

                <!-- Upload -->
                <div
                  ref="upload"
                  class="right-side-item"
                  :class="{ active: popupVisible.upload }"
                  @click="event => handleClickTopBarItem(event, 'upload')"
                >
                  <a
                    class="upload"
                    :class="{ 'white-icon': forceWhiteIcon }"
                    style="backdrop-filter: var(--bew-filter-glass-1);"
                    href="https://member.bilibili.com/platform/upload/video/frame"
                    target="_blank"
                    :title="$t('topbar.upload')"
                  >
                    <div i-mingcute:upload-line flex-shrink-0 />
                  </a>

                  <Transition name="slide-in">
                    <UploadPop
                      v-if="popupVisible.upload"
                      ref="uploadTransformer"
                      class="bew-popover"
                      @click.stop="() => {}"
                    />
                  </Transition>
                </div>

                <!-- Notifications -->
                <div
                  ref="notifications"
                  class="right-side-item"
                  :class="{ active: popupVisible.notifications }"
                  @click="event => handleClickTopBarItem(event, 'notifications')"
                >
                  <template v-if="unReadMessageCount > 0">
                    <div
                      v-if="settings.topBarIconBadges === 'number'"
                      class="unread-num-dot"
                    >
                      {{ unReadMessageCount > 99 ? '99+' : unReadMessageCount }}
                    </div>
                    <div
                      v-else-if="settings.topBarIconBadges === 'dot'"
                      class="unread-dot"
                    />
                  </template>

                  <ALink
                    :href="settings.openNotificationsPageAsDrawer ? undefined : 'https://message.bilibili.com'"
                    :class="{ 'white-icon': forceWhiteIcon }"
                    :title="$t('topbar.notifications')"
                    type="topBar"
                    :custom-click-event="settings.openNotificationsPageAsDrawer"
                    @click="drawerVisible.notifications = true"
                  >
                    <div i-tabler:bell />
                  </ALink>

                  <Transition name="slide-in">
                    <NotificationsPop
                      v-if="popupVisible.notifications"
                      ref="notificationsTransformer"
                      class="bew-popover"
                      @click.stop="() => {}"
                      @item-click="handleNotificationsItemClick"
                    />
                  </Transition>
                </div>
              </div>
            </template>

            <!-- Avatar -->
            <div
              v-if="isLogin"
              ref="avatar"
              :class="{ hover: popupVisible.userPanel }"
              class="avatar right-side-item"
              @click="event => handleClickTopBarItem(event, 'userPanel')"
            >
              <ALink
                ref="avatarImg"
                :href="`https://space.bilibili.com/${mid}`"
                type="topBar"
                class="avatar-img"
                :class="{ hover: popupVisible.userPanel }"
                :style="{
                  backgroundImage: `url(${`${userInfo.face}`.replace(
                    'http:',
                    '',
                  )})`,
                }"
              />
              <div
                ref="avatarShadow"
                class="avatar-shadow"
                :class="{ hover: popupVisible.userPanel }"
                :style="{
                  backgroundImage: `url(${`${userInfo.face}`.replace(
                    'http:',
                    '',
                  )})`,
                }"
              />
              <svg
                v-if="userInfo.vip?.status === 1"
                class="vip-img"
                :class="{ hover: popupVisible.userPanel }"
                :style="{ opacity: popupVisible.userPanel ? 1 : 0 }"
                bg="[url(https://i0.hdslb.com/bfs/seed/jinkela/short/user-avatar/big-vip.svg)] contain no-repeat"
                w="28%" h="28%" z-1
                pos="absolute bottom--20px right-28px" duration-300
              />

              <Transition name="slide-in">
                <UserPanelPop
                  v-if="popupVisible.userPanel"
                  ref="avatarTransformer"
                  :user-info="userInfo"
                  after:h="!0"
                  class="bew-popover"
                  pos="!left-auto !right-0" transform="!translate-x-0"
                  @click.stop="() => {}"
                />
              </Transition>
            </div>
          </div>
        </div>
      </main>

      <KeepAlive v-if="settings.openNotificationsPageAsDrawer">
        <NotificationsDrawer
          v-if="drawerVisible.notifications"
          :url="notificationsDrawerUrl"
          @close="drawerVisible.notifications = false"
        />
      </KeepAlive>
    </header>
  </Transition>
</template>

<style lang="scss" scoped>
.top-bar-enter-active,
.top-bar-leave-active {
  transition: all 0.5s ease;
}

.top-bar-enter-from,
.top-bar-leave-to {
  --uno: "opacity-0 transform -translate-y-full";
}

.slide-in-enter-active,
.slide-in-leave-active {
  --uno: "transition-all duration-250 pointer-events-none transform-gpu";
}

.slide-in-leave-to,
.slide-in-enter-from {
  --uno: "transform mt--10px opacity-0";
}

.slide-out-enter-active,
.slide-out-leave-active {
  --uno: "transition-all duration-300 pointer-events-none transform-gpu";
}

.slide-out-leave-to,
.slide-out-enter-from {
  --uno: "transform important:-translate-y-4 opacity-0";
}

.fade-enter-active,
.fade-leave-active {
  --uno: "transition-all duration-600";
}

.fade-leave-to,
.fade-enter-from {
  --uno: "opacity-0";
}

.hide {
  transform: translateY(-100%);
}

:deep(.search-bar) {
  input:not(:focus, :focus-within) {
    --uno: "!border-$bew-border-color !shadow-$bew-shadow-1";
  }
}

.bew-popover {
  --uno: "absolute";
  --uno: "overflow-hidden";
  --uno: "after:content-empty";
  --uno: "after:opacity-100 after:w-full after:h-100px";
  --uno: "after:absolute after:top--30px after:left-1/2 after:-z-1";
  --uno: "after:transform after:-translate-x-1/2";
}

.logo.activated {
  --uno: "bg-$bew-theme-color";

  svg {
    --uno: "!fill-white !filter-none";
  }
}

.right-side {
  .avatar {
    --uno: "flex justify-center items-center relative z-1 rounded-1/2 w-46px h-46px";
    // --uno: "bg-$bew-elevated border-1 border-$bew-border-color";
    // --uno: "shadow-[var(--bew-shadow-edge-glow-1),var(--bew-shadow-2)]";
    // backdrop-filter: var(--bew-filter-glass-1);

    &.hover,
    &:hover {
      // --uno: "backdrop-filter-none bg-$bew-elevated-solid";
    }

    // Add a safety zone to prevent the avatar from collapsing quickly after leaving
    &:hover::after,
    &.hover::after {
      --uno: "content-empty absolute right-0 top-20px w-110px h-120px";
    }

    .avatar-img,
    .avatar-shadow {
      --uno: "shrink-0 duration-300 rounded-1/2 w-34px h-34px bg-cover bg-center";

      &.hover {
        --uno: "transform scale-230 translate-y-50px translate-x--36px";
      }
    }

    .avatar-img {
      --uno: "z-1";
    }

    .avatar-shadow {
      --uno: "opacity-0 absolute top-0 z-0 pointer-events-none blur-sm";

      &.hover {
        --uno: "opacity-60";
      }
    }

    .vip-img {
      &.hover {
        --uno: "transform scale-180 translate-y-55px translate-15px";
      }
    }
  }

  .unread-num-dot {
    --uno: "absolute top--2px right--4px";
    --uno: "important:px-1 rounded-full";
    --uno: "text-xs leading-0 z-6 min-w-14px h-14px";
    --uno: "grid place-items-center";
    --uno: "bg-$bew-theme-color text-white shadow-$bew-shadow-1";
  }

  .unread-dot {
    --uno: "w-8px h-8px bg-$bew-theme-color rounded-8px absolute right-2px top-2px";
  }
  .right-side-item {
    --uno: "relative text-$bew-text-1 flex items-center";

    &:not(.avatar) a,
    & .notifications {
      --uno: "text-lg grid place-items-center rounded-40px duration-300 relative z-5";
      --uno: "h-34px w-34px";
      filter: drop-shadow(0 0 4px var(--bew-bg));
    }

    &.active a,
    & a:hover,
    & .notifications:hover,
    & .notifications:active {
      --uno: "bg-$bew-fill-2";
    }

    &.active a.white-icon,
    & a:hover.white-icon,
    & .notifications:hover.white-icon,
    & .notifications:active.white-icon {
      --uno: "bg-white bg-opacity-20";
    }

    & a.upload {
      --uno: "bg-$bew-theme-color-20 hover:bg-$bew-theme-color-40 text-$bew-theme-color";
    }

    &.active a.upload {
      --uno: "bg-$bew-theme-color-40";
    }

    &.active a.upload.white-icon {
      --uno: "!bg-white !bg-opacity-40";
    }

    .white-icon {
      --uno: "text-white";
      filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.6)) !important;

      &.upload {
        --uno: "!bg-white !bg-opacity-20 hover:!bg-white hover:!bg-opacity-40 !filter-none";
        --uno: "!text-white";
      }
    }
  }

  .right-side-item .login {
    --uno: "!w-auto !flex items-center bg-$bew-theme-color-10";
    --uno: "rounded-full important:text-$bew-theme-color important:px-4 hover:important-bg-$bew-theme-color hover:important-text-white important:text-base";
  }
}
</style>
