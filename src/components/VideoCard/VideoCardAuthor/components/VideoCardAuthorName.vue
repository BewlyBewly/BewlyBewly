<script lang="ts" setup>
import { getAuthorJumpUrl } from '~/components/VideoCard/utils'

import type { Author } from '../../types'

defineProps<{
  // 单个作者用 `author`, 多个作者用 `authorList`
  author?: Author
  authorList?: Author[]
}>()
</script>

<template>
  <a
    v-if="author || authorList"
    class="channel-name"
    un-text="hover:$bew-text-1"
    cursor-pointer mr-4
    :href="getAuthorJumpUrl(author || (authorList && authorList[0]))"
    target="_blank"
    @click.stop=""
  >
    <span>
      {{ author?.name || (authorList && authorList[0].name) }}
      <span v-if="authorList && authorList.length > 1">
        {{ $t('video_card.group_contribution', { num: authorList.length }) }}
      </span>
    </span>
  </a>
</template>
