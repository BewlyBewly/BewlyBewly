<script setup lang="tsx">
import { useElementHover } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { ProfileCardInfo, ProfileCardInfoResult } from '~/models/user/card'
import { numFormatter } from '~/utils/dataFormatter'
import { removeHttpFromUrl } from '~/utils/main'

enum Action {
  Follow = 1,
  UnFollow = 2,
  FollowQuietly = 3,
  UnFollowQuietly = 4,
  Blacklist = 5,
  UnBlacklist = 6,
  RemoveFans = 7,
}

const target = document.createElement('div')
target.id = 'bewly-user-profile'
target.style.display = 'none'
document.body.appendChild(target)

const api = useApiClient()
const toast = useToast()

const store = new Map<number, ProfileCardInfo | null>()
const mid = ref<number>()
const info = ref<ProfileCardInfo>()
const action = ref<'open' | 'close'>()
const timer = ref()
const isHover = useElementHover(target)

async function openUserProfile(_mid: number, e: MouseEvent) {
  if (target.style.display === 'block') {
    target.style.left = `${e.clientX + 30}px`
    target.style.top = `${e.clientY - 120}px`
    action.value = 'open'
    store.set(_mid, null)
    const _info = await fetchUserProfile(_mid)
    info.value = _info
    mid.value = _mid
  }
  else {
    action.value = 'open'
    store.set(_mid, null)
    const _info = await fetchUserProfile(_mid)
    info.value = _info
    mid.value = _mid

    target.style.display = 'block'
    target.style.left = `${e.clientX + 30}px`
    target.style.top = `${e.clientY - 120}px`
    target.style.zIndex = '9999'
  }
}

function closeUserProfile(_mid?: number) {
  if (_mid && mid.value !== _mid)
    return

  target.style.display = isHover.value ? 'block' : 'none'
  action.value = 'close'
}

function fetchUserProfile(mid: number) {
  const info = store.get(mid)

  if (info)
    return info

  return api.user.getUserCardInfo({
    mid,
    photo: true,
  })
    .then((res: ProfileCardInfoResult) => {
      if (res.code === 0) {
        store.set(mid, res.data)
        return res.data
      }
    })
}

function handleSendMessage() {
  if (mid.value)
    window.open(`https://message.bilibili.com//#/whisper/mid${mid.value}`, '_blank', 'noopener,noreferrer')
}

function handleFollow(_info: ProfileCardInfo) {
  api.user.relationModify({
    fid: _info.card.mid,
    re_src: 0, // 动态
    act: _info.following ? Action.UnFollow : Action.Follow, // 1: 关注, 2: 取消
  })
    .then(() => {
      if (!_info.following) {
        toast.success(`关注 ${_info.card.name} 成功`)
        _info.following = true
      }
      else {
        toast.success(`取消关注 ${_info.card.name} 成功`)
        _info.following = false
      }
      store.set(Number(_info.card.mid), _info)
      info.value = _info
    })
    // TODO: better toast
    .catch(() => toast.error('操作失败'))
}

onUnmounted(() => {
  target.remove()
})

provide('BEWLY_USER_PROFILE', {
  hasCacheUserProfile(mid: number) {
    return store.has(mid)
  },
  openUserProfile,
  closeUserProfile,
})

watch(isHover, (isHover) => {
  if (isHover || action.value === 'open')
    clearTimeout(timer.value)

  if (!isHover && action.value === 'close')
    timer.value = setTimeout(() => closeUserProfile(), 1200)
})
</script>

<template>
  <div>
    <Teleport :to="target">
      <div v-if="info" class="content" flex="~ col">
        <div class="background" :style="{ backgroundImage: `url(${info.space.l_img})` }" />

        <div flex="~ gap-x-4" class="mt-4">
          <a :href="`//space.bilibili.com/${info.card.mid}`" class="mt-2 ml-4">
            <!-- avatar -->
            <div class="size-48px rounded-full overflow-hidden inline-flex justify-center items-center">
              <picture class="vertical-middle aspect-video">
                <source type="image/webp" :srcset="`${removeHttpFromUrl(info.card.face)}` + '@96w_96h_!web-dynamic.webp'">
                <img :src="`${removeHttpFromUrl(info.card.face)}` + '@96w_96h_!web-dynamic.webp'" loading="lazy">
              </picture>
            </div>
          </a>

          <!-- infomation -->
          <div flex="~ col">
            <div class="flex items-center h-21px pb-4">
              <!-- nickname -->
              <a :href="`//space.bilibili.com/${info.card.mid}/dynamic`" target="_blank" class="text-base fw-700" style="color: rgb(251, 114, 153);">
                {{ info.card.name }}
              </a>
            </div>

            <div flex="~ col gap-2" class="pr-2">
              <div flex="~ gap-x-2">
                <a :href="`//space.bilibili.com/${info.card.mid}/fans/follow`" target="_blank" class="hover:text-$bew-theme-color">
                  <span class="hover:text-gray">{{ numFormatter(info.card.friend) }}</span> 关注
                </a>
                <a :href="`//space.bilibili.com/${info.card.mid}/fans/fans`" target="_blank" class="hover:text-$bew-theme-color">
                  <span class="hover:text-gray">{{ numFormatter(info.card.fans) }}</span> 粉丝
                </a>
                <div class="bili-user-profile-view__info__stat like">
                  <span>{{ numFormatter(info.like_num) }}</span>获赞
                </div>
              </div>
              <div class="text-sm">
                {{ info.card.sign }}
              </div>
            </div>

            <div flex="~ gap-x-6" class="mt-4 pb-4">
              <Button type="primary" class="w-82px! justify-center" @click="handleFollow(info)">
                {{ info.following ? '已关注' : '关注' }}
              </Button>
              <Button type="warning" class="w-82px! justify-center" @click="handleSendMessage">
                发消息
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    <slot />
  </div>
</template>

<style>
#bewly-user-profile {
  font-size: 13px;
  width: 366px;

  --at-apply: antialiased text-$text3;
  --at-apply: fixed rounded-$bew-radius z-2000;
  --at-apply: bg-$bew-elevated-1 shadow-[0_5px_10px_0_rgba(0,0,0,0.15)];
  --at-apply: transition-all duration-200 will-change-left will-change-top;
  backdrop-filter: var(--bew-filter-glass-2);
}

#bewly-user-profile .background {
  --at-apply: bg-cover bg-no-repeat bg-center;
  --at-apply: w-full h-85px rounded-0 left-0 top-0 of-hidden;
  border-radius: var(--bew-radius) var(--bew-radius) 0 0;
}
</style>
