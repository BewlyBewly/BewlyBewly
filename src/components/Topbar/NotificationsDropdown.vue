<template>
  <div
    bg="$bew-content-solid-1"
    w="170px"
    p="4"
    rounded="$bew-radius"
    flex="~ col"
    style="box-shadow: var(--bew-shadow-3)"
  >
    <a
      v-for="item in list"
      :key="item.name"
      :href="item.url"
      target="_blank"
      pos="relative"
      p="x-4 y-2"
      bg="hover:$bew-fill-2"
      rounded="$bew-radius"
      transition="all duration-300"
      m="b-1 last:b-0"
      flex="~"
      justify="between"
      align="center"
    >
      {{ item.name }}
      <div
        v-if="item.unreadCount > 0"
        bg="$bew-theme-color"
        rounded="full"
        text="white xs"
        p="1"
        min-w="21px"
        min-h="21px"
      >
        {{ item.unreadCount > 999 ? '999+' : item.unreadCount }}
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
let unreadReplys = 0
let unreadMentions = 0
let unreadLikes = 0
let unreadMessages = 0
let unreadChats = 0

const list = [
  {
    name: 'Replys',
    url: 'https://message.bilibili.com/#/reply',
    unreadCount: unreadReplys,
  },
  {
    name: 'Mentions',
    url: 'https://message.bilibili.com/#/at',
    unreadCount: unreadMentions,
  },
  {
    name: 'Likes',
    url: 'https://message.bilibili.com/#/love',
    unreadCount: unreadLikes,
  },
  {
    name: 'Messages',
    url: 'https://message.bilibili.com/#/system',
    unreadCount: unreadMessages,
  },
  {
    name: 'Chats',
    url: 'https://message.bilibili.com/#/whisper',
    unreadCount: unreadChats,
  },
]

getUnreadMessageCount()

async function getUnreadMessageCount() {
  await browser.runtime
    .sendMessage({
      contentScriptQuery: 'getUnreadMsg',
    }).then((res) => {
      const resData = res.data
      unreadReplys = resData.reply
      unreadMentions = resData.at
      unreadLikes = resData.like
      unreadMessages = resData.sys_msg
    })

  await browser.runtime
    .sendMessage({
      contentScriptQuery: 'getUnreadDm',
    }).then((res) => {
      const resData = res.data
      unreadChats = resData.unfollow_unread + resData.follow_unread
    })
}
</script>
