<script setup lang="ts">
import { useMouseInElement } from '@vueuse/core'
import type { Ref, UnwrapNestedRefs } from 'vue'
import { onMounted, watch } from 'vue'

import { useApiClient } from '~/composables/api'
import { useBewlyApp } from '~/composables/useAppProvider'
import { useDelayedHover } from '~/composables/useDelayedHover'
import { settings } from '~/logic'
import { getUserID, isHomePage } from '~/utils/main'
import emitter from '~/utils/mitt'

import SearchBar from '../SearchBar/SearchBar.vue'
import ChannelsPop from './components/ChannelsPop.vue'
import FavoritesPop from './components/FavoritesPop.vue'
import HistoryPop from './components/HistoryPop.vue'
import MomentsPop from './components/MomentsPop.vue'
import MorePop from './components/MorePop.vue'
import NotificationsPop from './components/NotificationsPop.vue'
import UploadPop from './components/UploadPop.vue'
import UserPanelPop from './components/UserPanelPop.vue'
import WatchLaterPop from './components/WatchLaterPop.vue'
import { updateInterval } from './notify'
import type { UnReadDm, UnReadMessage, UserInfo } from './types'

// import { useTopBarStore } from '~/stores/topBarStore'

const props = withDefaults(defineProps<Props>(), {
  showSearchBar: true,
  showLogo: true,
})

// const popups = { NotificationsPop, MomentsPop, FavoritesPop, HistoryPop }

// const topBarStore = useTopBarStore()

interface Props {
  showSearchBar?: boolean
  showLogo?: boolean
  mask?: boolean
}

// const topBarItems = computed(() => {
//   return topBarStore.topBarItems
// })

const { activatedPage, scrollbarRef } = useBewlyApp()

const mid = getUserID() || ''
const userInfo = reactive<UserInfo | NonNullable<unknown>>({}) as UnwrapNestedRefs<UserInfo>

const hideTopBar = ref<boolean>(false)
const headerTarget = ref(null)
const { isOutside: isOutsideTopBar } = useMouseInElement(headerTarget)

// const showChannelsPop = ref<boolean>(false)
// const showUserPanelPop = ref<boolean>(false)
// const showNotificationsPop = ref<boolean>(false)
// const showMomentsPop = ref<boolean>(false)
// const showFavoritesPop = ref<boolean>(false)
// const showHistoryPop = ref<boolean>(false)
// const showWatchLaterPop = ref<boolean>(false)
// const showUploadPop = ref<boolean>(false)
// const showMorePop = ref<boolean>(false)

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
const api = useApiClient()
const isLogin = ref<boolean>(false)
const unReadMessage = reactive<UnReadMessage | NonNullable<unknown>>(
  {},
) as UnwrapNestedRefs<UnReadMessage>
const unReadDm = reactive<UnReadDm>({} as UnwrapNestedRefs<UnReadDm>)
const unReadMessageCount = ref<number>(0)
const newMomentsCount = ref<number>(0)

const logo = ref<HTMLElement>() as Ref<HTMLElement>
const avatarImg = ref<HTMLImageElement>() as Ref<HTMLImageElement>
const avatarShadow = ref<HTMLImageElement>() as Ref<HTMLImageElement>
const favoritesPopRef = ref<any>()
const momentsPopRef = ref()

const scrollTop = ref<number>(0)
const oldScrollTop = ref<number>(0)

function closeAllTopBarPopup(exceptionKey?: keyof typeof popupVisible) {
  Object.keys(popupVisible).forEach((key) => {
    if (key !== exceptionKey)
      popupVisible[key as keyof typeof popupVisible] = false
  })
}

// Channels
const channels = useDelayedHover({
  beforeEnter: () => closeAllTopBarPopup('channels'),
  enter: () => {
    logo.value.classList.add('activated')
    popupVisible.channels = true
  },
  leave: () => {
    logo.value.classList.remove('activated')
    popupVisible.channels = false
  },
})

// Avatar
const avatar = useDelayedHover({
  beforeEnter: () => closeAllTopBarPopup('userPanel'),
  enter: () => {
    popupVisible.userPanel = true
    avatarImg.value.classList.add('hover')
    avatarShadow.value.classList.add('hover')
  },
  beforeLeave: () => {
    popupVisible.userPanel = false
    avatarImg.value.classList.remove('hover')
    avatarShadow.value.classList.remove('hover')
  },
  leave: () => {
    popupVisible.userPanel = false
    avatarImg.value.classList.remove('hover')
    avatarShadow.value.classList.remove('hover')
  },
})

// Notifications
const notifications = useDelayedHover({
  beforeEnter: () => closeAllTopBarPopup('notifications'),
  enter: () => {
    popupVisible.notifications = true
  },
  leave: () => {
    popupVisible.notifications = false
  },
})
// Moments
const moments = useDelayedHover({
  beforeEnter: () => closeAllTopBarPopup('moments'),
  enter: () => {
    popupVisible.moments = true
    momentsPopRef.value && momentsPopRef.value.checkIfHasNewMomentsThenUpdateMoments()
  },
  leave: () => {
    popupVisible.moments = false
  },
})
// Favorites
const favorites = useDelayedHover({
  beforeEnter: () => closeAllTopBarPopup('favorites'),
  enter: () => {
    popupVisible.favorites = true
  },
  leave: () => {
    popupVisible.favorites = false
  },
})
// History
const history = useDelayedHover({
  beforeEnter: () => closeAllTopBarPopup('history'),
  enter: () => {
    popupVisible.history = true
  },
  leave: () => {
    popupVisible.history = false
  },
})
// Watch Later
const watchLater = useDelayedHover({
  beforeEnter: () => closeAllTopBarPopup('watchLater'),
  enter: () => {
    popupVisible.watchLater = true
  },
  leave: () => {
    popupVisible.watchLater = false
  },
})
// Upload
const upload = useDelayedHover({
  beforeEnter: () => closeAllTopBarPopup('upload'),
  enter: () => {
    popupVisible.upload = true
  },
  leave: () => {
    popupVisible.upload = false
  },
})
// More
const more = useDelayedHover({
  beforeEnter: () => closeAllTopBarPopup(),
  enter: () => {
    popupVisible.more = true
  },
  leave: () => popupVisible.more = false,
})

watch(() => settings.value.autoHideTopBar, (newVal) => {
  if (!newVal)
    toggleTopBarVisible(true)
})

watch(
  () => popupVisible.notifications,
  (newVal, oldVal) => {
    if (newVal === oldVal)
      return

    if (!newVal)
      getUnreadMessageCount()
  },
)

watch(
  () => popupVisible.moments,
  async (newVal, oldVal) => {
    if (newVal === oldVal)
      return

    if (!newVal)
      await getTopBarNewMomentsCount()
  },
)

watch(() => popupVisible.favorites, (newVal, oldVal) => {
  if (newVal === oldVal)
    return
  if (newVal) {
    nextTick(() => {
      if (favoritesPopRef.value)
        favoritesPopRef.value.refreshFavoriteResources()
    })
  }
})

watch(activatedPage, () => {
  toggleTopBarVisible(true)
})

onMounted(async () => {
  initData()
  await nextTick()
  toggleTopBarVisible(true)
  window.addEventListener('scroll', handleScroll)
})

onBeforeMount(() => {
  window.removeEventListener('scroll', handleScroll)
})

async function initData() {
  await getUserInfo()
  getUnreadMessageCount()
  getTopBarNewMomentsCount()

  // automatically update notifications and moments count
  setInterval(() => {
    getUnreadMessageCount()
    getTopBarNewMomentsCount()
  }, updateInterval)
}

function handleScroll() {
  if (isHomePage()) {
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

async function getUnreadMessageCount() {
  if (!isLogin.value)
    return

  let result = 0

  try {
    let res
    res = await useApiClient().notification.getUnreadMsg()
    if (res.code === 0) {
      Object.assign(unReadMessage, res.data)
      Object.entries(unReadMessage).forEach(([key, value]) => {
        if (key !== 'up' && key !== 'recv_reply' && key !== 'recv_like') {
          if (typeof value === 'number')
            result += value
        }
      })
    }

    res = await useApiClient().notification.getUnreadDm()
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

async function getTopBarNewMomentsCount() {
  if (!isLogin.value)
    return

  let result = 0

  try {
    const res = await useApiClient().moment.getTopBarNewMomentsCount()
    if (res.code === 0) {
      if (typeof res.data.update_info.item.count === 'number')
        result = res.data.update_info.item.count
    }
  }
  finally {
    newMomentsCount.value = result
  }
}

function toggleTopBarVisible(visible: boolean) {
  hideTopBar.value = !visible
  emitter.emit('topBarVisibleChange', visible)
}

defineExpose({
  toggleTopBarVisible,
  handleScroll,
})
</script>

<template>
  <header
    ref="headerTarget"
    w="full" transition="all 300 ease-in-out"
    :class="{ hide: hideTopBar }"
  >
    <main
      max-w="$bew-page-max-width" m-auto flex="~ justify-between items-center gap-4"
      p="lg:x-20 md:x-16 x-14" h="70px"
    >
      <!-- Top bar mask -->
      <div
        v-if="mask"
        style="
          mask-image: linear-gradient(to bottom,  black 40%, transparent);
          backdrop-filter:var(--bew-filter-glass-1)
        "
        pos="absolute top-0 left-0" w-full h-80px
        pointer-events-none transform-gpu
      />
      <Transition name="fade">
        <div
          v-if="mask"
          pos="absolute top-0 left-0" w-full h-80px
          pointer-events-none opacity-70
          :style="{
            background: `linear-gradient(to bottom, ${(
              settings.wallpaper
              || settings.useSearchPageModeOnHomePage
              && settings.searchPageWallpaper
              && settings.individuallySetSearchPageWallpaper)
              && isHomePage()
              ? 'rgba(0,0,0,.6)' : `${isHomePage() ? 'var(--bew-homepage-bg)' : 'var(--bew-bg)'}`}, transparent)`,
          }"
        />
      </Transition>

      <div shrink-0 flex="inline xl:1 justify-center">
        <div
          ref="channels"
          z-1 relative w-fit mr-auto
        >
          <Transition name="slide-out">
            <a
              v-show="showLogo"
              ref="logo" href="//www.bilibili.com"
              class="group logo"
              style="backdrop-filter: var(--bew-filter-glass-1)"
              flex items-center border="1 $bew-border-color"
              rounded="50px" p="x-4" shadow="$bew-shadow-2" duration-300
              bg="$bew-elevated-1 hover:$bew-theme-color dark-hover:white"
              w-auto h-50px transform-gpu
            >
              <svg
                t="1645466458357"
                viewBox="0 0 2299 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2663"
                width="50"
                height="40"
                duration-300
                un-fill="$bew-theme-color dark:white" un-group-hover:fill="white dark:$bew-theme-color"
              >
                <path
                  d="M1775.840814 322.588002c6.0164 1.002733 53.144869-9.525967 55.150336-6.016401 3.0082 4.5123 24.065601 155.92504 18.550567 156.927774s-44.621635 10.027334-44.621635 10.027334c-3.0082-20.556034-28.577901-147.903173-29.079268-160.938707m75.205003-14.539634l20.556034 162.944174c10.5287-0.501367 53.144869-3.509567 57.155803-4.010934-6.0164-61.668103-16.545101-158.933241-16.545101-158.93324-20.054668-4.010934-41.112069-4.010934-61.166736 0m-40.610702 226.116376s92.752838-23.564234 126.344406-12.0328c17.046467 61.668103 48.131202 407.611118 51.139402 421.649386-21.057401 2.506833-90.246004 8.523234-95.761037 10.027333-4.5123-26.071068-81.72277-403.098818-81.722771-419.643919m343.436183-207.565809c5.515034 1.5041 54.648969-5.013667 55.150335-1.5041 1.002733 12.032801 6.0164 157.42914 0.501367 157.930507s-44.621635 4.010934-44.621635 4.010934c-1.002733-20.054668-12.032801-146.90044-11.030067-160.437341m75.70637-4.010933l4.010933 160.938707c10.5287 0 52.643502 2.506833 57.155803 2.005467-1.002733-61.668103 0-158.933241 0-158.933241-20.054668-3.509567-40.610702-5.013667-61.166736-4.010933m-64.676303 216.089043s94.758304-12.534167 126.845772 2.506833c7.019134 72.196803 6.0164 408.613852 7.019134 422.652119-21.558768 0-90.246004 1.002733-95.761038 2.005467-1.002733-26.071068-39.607968-410.619319-38.103868-427.164419m-220.099977-413.627519c54.648969 278.759879 96.262404 755.058234 97.766504 785.641602 0 0 43.117535 1.002733 91.750105 4.010934C2105.740095 614.383415 2070.644427 134.575493 2071.145794 119.033126c-12.032801-13.536901-126.344406 6.0164-126.344406 6.0164m-120.328005 659.297196c-10.5287-78.213204-290.291313-166.955108-447.720454-138.377206 0 0-19.553301-172.470141-27.073801-339.425248-6.517767-143.390873-1.002733-282.770813 0.501366-305.833681-10.5287-7.5205-123.837572 46.627102-185.004308 69.188603 0 0 73.199537 309.844614 126.344406 952.59671 0 0 84.730971 9.0246 230.12731-19.051934s317.365114-115.815705 302.825481-219.097244m-341.932083 140.88404l-24.566967-176.982441c6.0164-3.0082 156.927774 53.144869 172.971507 63.172203-2.506833 11.030067-148.40454 113.810238-148.40454 113.810238M610.664628 322.588002c6.0164 1.002733 53.144869-9.525967 55.150335-6.016401 3.0082 4.5123 24.065601 155.92504 18.550568 156.927774s-44.621635 10.027334-44.621635 10.027334c-3.0082-20.556034-28.577901-147.903173-29.079268-160.938707m75.205003-14.539634l20.556034 162.944174c10.5287-0.501367 53.144869-3.509567 57.155803-4.010934-6.517767-61.668103-16.545101-158.933241-16.545101-158.93324-20.054668-4.010934-41.112069-4.010934-61.166736 0m-40.610702 226.116376s92.752838-23.564234 126.344406-12.0328c17.046467 61.668103 48.131202 407.611118 51.139402 421.649386-21.057401 2.506833-90.246004 8.523234-95.761037 10.027333-4.5123-26.071068-81.72277-403.098818-81.722771-419.643919m343.436182-207.565809c5.515034 1.5041 54.648969-5.013667 55.150336-1.5041 1.002733 12.032801 6.0164 157.42914 0.501367 157.930507s-44.621635 4.010934-44.621635 4.010934c-1.002733-20.054668-11.531434-146.90044-11.030068-160.437341m75.706371-4.010933l4.010933 160.938707c10.5287 0 52.643502 2.506833 57.155803 2.005467-1.002733-61.668103 0-158.933241 0-158.933241-20.054668-3.509567-40.610702-4.5123-61.166736-4.010933m-64.676303 216.089043s94.758304-12.534167 126.845772 2.506833c7.019134 72.196803 6.0164 408.613852 7.019134 422.652119-21.558768 0-90.246004 1.002733-95.761038 2.005467-0.501367-26.071068-39.607968-410.619319-38.103868-427.164419m-220.099977-413.627519c54.648969 278.759879 96.262404 755.058234 97.766504 785.641602 0 0 43.117535 1.002733 91.750105 4.010934-28.577901-300.318647-63.67357-780.126569-63.172203-796.170303-12.032801-13.035534-126.344406 6.517767-126.344406 6.517767m-120.328005 659.297196c-10.5287-78.213204-290.291313-166.955108-447.720454-138.377206 0 0-19.553301-172.470141-27.073801-339.425248-6.517767-143.390873-1.002733-282.770813 0.501366-305.833681C174.475608-6.308547 61.166736 47.337689 0 69.89919c0 0 73.199537 309.844614 126.344406 952.59671 0 0 84.730971 9.0246 230.12731-19.051934s317.365114-115.815705 302.825481-219.097244m-341.932083 140.88404l-24.566967-176.982441c6.0164-3.0082 156.927774 53.144869 172.971507 63.172203-2.506833 11.030067-148.40454 113.810238-148.40454 113.810238"
                  p-id="2664"
                />
              </svg>
            </a>
          </Transition>

          <Transition name="slide-in">
            <ChannelsPop
              v-show="popupVisible.channels"
              class="bew-popover"
              pos="!left-0 !top-70px"
              transform="!translate-x-0"
            />
          </Transition>
        </div>
      </div>

      <!-- search bar -->
      <div flex="inline 1 md:justify-center <md:justify-end items-center" w="full">
        <Transition name="slide-out">
          <SearchBar
            v-if="props.showSearchBar"
            style="
              --b-search-bar-color: var(--bew-elevated-1);
              --b-search-bar-hover: var(--bew-elevated-1-hover);
            "
          />
        </Transition>
      </div>

      <!-- right content -->
      <div
        class="right-side"
        flex="inline xl:1 justify-center items-center"
      >
        <div
          style="backdrop-filter: var(--bew-filter-glass-1)"
          ml-auto flex h-55px p-2 bg="$bew-elevated-1"
          text="$bew-text-1" border="1 $bew-border-color" rounded-full shadow="$bew-shadow-2"
          transform-gpu
        >
          <div v-if="!isLogin" class="right-side-item">
            <a href="https://passport.bilibili.com/login" class="login">
              <div i-ic:outline-account-circle class="text-xl mr-2" />{{
                $t('topbar.sign_in')
              }}
            </a>
          </div>
          <template v-if="isLogin">
            <!-- Avatar -->
            <div
              ref="avatar"
              class="avatar right-side-item"
            >
              <a
                ref="avatarImg"
                :href="`https://space.bilibili.com/${mid}`"
                :target="isHomePage() ? '_blank' : '_self'"
                class="avatar-img"
                rounded-full
                z-1
                w-38px
                h-38px
                bg="$bew-fill-3 cover center"
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
                pos="absolute top-0"
                bg="cover center"
                blur-sm
                opacity="60"
                rounded-full
                z-0
                w-38px
                h-38px
                :style="{
                  backgroundImage: `url(${`${userInfo.face}`.replace(
                    'http:',
                    '',
                  )})`,
                }"
              />
              <Transition name="slide-in">
                <UserPanelPop
                  v-if="popupVisible.userPanel"
                  :user-info="userInfo"
                  after:h="!0"
                  class="bew-popover"
                />
              </Transition>
            </div>

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
              <!-- Notifications -->
              <div
                ref="notifications"
                class="right-side-item"
                :class="{ active: popupVisible.notifications }"
              >
                <template v-if="unReadMessageCount > 0">
                  <div
                    v-if="settings.topBarIconBadges === 'number'"
                    class="unread-message"
                  >
                    {{ unReadMessageCount > 99 ? '99+' : unReadMessageCount }}
                  </div>
                  <div
                    v-else-if="settings.topBarIconBadges === 'dot'"
                    w-8px h-8px bg="$bew-theme-color" rounded-8px pos="absolute right-0 top-0"
                  />
                </template>
                <a
                  href="https://message.bilibili.com"
                  :target="isHomePage() ? '_blank' : '_self'"
                  :title="$t('topbar.notifications')"
                >
                  <div i-tabler:bell />
                </a>

                <Transition name="slide-in">
                  <NotificationsPop
                    v-if="popupVisible.notifications"
                    class="bew-popover"
                  />
                </Transition>
              </div>

              <!-- Moments -->
              <div
                ref="moments"
                class="right-side-item"
                :class="{ active: popupVisible.moments }"
              >
                <template v-if="newMomentsCount > 0">
                  <div
                    v-if="settings.topBarIconBadges === 'number'"
                    class="unread-message"
                  >
                    {{ newMomentsCount > 99 ? '99+' : newMomentsCount }}
                  </div>
                  <div
                    v-else-if="settings.topBarIconBadges === 'dot'"
                    w-8px h-8px bg="$bew-theme-color" rounded-8px pos="absolute right-0 top-0"
                  />
                </template>
                <a
                  href="https://t.bilibili.com"
                  :target="isHomePage() ? '_blank' : '_self'"
                  :title="$t('topbar.moments')"
                >
                  <div i-tabler:windmill />
                </a>

                <Transition name="slide-in">
                  <MomentsPop v-show="popupVisible.moments" ref="momentsPopRef" class="bew-popover" />
                </Transition>
              </div>

              <!-- Favorites -->
              <div
                ref="favorites"
                class="right-side-item"
                :class="{ active: popupVisible.favorites }"
              >
                <a
                  :href="`https://space.bilibili.com/${mid}/favlist`"
                  :target="isHomePage() ? '_blank' : '_self'"
                  :title="$t('topbar.favorites')"
                >
                  <div i-mingcute:star-line />
                </a>

                <Transition name="slide-in">
                  <KeepAlive>
                    <FavoritesPop
                      v-if="popupVisible.favorites"
                      ref="favoritesPopRef"
                      class="bew-popover"
                    />
                  </KeepAlive>
                </Transition>
              </div>

              <!-- History -->
              <div
                ref="history"
                class="right-side-item"
                :class="{ active: popupVisible.history }"
              >
                <a
                  href="https://www.bilibili.com/account/history"
                  :target="isHomePage() ? '_blank' : '_self'"
                  :title="$t('topbar.history')"
                >
                  <div i-mingcute:time-line />
                </a>

                <Transition name="slide-in">
                  <HistoryPop v-if="popupVisible.history" class="bew-popover" />
                </Transition>
              </div>

              <!-- Watch later -->
              <div
                ref="watchLater"
                class="right-side-item"
                :class="{ active: popupVisible.watchLater }"
              >
                <a
                  href="https://www.bilibili.com/watchlater/#/list"
                  :target="isHomePage() ? '_blank' : '_self'"
                  :title="$t('topbar.watch_later')"
                >
                  <div i-mingcute:carplay-line />
                </a>

                <Transition name="slide-in">
                  <WatchLaterPop v-if="popupVisible.watchLater" class="bew-popover" />
                </Transition>
              </div>

              <!-- Creative center -->
              <div class="right-side-item">
                <a
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
            >
              <a title="More">
                <div i-mingcute:menu-line />
              </a>

              <Transition name="slide-in">
                <MorePop v-show="popupVisible.more" class="bew-popover" />
              </Transition>
            </div>

            <!-- Upload -->
            <div
              ref="upload"
              class="upload right-side-item"
            >
              <a
                href="https://member.bilibili.com/platform/upload/video/frame"
                target="_blank"
                bg="$bew-theme-color"
                rounded-40px
                un-text="!white !base"
                mx-1
                flex="~"
                justify="center"
                w="xl:100px 38px"
                h="xl:auto 38px"
                p="xl:auto x-4"
                shadow
                filter="hover:brightness-110"
                style="--un-shadow: 0 0 10px var(--bew-theme-color-60)"
              >
                <div i-mingcute:upload-2-line flex-shrink-0 />
                <span m="l-2" class="hidden xl:block">{{
                  $t('topbar.upload')
                }}</span>
              </a>

              <Transition name="slide-in">
                <UploadPop
                  v-if="popupVisible.upload"
                  class="bew-popover"
                  pos="!left-auto !right-0"
                  transform="!translate-x-0"
                />
              </Transition>
            </div>
          </template>
        </div>
      </div>
    </main>
  </header>
</template>

<style lang="scss" scoped>
.slide-in-enter-active,
.slide-in-leave-active {
  --at-apply: transition-all duration-300 pointer-events-none transform-gpu;
}

.slide-in-leave-to,
.slide-in-enter-from {
  --at-apply: transform important:translate-y-4 opacity-0;
}

.slide-out-enter-active,
.slide-out-leave-active {
  --at-apply: transition-all duration-300 pointer-events-none transform-gpu;
}

.slide-out-leave-to,
.slide-out-enter-from {
  --at-apply: transform important:-translate-y-4 opacity-0;
}

.fade-enter-active,
.fade-leave-active {
  --at-apply: transition-all duration-600;
}

.fade-leave-to,
.fade-enter-from {
  --at-apply: opacity-0;
}

.hide {
  transform: translateY(-100%);
}

.bew-popover {
  --at-apply: absolute top-60px left-1/2
    transform -translate-x-1/2
    overflow-visible
    after:content-empty
    after:opacity-100 after:w-full after:h-100px
    after:absolute after:top--30px after:left-1/2 after:-z-1
    after:transform after:-translate-x-1/2;
}

.logo.activated {
  --at-apply: bg-$bew-theme-color dark:bg-white;

  svg {
    --at-apply: fill-white dark:fill-$bew-theme-color;
  }
}

.right-side {

  .unread-message {
    --at-apply: absolute -top-1 right-0
      important:px-1 important:py-2 rounded-full
      text-xs leading-0 z-1 min-w-16px h-16px
      flex justify-center items-center
      bg-$bew-theme-color  text-white;
    box-shadow: 0 2px 4px rgba(var(--tw-shadow-color), 0.4);
  }

  .right-side-item {
    --at-apply: relative text-$bew-text-1 flex items-center;

    &:not(.avatar) a {
      --at-apply: text-xl flex items-center p-2 rounded-40px duration-300 relative z-5;
      // --at-apply: after:content-empty after:absolute after:w-120% after:h-120% after:z-0 after:bg-yellow;
    }

    &.active a, &:not(.upload) a:hover {
      --un-drop-shadow: drop-shadow(0 0 6px white);
      --at-apply: bg-$bew-fill-2;
    }
  }

  .right-side-item .login {
    --un-drop-shadow: drop-shadow(0 0 6px var(--bew-theme-color));
    --at-apply: rounded-full mx-1
      important:text-$bew-theme-color important:px-4
      hover:important-bg-$bew-theme-color hover:important-text-white
      flex items-center justify-center important:text-base w-120px
      border-solid border-$bew-theme-color border-2
      important:dark:filter;
  }

  .avatar {
    --at-apply: flex items-center ml-2px pr-2 relative z-1;

    .avatar-img,
    .avatar-shadow {
      --at-apply: duration-300;

      &.hover {
        --at-apply: transform scale-230 important:translate-y-36px;
      }
    }

    .avatar-shadow {
      --at-apply: pointer-events-none;
    }
  }
}
</style>
