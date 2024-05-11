<script setup lang="ts">
import type { Ref } from 'vue'

import Button from '~/components/Button.vue'
import Empty from '~/components/Empty.vue'
import Loading from '~/components/Loading.vue'
import VideoCard from '~/components/VideoCard/VideoCard.vue'
import VideoCardSkeleton from '~/components/VideoCard/VideoCardSkeleton.vue'
import { useApiClient } from '~/composables/api'
import { useBewlyApp } from '~/composables/useAppProvider'
import type { GridLayout } from '~/logic'
import type { DataItem as MomentItem, MomentResult } from '~/models/moment/moment'

const props = defineProps<{
  gridLayout: GridLayout
}>()

const emit = defineEmits<{
  (e: 'beforeLoading'): void
  (e: 'afterLoading'): void
}>()

const gridValue = computed((): string => {
  if (props.gridLayout === 'adaptive')
    return '~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-5'
  if (props.gridLayout === 'twoColumns')
    return '~ cols-1 xl:cols-2 gap-4'
  return '~ cols-1 gap-4'
})
const api = useApiClient()
const momentList = reactive<MomentItem[]>([])
const isLoading = ref<boolean>(false)
const needToLoginFirst = ref<boolean>(false)
const containerRef = ref<HTMLElement>() as Ref<HTMLElement>
const offset = ref<string>('')
const updateBaseline = ref<string>('')
const noMoreContent = ref<boolean>(false)
const noMoreContentWarning = ref<boolean>(false)
const { handleReachBottom, handlePageRefresh } = useBewlyApp()

onMounted(async () => {
  initData()
  initPageAction()
})

onActivated(() => {
  initPageAction()
})

async function initData() {
  offset.value = ''
  updateBaseline.value = ''
  momentList.length = 0
  noMoreContent.value = false
  noMoreContentWarning.value = false

  await getData()
}

async function getData() {
  for (let i = 0; i < 3; i++)
    await getFollowedUsersVideos()
}

function initPageAction() {
  handleReachBottom.value = async () => {
    if (isLoading.value)
      return
    if (noMoreContent.value) {
      noMoreContentWarning.value = true
      return
    }
    getData()
  }
  handlePageRefresh.value = async () => {
    if (isLoading.value)
      return
    if (isLoading.value)
      return
    initData()
  }
}

async function getFollowedUsersVideos() {
  if (noMoreContent.value)
    return

  if (offset.value === '0') {
    noMoreContent.value = true
    return
  }

  emit('beforeLoading')
  isLoading.value = true
  try {
    const response: MomentResult = await api.moment.getMoments({
      type: 'pgc',
      offset: Number(offset.value),
      update_baseline: updateBaseline.value,
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
    emit('afterLoading')
  }
}

function jumpToLoginPage() {
  location.href = 'https://passport.bilibili.com/login'
}

defineExpose({ initData })
</script>

<template>
  <div>
    <!-- By directly using predefined unocss grid properties, it is possible to dynamically set the grid attribute -->
    <div hidden grid="~ 2xl:cols-5 xl:cols-4 lg:cols-3 md:cols-2 gap-5" />
    <div hidden grid="~ cols-1 xl:cols-2 gap-4" />
    <div hidden grid="~ cols-1 gap-4" />

    <Empty v-if="needToLoginFirst" mt-6 :description="$t('common.please_log_in_first')">
      <Button type="primary" @click="jumpToLoginPage()">
        {{ $t('common.login') }}
      </Button>
    </Empty>
    <div
      v-else
      ref="containerRef"
      m="b-0 t-0" relative w-full h-full
      :grid="gridValue"
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
        :author-url="moment.modules.module_author.jump_url"
        :view-str="moment.modules.module_dynamic.major.pgc?.stat.play"
        :danmaku-str="moment.modules.module_dynamic.major.pgc?.stat.danmaku"
        :capsule-text="moment.modules.module_author.pub_time"
        :epid="moment.modules.module_dynamic.major.pgc?.epid"
        :horizontal="gridLayout !== 'adaptive'"
      />

      <!-- skeleton -->
      <template v-if="isLoading">
        <VideoCardSkeleton
          v-for="item in 30" :key="item"
          :horizontal="gridLayout !== 'adaptive'"
        />
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
