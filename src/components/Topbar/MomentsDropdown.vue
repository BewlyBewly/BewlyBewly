<script lang="ts">
import { isNewArticle, isNewVideo, setLastestOffsetID } from './notify'
import { language } from '~/logic'
import { getUserID, calcTimeSince } from '~/utils'
import { MomentItem, MomentType, LanguageType } from '~/types'

export default defineComponent({
  data() {
    return {
      moments: [] as MomentItem[],
      calcTimeSince,
      MomentType,
      momentTabs: [
        {
          id: 0,
          name: this.$t('topbar.moments_dropdown.tabs.videos'),
          isSelected: true,
        },
        {
          id: 1,
          name: this.$t('topbar.moments_dropdown.tabs.live'),
          isSelected: false,
        },
        {
          id: 2,
          name: this.$t('topbar.moments_dropdown.tabs.articles'),
          isSelected: false,
        },
      ],
      selectedTab: 0,
      isLoading: false,
      // when noMoreContent is true, the user can't scroll down to load more content
      noMoreContent: false,
      livePage: 1,
      LanguageType,
      language,
    }
  },
  watch: {
    selectedTab(newVal: number, oldVal: number) {
      if (newVal === oldVal) return

      this.scrollToTop(this.$refs.momentsWrap as HTMLElement, 300)
      this.moments = []
      if (newVal === 0) {
        this.getNewMoments([MomentType.Video, MomentType.Bangumi])
      }
      else if (newVal === 1) {
        this.livePage = 1
        this.getLiveMoments(this.livePage)
      }
      else if (newVal === 2) {
        this.getNewMoments([MomentType.Article])
      }
    },
  },
  mounted() {
    this.getNewMoments([MomentType.Video, MomentType.Bangumi])

    const momentsWrap = this.$refs.momentsWrap as HTMLDivElement
    momentsWrap.addEventListener('scroll', () => {
      if (momentsWrap.clientHeight + momentsWrap.scrollTop >= momentsWrap.scrollHeight
        && this.moments.length > 0 && !this.isLoading) {
        if (this.selectedTab === 0 && !this.noMoreContent)
          this.getHistoryMoments([MomentType.Video, MomentType.Bangumi])
        else if (this.selectedTab === 1 && !this.noMoreContent)
          this.getLiveMoments(this.livePage)
        else if (this.selectedTab === 2 && !this.noMoreContent)
          this.getHistoryMoments([MomentType.Article])
      }
    })
  },
  methods: {
    onClickTab(tabId: number) {
      // Prevent changing tab when loading, cuz it will cause a bug
      if (this.isLoading) return

      this.selectedTab = tabId
      this.momentTabs.forEach((tab) => {
        tab.isSelected = tab.id === tabId
      })
    },
    getNewMoments(typeList: number[]) {
      this.isLoading = true
      browser.runtime.sendMessage({
        contentScriptQuery: 'getNewMoments',
        uid: getUserID(),
        typeList,
      }).then((res) => {
        if (res.code === 0) {
          if (this.moments.length !== 0 && res.data.cards.length < 20) {
            this.isLoading = false
            this.noMoreContent = true
            return
          }

          res.data.cards.forEach((item: any) => {
            this.pushItemIntoMoments(item)
          })

          // set this lastest offset id, which will clear the new moment's marker point
          // after you watch these moments.
          if (this.selectedTab === 0)
            setLastestOffsetID(MomentType.Video, this.moments[0].id)
          else if (this.selectedTab === 2)
            setLastestOffsetID(MomentType.Article, this.moments[0].id)

          this.noMoreContent = false
        }
        this.isLoading = false
      })
    },
    getHistoryMoments(typeList: number[]) {
      this.isLoading = true
      browser.runtime.sendMessage({
        contentScriptQuery: 'getHistoryMoments',
        uid: getUserID(),
        typeList,
        offsetDynamicID: this.moments[this.moments.length - 1].dynamic_id_str,
      }).then((res) => {
        if (res.code === 0) {
          if (res.data.has_more === 0) {
            this.isLoading = false
            this.noMoreContent = true
            return
          }

          res.data.cards.forEach((item: any) => {
            this.pushItemIntoMoments(item)
          })
          this.noMoreContent = false
        }
        this.isLoading = false
      })
    },
    getLiveMoments(page: number) {
      this.isLoading = true
      browser.runtime.sendMessage({
        contentScriptQuery: 'getLiveMoments',
        page,
        pageSize: 10,
      }).then((res) => {
        if (res.code === 0) {
          // if the length of this list is less then the pageSize, it means that it have no more contents
          if (this.moments.length !== 0 && res.data.list.length < 10) {
            this.isLoading = false
            this.noMoreContent = true
            return
          }

          // if the length of this list is equal to the pageSize, this means that it may have the next page.
          if (res.data.list.length === 10)
            this.livePage++
          res.data.list.forEach((item: any) => {
            this.moments.push({
              id: item.roomid,
              uid: item.uid,
              name: item.uname,
              face: item.face,
              url: item.link,
              title: item.title,
              cover: item.pic,
            } as MomentItem)
          })
          this.noMoreContent = false
        }
        this.isLoading = false
      })
    },
    pushItemIntoMoments(item: any) {
      const card = JSON.parse(item.card)

      if (item.desc.type === MomentType.Video) {
        // if this is a video moment
        this.moments.push({
          type: item.desc.type,
          id: item.desc.dynamic_id,
          uid: item.desc.uid,
          name: item.desc.user_profile.info.uname,
          face: item.desc.user_profile.info.face,
          aid: card.aid,
          bvid: item.desc.bvid,
          url: card.short_link_v2,
          ctime: card.ctime,
          title: card.title,
          cover: card.pic,
          dynamic_id_str: item.desc.dynamic_id_str,
          isNew: isNewVideo(item.desc.dynamic_id),
        } as MomentItem)
      }
      else if (item.desc.type === MomentType.Bangumi) {
        // bangumi moment
        this.moments.push({
          type: item.desc.type,
          id: item.desc.dynamic_id,
          name: card.apiSeasonInfo.title,
          face: card.apiSeasonInfo.cover,
          episode_id: card.episode_id,
          url: card.url,
          title: card.new_desc,
          cover: card.cover,
          dynamic_id_str: item.desc.dynamic_id_str,
          isNew: isNewVideo(item.desc.dynamic_id),
        } as MomentItem)
      }
      else if (item.desc.type === MomentType.Article) {
        // article moment
        this.moments.push({
          type: item.desc.type,
          id: item.desc.dynamic_id,
          uid: item.desc.uid,
          name: item.desc.user_profile.info.uname,
          face: item.desc.user_profile.info.face,
          url: `https://www.bilibili.com/read/cv${card.id}`,
          ctime: card.publish_time,
          title: card.title,
          cover: card.image_urls[0],
          dynamic_id_str: item.desc.dynamic_id_str,
          isNew: isNewArticle(item.desc.dynamic_id),
        } as MomentItem)
      }
    },
    /**
     * smooth scroll to the top of the html element
     */
    scrollToTop(element: HTMLElement, duration: number) {
    // cancel if already on top
      if (element.scrollTop === 0) return

      const cosParameter = element.scrollTop / 2
      let scrollCount = 0
      let oldTimestamp = 0

      function step(newTimestamp: number) {
        if (oldTimestamp !== 0) {
          // if duration is 0 scrollCount will be Infinity
          scrollCount += Math.PI * (newTimestamp - oldTimestamp) / duration
          if (scrollCount >= Math.PI) return element.scrollTop = 0
          element.scrollTop = cosParameter + cosParameter * Math.cos(scrollCount)
        }
        oldTimestamp = newTimestamp
        window.requestAnimationFrame(step)
      }
      window.requestAnimationFrame(step)
    },
  },
})
</script>

<template>
  <div
    bg="$bew-content-solid-1"
    w="380px"
    rounded="$bew-radius"
    pos="relative"
    style="box-shadow: var(--bew-shadow-2)"
  >
    <!-- top bar -->
    <div
      flex="~"
      justify="between"
      p="y-4 x-6"
      pos="fixed top-0 left-0"
      w="full"
      bg="$bew-content-1"
      z="1"
      border="!rounded-t-$bew-radius"
      style="backdrop-filter: var(--bew-filter-glass)"
    >
      <div flex="~">
        <div
          v-for="tab in momentTabs"
          :key="tab.id"
          m="r-4"
          transition="all duration-300"
          class="tab"
          :class="tab.isSelected ? 'tab-selected' : ''"
          cursor="pointer"
          @click="onClickTab(tab.id)"
        >
          {{ tab.name }}
        </div>
      </div>
      <a href="https://t.bilibili.com/" target="_blank" flex="~" items="center">
        <span text="sm">{{ $t('common.view_all') }}</span>
      </a>
    </div>

    <!-- moments wrapper -->
    <div ref="momentsWrap" h="430px" overflow="y-scroll" p="x-4">
      <!-- loading -->
      <loading v-if="isLoading && moments.length === 0" h="full" flex="~" items="center"></loading>

      <!-- empty -->
      <empty v-if="!isLoading && moments.length === 0" w="full" h="full"></empty>

      <!-- moments -->
      <transition-group name="list">
        <a
          v-for="(moment, index) in moments"
          :key="index"
          :href="moment.url"
          target="_blank"
          flex="~"
          justify="between"
          m="b-4"
          first:m="t-16"
          p="2"
          rounded="$bew-radius"
          hover:bg="$bew-fill-2"
          transition="all duration-300"
          cursor="pointer"
          pos="relative"
        >
          <!-- new moment dot -->
          <div
            v-if="moment.isNew"
            rounded="full"
            w="8px"
            h="8px"
            m="t-2 l-2"
            bg="$bew-theme-color"
            pos="absolute -top-10px -left-10px"
            style="box-shadow: 0 0 4px var(--bew-theme-color)"
          ></div>

          <a
            :href="moment.type === MomentType.Video ? 'https://space.bilibili.com/' + moment.uid : moment.url"
            target="_blank"
          >
            <img :src="moment.face + '@60w_60h_1c'" rounded="$bew-radius" w="40px" h="40px" m="r-4" />
          </a>

          <div flex="~" justify="between" w="full">
            <div>
              <span>{{ moment.name }}</span> {{ $t('topbar.moments_dropdown.uploaded') }}{{ moment.title }}
              <div v-if="moment.type !== MomentType.Bangumi" text="$bew-text-2 sm" m="y-2">
                <!-- Videos and articles -->
                <div v-if="selectedTab === 0 || selectedTab === 2">
                  {{ calcTimeSince(new Date(moment.ctime * 1000)) }}{{ language === LanguageType.English ? ' ' + $t('common.ago') : $t('common.ago') }}
                </div>
                <!-- Live -->
                <div v-else-if="selectedTab === 1" text="$bew-theme-color" font="bold" flex="~" items="center">
                  <fluent:live-24-filled m="r-2" /> {{ $t('topbar.moments_dropdown.live_status') }}
                </div>
              </div>

            </div>
            <img :src="moment.cover + '@128w_72h_1c'" w="82px" h="46px" m="l-4" rounded="$bew-radius" />
          </div>
        </a>
      </transition-group>

      <!-- loading -->
      <loading v-if="isLoading && moments.length !== 0" m="-t-4"></loading>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  @apply opacity-0 transform translate-y-2 transform-gpu;
}

.tab {
  @apply relative text-$bew-text-2;

  &::after {
    @apply absolute bottom-0 left-0 w-full h-12px bg-$bew-theme-color opacity-0 transform scale-x-0 -z-1 transition-all duration-300;
    content: '';
  }
}

.tab-selected {
  @apply font-bold text-$bew-text-1;

  &::after {
    @apply scale-x-80 opacity-40;
  }
}
</style>
