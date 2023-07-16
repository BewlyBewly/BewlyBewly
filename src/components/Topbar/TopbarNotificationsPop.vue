<script lang="ts">
export default defineComponent({
  data() {
    return {
      list: [
        {
          name: this.$t('topbar.noti_dropdown.replys'),
          url: 'https://message.bilibili.com/#/reply',
          unreadCount: 0,
        },
        {
          name: this.$t('topbar.noti_dropdown.mentions'),
          url: 'https://message.bilibili.com/#/at',
          unreadCount: 0,
        },
        {
          name: this.$t('topbar.noti_dropdown.likes'),
          url: 'https://message.bilibili.com/#/love',
          unreadCount: 0,
        },
        {
          name: this.$t('topbar.noti_dropdown.messages'),
          url: 'https://message.bilibili.com/#/system',
          unreadCount: 0,
        },
        {
          name: this.$t('topbar.noti_dropdown.chats'),
          url: 'https://message.bilibili.com/#/whisper',
          unreadCount: 0,
        },
      ],

    }
  },
  mounted() {
    this.getUnreadMessageCount()
  },
  methods: {
    getUnreadMessageCount() {
      browser.runtime
        .sendMessage({
          contentScriptQuery: 'getUnreadMsg',
        }).then((res) => {
          if (res.code === 0) {
            const resData = res.data
            this.list[0].unreadCount = resData.reply
            this.list[1].unreadCount = resData.at
            this.list[2].unreadCount = resData.like
            this.list[3].unreadCount = resData.sys_msg
          }
        })

      browser.runtime
        .sendMessage({
          contentScriptQuery: 'getUnreadDm',
        }).then((res) => {
          if (res.code === 0) {
            const resData = res.data
            this.list[4].unreadCount = parseInt(resData.unfollow_unread) + parseInt(resData.follow_unread)
          }
        })
    },
  },
})
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
      target="_blank"
      pos="relative"
      p="x-4 y-2"
      bg="hover:$bew-fill-2"
      rounded="$bew-radius"
      transition="all duration-300"
      m="b-1 last:b-0"
      flex="~"
      justify="between"
      items="center"
      h="35px"
    >
      {{ item.name }}
      <template
        v-if="item.unreadCount > 0"
      >
        <div
          bg="$bew-theme-color"
          rounded="full"
          text="white xs leading-none center"
          p="1"
          min-w="21px"
          min-h="21px"
        >
          {{ item.unreadCount > 999 ? '999+' : item.unreadCount }}
        </div>
      </template>
    </a>
  </div>
</template>
