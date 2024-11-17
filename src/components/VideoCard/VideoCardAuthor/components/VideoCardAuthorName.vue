<script lang="ts" setup>
import { getAuthorJumpUrl } from '~/components/VideoCard/utils'

import type { Author } from '../../types'

defineProps<{
  author?: Author | Author[]
}>()
</script>

<template>
  <a
    class="channel-name"
    un-text="hover:$bew-text-1"
    cursor-pointer mr-4
    :href="getAuthorJumpUrl(Array.isArray(author) ? author[0] : author)"
    target="_blank"
    @click.stop=""
  >
    <span>
      <span v-if="Array.isArray(author) && author.length > 1">
        {{ $t('video_card.group_contribution', { firstAuthor: author[0].name, num: author.length }) }}
      </span>
      <span v-else>
        {{ Array.isArray(author) ? author[0].name : author?.name }}
      </span>
    </span>
  </a>
</template>
