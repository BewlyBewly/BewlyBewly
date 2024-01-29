<script setup lang="ts">
import type { Ref } from 'vue'
import type { DataItem as MomentItem, MomentResult } from '~/models/moment/moment'

const momentList = reactive<MomentItem[]>([])
const isLoading = ref<boolean>(false)
const needToLoginFirst = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const offset = ref<string>('')
const updateBaseline = ref<string>('')
const noMoreContent = ref<boolean>(false)
const noMoreContentWarning = ref<boolean>(false)
const { handleReachBottom, handlePageRefresh } = useBewlyApp()

function initPageAction() {
  handleReachBottom.value = async () => {
    if (isLoading.value)
      return
    if (noMoreContent.value) {
      noMoreContentWarning.value = true
      return
    }
    for (let i = 0; i < 3; i++)
      await getFollowedUsersVideos()
  }
  handlePageRefresh.value = async () => {
    if (isLoading.value)
      return

    offset.value = ''
    updateBaseline.value = ''
    momentList.length = 0
    noMoreContent.value = false
    noMoreContentWarning.value = false
    if (isLoading.value)
      return
    for (let i = 0; i < 3; i++)
      await getFollowedUsersVideos()
  }
}

onMounted(async () => {
  for (let i = 0; i < 3; i++)
    await getFollowedUsersVideos()

  initPageAction()
})

onActivated(() => {
  initPageAction()
})

async function getFollowedUsersVideos() {
  if (noMoreContent.value)
    return

  if (offset.value === '0') {
    noMoreContent.value = true
    return
  }

  isLoading.value = true
  try {
    const response: MomentResult = await browser.runtime.sendMessage({
      contentScriptQuery: 'getMoments',
      type: 'pgc',
      offset: offset.value,
      updateBaseline: updateBaseline.value,
    })

    if (response.code === -101) {
      noMoreContent.value = true
      needToLoginFirst.value = true
      return
    }

    if (response.code === 0) {
      offset.value = response.data.offset
      updateBaseline.value = response.data.update_baseline

      const resData = [] as MomentItem[]

      response.data.items.forEach((item: MomentItem) => {
        resData.push(item)
      })

      // when videoList has length property, it means it is the first time to load
      if (!momentList.length) {
        Object.assign(momentList, resData)
      }
      else {
        // else we concat the new data to the old data
        Object.assign(momentList, momentList.concat(resData))
      }
    }
    else if (response.code === -101) {
      needToLoginFirst.value = true
    }
  }
  finally {
    isLoading.value = false
  }
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}
</script>

<template>
  <div>
    <Empty v-if="needToLoginFirst" mt-6 :description="$t('common.please_log_in_first')">
      <Button type="primary" @click="jumpToLoginPage()">
        {{ $t('common.login') }}
      </Button>
    </Empty>
    <div
      v-else
      ref="containerRef"
      m="b-0 t-0" relative w-full h-full
      grid="~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-5"
    >
      <VideoCard
        v-for="moment in momentList"
        :id="moment.modules.module_author.mid"
        :key="moment.modules.module_author.mid"
        :top-right-content="false"
        :title="`${moment.modules.module_dynamic.major.pgc?.title}`"
        :cover="`${moment.modules.module_dynamic.major.pgc?.cover}`"
        :author="moment.modules.module_author.name"
        :author-face="moment.modules.module_author.face"
        :mid="moment.modules.module_author.mid"
        :view-str="moment.modules.module_dynamic.major.pgc?.stat.play"
        :danmaku-str="moment.modules.module_dynamic.major.pgc?.stat.danmaku"
        :capsule-text="moment.modules.module_author.pub_time"
        :epid="moment.modules.module_dynamic.major.pgc?.epid"
      />

      <!-- skeleton -->
      <template v-if="isLoading">
        <VideoCardSkeleton v-for="item in 30" :key="item" />
      </template>
    </div>

    <!-- no more content -->
    <Empty v-if="noMoreContentWarning" class="pb-4" :description="$t('common.no_more_content')" />

    <Transition name="fade">
      <Loading v-if="isLoading" />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
</style>
