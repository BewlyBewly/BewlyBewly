<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { isHomePage } from '~/utils/main'

const { t } = useI18n()
const api = useApiClient()
const list = reactive([
  {
    name: t('topbar.noti_dropdown.replys'),
    url: 'https://message.bilibili.com/#/reply',
    unreadCount: 0,
    icon: 'i-mingcute:chat-3-line',
  },
  {
    name: t('topbar.noti_dropdown.mentions'),
    url: 'https://message.bilibili.com/#/at',
    unreadCount: 0,
    icon: 'i-mingcute:at-line',
  },
  {
    name: t('topbar.noti_dropdown.likes'),
    url: 'https://message.bilibili.com/#/love',
    unreadCount: 0,
    icon: 'i-mingcute:thumb-up-2-line',
  },
  {
    name: t('topbar.noti_dropdown.messages'),
    url: 'https://message.bilibili.com/#/system',
    unreadCount: 0,
    icon: 'i-mingcute:mail-line',
  },
  {
    name: t('topbar.noti_dropdown.chats'),
    url: 'https://message.bilibili.com/#/whisper',
    unreadCount: 0,
    icon: 'i-mingcute:message-3-line',
  },
],
)

onMounted(() => {
  getUnreadMessageCount()
})

function getUnreadMessageCount() {
  api.notification.getUnreadMsg().then((res) => {
    if (res.code === 0) {
      const resData = res.data
      list[0].unreadCount = resData.reply
      list[1].unreadCount = resData.at
      list[2].unreadCount = resData.like
      list[3].unreadCount = resData.sys_msg
    }
  }).catch(() => {
    list[0].unreadCount = 0
    list[1].unreadCount = 0
    list[2].unreadCount = 0
    list[3].unreadCount = 0
  })

  api.notification.getUnreadDm().then((res) => {
    if (res.code === 0) {
      const resData = res.data
      list[4].unreadCount = resData.follow_unread
    }
  }).catch(() => {
    list[4].unreadCount = 0
  })
}
</script>

<template>
  <div
    bg="$bew-elevated-solid-1"
    w="170px"
    p="4"
    rounded="$bew-radius"
    flex="~ col"
    shadow="$bew-shadow-3"
  >
    <a
      v-for="item in list"
      :key="item.name"
      :href="item.url"
      :target="isHomePage() ? '_blank' : '_self'"
      pos="relative"
      p="x-4 y-2"
      bg="hover:$bew-fill-2"
      rounded="$bew-radius"
      transition="all duration-300"
      m="b-1 last:b-0"
      flex="~"
      items="center"
      h="35px"
    >
      <i :class="item.icon" />
      <span class="flex-1 ml-2 mr-1">{{ item.name }}</span>
      <template v-if="item.unreadCount > 0">
        <div
          bg="$bew-theme-color"
          rounded="full"
          text="white xs leading-none center"
          p="1"
          min-w="21px"
          min-h="21px"
        >
          {{ item.unreadCount > 99 ? '99+' : item.unreadCount }}
        </div>
      </template>
    </a>
  </div>
</template>
