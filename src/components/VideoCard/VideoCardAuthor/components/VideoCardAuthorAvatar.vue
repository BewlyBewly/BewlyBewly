<script lang="ts" setup>
import { removeHttpFromUrl } from '~/utils/main'

import type { Author } from '../../types'
import { getAuthorJumpUrl } from '../../utils'

const props = withDefaults(defineProps<{
  author: Author | Author[]
  maxCount?: number
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
    pos="relative"
    m="r-4" h="36px"
    :style="{ width: `${26 + Math.min(maxCount + 1, displayedAvatars?.length || 0) * 10}px` }"
  >
    <a
      v-for="(item, index) in displayedAvatars"
      :key="index"
      :href="getAuthorJumpUrl(item)" target="_blank"
      rounded="1/2"
      object="center cover" bg="$bew-skeleton" cursor="pointer"
      position-relative
      :style="{
        zIndex: displayedAvatars.length - index,
        left: `${index * 6}px`,
        width: displayedAvatars.length > 1 ? `28px` : '36px',
        height: displayedAvatars.length > 1 ? `28px` : '36px',
      }"
      @click.stop=""
    >
      <!-- Avatar -->
      <Picture
        :src="`${removeHttpFromUrl(item.authorFace)}@50w_50h_1c`"
        pos="absolute top-0"
        loading="lazy"
        w-inherit h-inherit
        rounded="1/2"
      />

      <!-- Following Flag -->
      <div
        v-if="item.followed"
        pos="absolute top-23px left-23px"
        w-14px h-14px
        bg="$bew-theme-color"
        border="2 outset solid white"
        rounded="1/2"
        grid place-items-center
      >
        <div color-white text-sm class="i-mingcute:check-fill w-8px h-8px" />
      </div>
    </a>

    <!-- More avatars not shown -->
    <!-- <i
      v-if="Array.isArray(author) && author.length > maxCount"
      i-solar:menu-dots-circle-bold-duotone
      pos="absolute right--4px"

      z-1
      w="28px" h="28px"
    /> -->
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
