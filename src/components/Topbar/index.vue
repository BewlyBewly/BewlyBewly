<script lang="ts">
import MomentsDropdown from './MomentsDropdown.vue'
import { updateInterval } from './notify'
import { getUserID } from '~/utils'

export default defineComponent({
  components: { MomentsDropdown },
  data() {
    return {
      mid: getUserID() || '',
      userInfo: {} as any,
      showLogoDropDown: false,
      showUserPanel: false,
      showTopbarMask: false,
      showNotificationsDropDown: false,
      showMomentsDropDown: false,
      showUploadDropDown: false,
      isLogin: !!getUserID(),
      unReadmessage: {},
      unReadDm: {},
      unReadmessageCount: 0,
      newMomentsCount: 0,
    }
  },
  watch: {
    showNotificationsDropDown(val) {
      this.getUnreadMessageCount()
    },
    showMomentsDropDown(val) {
      this.getNewMomentsCount()
    },
  },
  mounted() {
    this.initUserPanel()

    document.addEventListener('scroll', () => {
      if (window.scrollY > 0)
        this.showTopbarMask = true
      else
        this.showTopbarMask = false
    })
  },
  methods: {
    initUserPanel() {
      this.getUserInfo()
      this.getUnreadMessageCount()
      this.getNewMomentsCount()

      // automatically update notifications and moments count
      setInterval(() => {
        this.getUnreadMessageCount()
        this.getNewMomentsCount()
      }, updateInterval)
    },
    showLogoMenuDropdown() {
      const logo = this.$refs.logo as HTMLElement
      logo.classList.add('hover')
      this.showLogoDropDown = true
    },
    closeLogoMenuDropdown() {
      const logo = this.$refs.logo as HTMLElement
      logo.classList.remove('hover')
      this.showLogoDropDown = false
    },
    openUserPanel() {
      this.showUserPanel = true
      const avatarImg = this.$refs.avatarImg as HTMLImageElement
      const avatarShadow = this.$refs.avatarShadow as HTMLImageElement
      avatarImg.classList.add('hover')
      avatarShadow.classList.add('hover')
    },
    closeUserPanel() {
      this.showUserPanel = false
      const avatarImg = this.$refs.avatarImg as HTMLImageElement
      const avatarShadow = this.$refs.avatarShadow as HTMLImageElement
      avatarImg.classList.remove('hover')
      avatarShadow.classList.remove('hover')
    },
    getUserInfo() {
      browser.runtime
        .sendMessage({
          contentScriptQuery: 'getUserInfo',
        })
        .then((res) => {
          if (res.code === 0)
            this.userInfo = res.data
        })
    },
    async getUnreadMessageCount() {
      if (!this.isLogin)
        return

      await browser.runtime
        .sendMessage({
          contentScriptQuery: 'getUnreadMsg',
        }).then(res => this.unReadmessage = res.data)

      await browser.runtime
        .sendMessage({
          contentScriptQuery: 'getUnreadDm',
        }).then(res => this.unReadDm = res.data)

      this.unReadmessageCount = 0
      for (const [key, value] of Object.entries(this.unReadmessage))
        if (key !== 'up') this.unReadmessageCount += parseInt(`${value}`)
      for (const [, value] of Object.entries(this.unReadDm))
        this.unReadmessageCount += parseInt(`${value}`)
    },
    getNewMomentsCount() {
      if (!this.isLogin)
        return

      browser.runtime
        .sendMessage({
          contentScriptQuery: 'getNewMomentsCount',
        }).then((res) => {
          this.newMomentsCount = res.data.update_info.item.count
        })
    },
  },
})
</script>

<template>
  <header
    flex="~"
    justify="between"
    align="items-center"
    p="lg:x-23 <lg:x-16 y-2"
    w="screen"
  >
    <transition name="topbar">
      <div
        v-show="showTopbarMask"
        class="fixed top-0 left-0"
        w="full"
        h="160px"
        opacity="100"
        pointer="none"
        style="background: linear-gradient(var(--bew-bg), transparent)"
      ></div>
    </transition>

    <div
      class="left-side"
      @mouseenter.self="showLogoMenuDropdown()"
      @mouseleave.self="closeLogoMenuDropdown()"
    >
      <div
        ref="logo"
        class="logo"
      >
        <svg
          t="1645466458357"
          class="icon"
          viewBox="0 0 2299 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2663"
          width="60"
          height="60"
        >
          <path
            d="M1775.840814 322.588002c6.0164 1.002733 53.144869-9.525967 55.150336-6.016401 3.0082 4.5123 24.065601 155.92504 18.550567 156.927774s-44.621635 10.027334-44.621635 10.027334c-3.0082-20.556034-28.577901-147.903173-29.079268-160.938707m75.205003-14.539634l20.556034 162.944174c10.5287-0.501367 53.144869-3.509567 57.155803-4.010934-6.0164-61.668103-16.545101-158.933241-16.545101-158.93324-20.054668-4.010934-41.112069-4.010934-61.166736 0m-40.610702 226.116376s92.752838-23.564234 126.344406-12.0328c17.046467 61.668103 48.131202 407.611118 51.139402 421.649386-21.057401 2.506833-90.246004 8.523234-95.761037 10.027333-4.5123-26.071068-81.72277-403.098818-81.722771-419.643919m343.436183-207.565809c5.515034 1.5041 54.648969-5.013667 55.150335-1.5041 1.002733 12.032801 6.0164 157.42914 0.501367 157.930507s-44.621635 4.010934-44.621635 4.010934c-1.002733-20.054668-12.032801-146.90044-11.030067-160.437341m75.70637-4.010933l4.010933 160.938707c10.5287 0 52.643502 2.506833 57.155803 2.005467-1.002733-61.668103 0-158.933241 0-158.933241-20.054668-3.509567-40.610702-5.013667-61.166736-4.010933m-64.676303 216.089043s94.758304-12.534167 126.845772 2.506833c7.019134 72.196803 6.0164 408.613852 7.019134 422.652119-21.558768 0-90.246004 1.002733-95.761038 2.005467-1.002733-26.071068-39.607968-410.619319-38.103868-427.164419m-220.099977-413.627519c54.648969 278.759879 96.262404 755.058234 97.766504 785.641602 0 0 43.117535 1.002733 91.750105 4.010934C2105.740095 614.383415 2070.644427 134.575493 2071.145794 119.033126c-12.032801-13.536901-126.344406 6.0164-126.344406 6.0164m-120.328005 659.297196c-10.5287-78.213204-290.291313-166.955108-447.720454-138.377206 0 0-19.553301-172.470141-27.073801-339.425248-6.517767-143.390873-1.002733-282.770813 0.501366-305.833681-10.5287-7.5205-123.837572 46.627102-185.004308 69.188603 0 0 73.199537 309.844614 126.344406 952.59671 0 0 84.730971 9.0246 230.12731-19.051934s317.365114-115.815705 302.825481-219.097244m-341.932083 140.88404l-24.566967-176.982441c6.0164-3.0082 156.927774 53.144869 172.971507 63.172203-2.506833 11.030067-148.40454 113.810238-148.40454 113.810238M610.664628 322.588002c6.0164 1.002733 53.144869-9.525967 55.150335-6.016401 3.0082 4.5123 24.065601 155.92504 18.550568 156.927774s-44.621635 10.027334-44.621635 10.027334c-3.0082-20.556034-28.577901-147.903173-29.079268-160.938707m75.205003-14.539634l20.556034 162.944174c10.5287-0.501367 53.144869-3.509567 57.155803-4.010934-6.517767-61.668103-16.545101-158.933241-16.545101-158.93324-20.054668-4.010934-41.112069-4.010934-61.166736 0m-40.610702 226.116376s92.752838-23.564234 126.344406-12.0328c17.046467 61.668103 48.131202 407.611118 51.139402 421.649386-21.057401 2.506833-90.246004 8.523234-95.761037 10.027333-4.5123-26.071068-81.72277-403.098818-81.722771-419.643919m343.436182-207.565809c5.515034 1.5041 54.648969-5.013667 55.150336-1.5041 1.002733 12.032801 6.0164 157.42914 0.501367 157.930507s-44.621635 4.010934-44.621635 4.010934c-1.002733-20.054668-11.531434-146.90044-11.030068-160.437341m75.706371-4.010933l4.010933 160.938707c10.5287 0 52.643502 2.506833 57.155803 2.005467-1.002733-61.668103 0-158.933241 0-158.933241-20.054668-3.509567-40.610702-4.5123-61.166736-4.010933m-64.676303 216.089043s94.758304-12.534167 126.845772 2.506833c7.019134 72.196803 6.0164 408.613852 7.019134 422.652119-21.558768 0-90.246004 1.002733-95.761038 2.005467-0.501367-26.071068-39.607968-410.619319-38.103868-427.164419m-220.099977-413.627519c54.648969 278.759879 96.262404 755.058234 97.766504 785.641602 0 0 43.117535 1.002733 91.750105 4.010934-28.577901-300.318647-63.67357-780.126569-63.172203-796.170303-12.032801-13.035534-126.344406 6.517767-126.344406 6.517767m-120.328005 659.297196c-10.5287-78.213204-290.291313-166.955108-447.720454-138.377206 0 0-19.553301-172.470141-27.073801-339.425248-6.517767-143.390873-1.002733-282.770813 0.501366-305.833681C174.475608-6.308547 61.166736 47.337689 0 69.89919c0 0 73.199537 309.844614 126.344406 952.59671 0 0 84.730971 9.0246 230.12731-19.051934s317.365114-115.815705 302.825481-219.097244m-341.932083 140.88404l-24.566967-176.982441c6.0164-3.0082 156.927774 53.144869 172.971507 63.172203-2.506833 11.030067-148.40454 113.810238-148.40454 113.810238"
            p-id="2664"
          />
        </svg>

        <tabler:chevron-down w="!4" h="!4" m="l-4" icon="stroke-4 fill-$bew-text-1" />
      </div>
      <transition name="slide">
        <logo-menu-dropdown
          v-if="showLogoDropDown"
          class="bew-popover"
          pos="!left-0 !top-70px"
          transform="!translate-x-0"
        ></logo-menu-dropdown>
      </transition>
    </div>

    <!-- search bar -->
    <div
      flex="~"
      w="full"
      justify="md:center <md:end"
    >
      <!-- <button
        class="icon-btn"
        text="$bew-text-1 2xl"
        display="!md:hidden !<md:block"
        m="r-4"
      >
        <tabler:search />
      </button> -->
      <search-bar
        ref="searchBar"
      ></search-bar>
    </div>

    <!-- right content -->
    <div class="right-side">
      <div v-if="!isLogin" class="right-side-item">
        <a href="https://passport.bilibili.com/login" class="login">
          <ic-outline-account-circle class="text-base mr-2" />{{ $t('topbar.sign_in') }}
        </a>
      </div>
      <template v-if="isLogin">
        <div
          id="avatar"
          class="right-side-item"
          @mouseenter="openUserPanel"
          @mouseleave="closeUserPanel"
        >
          <a
            id="avatar-img"
            ref="avatarImg"
            :href="'https://space.bilibili.com/' + mid"
            target="_blank"
            class="rounded-full z-1 w-40px h-40px bg-$bew-fill-3 bg-cover bg-center"
            :style="{ backgroundImage: `url(${(userInfo.face + '').replace('http:', '')})` }"
          ></a>
          <div
            id="avatar-shadow"
            ref="avatarShadow"
            class="absolute top-0 rounded-full z-0 w-40px h-40px filter blur-sm bg-cover bg-center"
            opacity="80"
            :style="{ backgroundImage: `url(${(userInfo.face + '').replace('http:', '')})` }"
          ></div>
          <transition name="slide">
            <user-panel-dropdown
              v-if="showUserPanel"
              ref="userPanelDropdown"
              :user-info="userInfo"
              after:h="!0"
              class="bew-popover"
            ></user-panel-dropdown>
          </transition>
        </div>

        <!-- Notifications -->
        <div
          class="right-side-item"
          @mouseenter="showNotificationsDropDown = true"
          @mouseleave="showNotificationsDropDown = false"
        >
          <div
            v-if="unReadmessageCount !== 0"
            class="unread-message"
          >
            {{ unReadmessageCount > 999 ? '999+' : unReadmessageCount }}
          </div>
          <a
            href="https://message.bilibili.com"
            target="_blank"
            :title="$t('topbar.notifications')"
          >
            <tabler:bell />
          </a>

          <transition name="slide">
            <notifications-dropdown
              v-if="showNotificationsDropDown"
              ref="notificationsDropdown"
              class="bew-popover"
            ></notifications-dropdown>
          </transition>
        </div>

        <!-- Moments -->
        <div
          class="right-side-item"
          @mouseenter="showMomentsDropDown = true"
          @mouseleave="showMomentsDropDown = false"
        >
          <div
            v-if="newMomentsCount !== 0"
            class="unread-message"
          >
            {{ newMomentsCount > 999 ? '999+' : newMomentsCount }}
          </div>
          <a
            href="https://t.bilibili.com"
            target="_blank"
            :title="$t('topbar.moments')"
          >
            <tabler:windmill />
          </a>

          <transition name="slide">
            <moments-dropdown
              v-if="showMomentsDropDown"
              class="bew-popover"
            >
            </moments-dropdown>
          </transition>
        </div>

        <!-- Favorites -->
        <div class="right-side-item">
          <a
            :href="'https://space.bilibili.com/' + mid + '/favlist'"
            target="_blank"
            :title="$t('topbar.favorites')"
          >
            <tabler:star />
          </a>
        </div>

        <!-- History -->
        <div class="right-side-item">
          <a
            href="https://www.bilibili.com/account/history"
            target="_blank"
            :title="$t('topbar.history')"
          >
            <tabler:clock />
          </a>
        </div>
        <div class="right-side-item">
          <a
            href="https://member.bilibili.com/platform/home"
            target="_blank"
            :title="$t('topbar.creative_center')"
          >
            <tabler:bulb />
          </a>
        </div>
        <div
          class="right-side-item"
          @mouseenter="showUploadDropDown = true"
          @mouseleave="showUploadDropDown = false"
        >
          <a
            href="https://member.bilibili.com/platform/upload/video/frame"
            target="_blank"
            class="bg-$bew-theme-color rounded-full !text-white !text-base !px-4 mx-1"
            flex="~"
            justify="center"
            w="xl:100px <xl:42px"
            h="xl:auto <xl:42px"
            p="xl:auto <xl:unset"
          >
            <tabler:upload />
            <span
              m="l-2"
              display="xl:block <xl:hidden"
            >{{ $t('topbar.upload') }}</span>
          </a>

          <transition name="slide">
            <upload-dropdown
              v-if="showUploadDropDown"
              class="bew-popover"
              pos="!left-auto !-right-2"
              transform="!translate-x-0"
            ></upload-dropdown>
          </transition>
        </div>
      </template>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  @apply transition-all duration-300 pointer-events-none transform-gpu;
}

.slide-leave-to,
.slide-enter-from {
  @apply transform '!-translate-y-4' opacity-0;
}

.topbar-enter-active,
.topbar-leave-active {
  @apply transition-all duration-600;
}

.topbar-leave-to,
.topbar-enter-from {
  @apply opacity-0;
}

.bew-popover {
  @apply absolute top-60px left-1/2
    transform -translate-x-1/2
    after:content-open-quote
    after:opacity-0 after:w-full after:h-16
    after:absolute after:-top-8 after:left-0 after:-z-1;
}

.left-side {
  @apply relative;
  .logo {
    @apply flex items-center;

    &.hover {
      svg:nth-child(2) {
        @apply transform rotate-180;
      }
    }

    svg {
      @apply w-60px h-auto filter drop-shadow-lg
      fill-$bew-logo-color;

      &:nth-child(2) {
        @apply duration-300;
      }
    }
  }
}
.right-side {
  @apply flex h-60px items-center rounded-full p-2
    bg-$bew-content-1 text-$bew-text-1;
  backdrop-filter: var(--bew-filter-glass);
  box-shadow: var(--bew-shadow-2);

  .unread-message {
    @apply absolute -top-1 right-0 "!px-1" "!py-2" rounded-full
      text-xs leading-0 z-1 min-w-16px h-16px
      flex justify-center items-center
      bg-$bew-theme-color  text-white;
    box-shadow: 0 2px 4px rgba(var(--tw-shadow-color), 0.4);
  }

  &-item {
    @apply relative text-$bew-text-1 mx-2 last:mr-0;
  }

  &-item:not(#avatar) {
    a {
      @apply text-xl flex items-center p-2;
    }
  }

  .login {
    @apply rounded-full "!text-$bew-theme-color" "!px-4" mx-1 border-1
      flex items-center justify-center "!text-base" w-120px
      border-solid border-$bew-theme-color;
  }

  #avatar {
    @apply flex items-center ml-1 pr-2 relative z-1;

    #avatar-img,
    #avatar-shadow {
      @apply duration-300;

      &.hover {
        @apply transform scale-230 translate-y-4;
      }
    }

    #avatar-shadow {
      @apply pointer-events-none;
    }
  }
}
</style>
