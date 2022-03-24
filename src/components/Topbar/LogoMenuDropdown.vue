<template>
  <div
    style="backdrop-filter: var(--bew-filter-glass); box-shadow: var(--bew-shadow-3);"
    flex="~"
    p="4"
    bg="$bew-content-1"
    rounded="$bew-radius"
  >
    <ul
      v-for="(item, index) in [0, 10, 20, 30]"
      :key="index"
      m="r-1 last-of-type:r-0"
    >
      <li
        v-for="genre in genres.slice(item, item + 10)"
        :key="genre.name"
        m="b-1 last-of-type:b-0"
        text="sm"
      >
        <a
          :href="genre.href"
          target="_blank"
          flex="~"
          items="center"
          w="170px"
          p="x-2 y-2"
          hover:bg="$bew-fill-2"
          transition="duration-300"
          border="rounded-$bew-radius"
        >
          <svg aria-hidden="true" class="svg-icon">
            <use :xlink:href="genre.icon" />
          </svg>
          <span>{{ genre.name }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const genres = [
  { name: 'Anime', icon: '#channel-anime', href: 'https://www.bilibili.com/anime' },
  { name: 'Movies', icon: '#channel-movie', href: 'https://www.bilibili.com/movie' },
  { name: 'Chinese anime', icon: '#channel-guochuang', href: 'https://www.bilibili.com/guochuang' },
  { name: 'TV shows', icon: '#channel-teleplay', href: 'https://www.bilibili.com/tv' },
  { name: 'Variety shows', icon: '#channel-zongyi', href: 'https://www.bilibili.com/variety' },
  { name: 'Documentary films', icon: '#channel-documentary', href: 'https://www.bilibili.com/documentary' },
  { name: 'Animations', icon: '#channel-douga', href: 'https://www.bilibili.com/v/douga' },
  { name: 'Gaming', icon: '#channel-game', href: 'https://www.bilibili.com/v/game' },
  { name: 'Kichiku', icon: '#channel-kichiku', href: 'https://www.bilibili.com/v/kichiku' },
  { name: 'Music', icon: '#channel-music', href: 'https://www.bilibili.com/v/music' },
  { name: 'Dance', icon: '#channel-dance', href: 'https://www.bilibili.com/v/dance' },
  { name: 'Cinephile', icon: '#channel-cinephile', href: 'https://www.bilibili.com/v/cinephile' },
  { name: 'Showbiz', icon: '#channel-ent', href: 'https://www.bilibili.com/v/ent' },
  { name: 'Knowledge', icon: '#channel-knowledge', href: 'https://www.bilibili.com/v/knowledge' },
  { name: 'Technology', icon: '#channel-tech', href: 'https://www.bilibili.com/v/tech' },
  { name: 'News', icon: '#channel-information', href: 'https://www.bilibili.com/v/information' },
  { name: 'Foods', icon: '#channel-food', href: 'https://www.bilibili.com/v/food' },
  { name: 'Life', icon: '#channel-life', href: 'https://www.bilibili.com/v/life' },
  { name: 'Cars', icon: '#channel-car', href: 'https://www.bilibili.com/v/car' },
  { name: 'Fashion', icon: '#channel-fashion', href: 'https://www.bilibili.com/v/fashion' },
  { name: 'Sports', icon: '#channel-sports', href: 'https://www.bilibili.com/v/sports' },
  { name: 'Animals', icon: '#channel-animal', href: 'https://www.bilibili.com/v/animal' },
  { name: 'VLOG', icon: '#channel-vlog', href: 'https://www.bilibili.com/v/life/daily/#/530003' },
  { name: 'Funny', icon: '#channel-gaoxiao', href: 'https://www.bilibili.com/v/life/funny' },
  { name: 'Standalone gaming', icon: '#channel-danjiyouxi', href: 'https://www.bilibili.com/v/game/stand_alone' },
  { name: 'Vtubers & Vups', icon: '#channel-vtuber', href: 'https://www.bilibili.com/v/virtual' },
  { name: 'Charitable events', icon: '#channel-love', href: 'https://love.bilibili.com' },
  { name: 'MOOCs', icon: '#channel-gongkaike', href: 'https://www.bilibili.com/mooc' },
  { name: 'Articles', icon: '#channel-read', href: 'https://www.bilibili.com/read/home' },
  { name: 'Live', icon: '#channel-live', href: 'https://live.bilibili.com' },
  { name: 'Activities', icon: '#channel-activity', href: 'https://www.bilibili.com/blackboard/activity-list.html' },
  { name: 'Paid courses', icon: '#channel-zhishi', href: 'https://www.bilibili.com/cheese' },
  { name: 'Community', icon: '#channel-blackroom', href: 'https://www.bilibili.com/blackboard/activity-5zJxM3spoS.html' },
  { name: 'Music plus', icon: '#channel-musicplus', href: 'https://www.bilibili.com/v/musicplus' },
]
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 2em;
  height: 2em;
  vertical-align: bottom;
  fill: currentColor;
  overflow: hidden;
  margin-right: 1rem;
}
</style>
