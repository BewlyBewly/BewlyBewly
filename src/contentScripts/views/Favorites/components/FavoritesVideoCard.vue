<script lang="ts" setup>
import type { FavoriteResource } from '~/components/TopBar/types'
import type { Media as FavoriteItem } from '~/models/video/favorite'

defineProps<{
  item: FavoriteItem
}>()

const emit = defineEmits(['unfavorite'])

function isMusic(item: FavoriteResource) {
  return item.link.includes('bilibili://music')
}

function unfavorite(item: FavoriteItem) {
  emit('unfavorite', item)
}
</script>

<template>
  <VideoCard
    :video="{
      id: item.id,
      duration: item.duration,
      title: item.title,
      cover: item.cover,
      author: {
        name: item.upper.name,
        authorFace: item.upper.face,
        mid: item.upper.mid,
      },
      view: item.cnt_info.play,
      danmaku: item.cnt_info.danmaku,
      publishedTimestamp: item.pubtime,
      bvid: isMusic(item) ? undefined : item.bvid,
      url: isMusic(item) ? `https://www.bilibili.com/audio/au${item.id}` : undefined,
    }"
    group
  >
    <template #coverTopLeft>
      <button
        p="x-2 y-1" m="1"
        rounded="$bew-radius"
        text="!white xl"
        bg="black opacity-60 hover:$bew-error-color-80"
        @click.prevent.stop="unfavorite(item)"
      >
        <Tooltip :content="$t('favorites.unfavorite')" placement="bottom" type="dark">
          <div i-ic-baseline-clear />
        </Tooltip>
      </button>
    </template>
  </VideoCard>
</template>
