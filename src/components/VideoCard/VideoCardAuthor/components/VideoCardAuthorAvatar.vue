<script lang="ts" setup>
import { removeHttpFromUrl } from '~/utils/main'

import type { Author } from '../../types'
import { getAuthorJumpUrl } from '../../utils'

const props = withDefaults(defineProps<{
  author: Author | Author[]
  maxCount?: number
  isLive?: boolean
}>(), {
  maxCount: 3, // 最多显示的头像数量
})

// 限制显示的头像数量，最多显示 maxCount 个
const displayedAvatars = computed(() => {
  if (Array.isArray(props.author))
    return props.author?.slice(0, props.maxCount) || []
  else
    return [props.author]
})
</script>

<template>
  <div
    :style="{
      width: Array.isArray(author) && author.length > 1 ? `${28 + (displayedAvatars?.length) * 6}px` : '34px',
      height: Array.isArray(author) && author.length > 1 ? '28px' : '34px',
    }"
    mr-4
    pos="relative"
    shrink-0
  >
    <a
      v-for="(item, index) in displayedAvatars"
      :key="index"
      :href="getAuthorJumpUrl(item)" target="_blank"
      rounded="1/2"
      object="center cover" bg="$bew-skeleton" cursor="pointer"
      position-absolute top-0 inline-block
      :style="{
        zIndex: displayedAvatars.length - index,
        left: `${index * 6}px`,
        width: displayedAvatars.length > 1 ? `28px` : '34px',
        height: displayedAvatars.length > 1 ? `28px` : '34px',
      }"
      :class="{ live: isLive }"
      @click.stop=""
    >
      <!-- Avatar -->
      <Picture
        :src="`${removeHttpFromUrl(item.authorFace)}@50w_50h_1c`"
        loading="lazy"
        w-inherit h-inherit
        rounded="1/2"
      />

      <!-- Following Flag -->
      <div
        v-if="item.followed && !Array.isArray(author)"
        pos="absolute top-21px left-22px"
        w-14px h-14px
        bg="$bew-theme-color"
        border="2 outset solid white"
        rounded="1/2"
        grid place-items-center
      >
        <div color-white text-sm class="i-mingcute:check-fill w-8px h-8px" />
      </div>
      <div
        v-else-if="isLive"
        pos="absolute top-18px left-22px"
        w-14px h-14px
        bg="$bew-theme-color"
        rounded="1/2" grid place-items-center
      >
        <div color-white text-sm class="i-svg-spinners:pulse-3 w-12px h-12px" />
      </div>
    </a>

    <!-- More avatars not shown -->
    <span
      v-if="Array.isArray(author) && author.length > maxCount"
      pos="absolute right--4px"
      w="28px" h="28px"
      bg="$bew-skeleton"
      rounded="1/2"
      flex="~ items-center justify-end"
    >
      <span text="sm $bew-text-2" mr-1px>+</span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.live {
  --uno: "p-2px box-border border-2 border-$bew-theme-color-60";
}
</style>
