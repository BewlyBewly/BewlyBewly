<script lang="ts" setup>
import { removeHttpFromUrl } from '~/utils/main'

import type { Author } from './types'
import { getAuthorJumpUrl } from './utils'

const props = withDefaults(defineProps<{
  authorList: Author[]
  maxCount?: number
}>(), {
  maxCount: 2, // 最多显示的头像数量
})

// 限制显示的头像数量，最多显示 maxCount 个
const displayedAvatars = computed(() => props.authorList?.slice(0, props.maxCount) || [])
</script>

<template>
  <div v-if="displayedAvatars.length > 0" flex>
    <div
      pos="relative"
      m="r-4" h="36px"
      :style="{ width: `${26 + Math.min(maxCount + 1, authorList.length) * 10}px` }"
    >
      <a
        v-for="(author, index) in displayedAvatars"
        :key="index"
        :href="getAuthorJumpUrl(author)" target="_blank"
        w="36px" h="36px" rounded="1/2"
        object="center cover" bg="$bew-skeleton" cursor="pointer"
        position-relative
        :style="{ zIndex: displayedAvatars.length - index, left: `${index * 10}px` }"
        @click.stop=""
      >
        <!-- Avatar -->
        <Picture
          :src="`${removeHttpFromUrl(author.authorFace)}@50w_50h_1c`"
          pos="absolute top-0"
          loading="lazy"
          w="36px" h="36px"
          rounded="1/2"
        />

        <!-- Following Flag -->
        <div
          v-if="author.followed"
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

      <span
        pos="absolute right-0"
        w="36px" h="36px"
        bg="$bew-skeleton"
        rounded="1/2"
      >
        <span pos="absolute top-6px left-26px" text="sm $bew-text-2">+</span>
      </span>
    </div>
  </div>
</template>
