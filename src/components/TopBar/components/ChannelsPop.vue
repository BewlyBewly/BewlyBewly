<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { isHomePage } from '~/utils/main'

const { t } = useI18n()

const genres = computed(() => [
  { name: t('topbar.logo_dropdown.anime'), icon: '#channel-anime', href: 'https://www.bilibili.com/anime' },
  { name: t('topbar.logo_dropdown.movies'), icon: '#channel-movie', href: 'https://www.bilibili.com/movie' },
  { name: t('topbar.logo_dropdown.chinese_anime'), icon: '#channel-guochuang', href: 'https://www.bilibili.com/guochuang' },
  { name: t('topbar.logo_dropdown.tv_shows'), icon: '#channel-teleplay', href: 'https://www.bilibili.com/tv' },
  { name: t('topbar.logo_dropdown.variety_shows'), icon: '#channel-zongyi', href: 'https://www.bilibili.com/variety' },
  { name: t('topbar.logo_dropdown.documentary_films'), icon: '#channel-documentary', href: 'https://www.bilibili.com/documentary' },
  { name: t('topbar.logo_dropdown.animations'), icon: '#channel-douga', href: 'https://www.bilibili.com/v/douga' },
  { name: t('topbar.logo_dropdown.gaming'), icon: '#channel-game', href: 'https://www.bilibili.com/v/game' },
  { name: t('topbar.logo_dropdown.kichiku'), icon: '#channel-kichiku', href: 'https://www.bilibili.com/v/kichiku' },
  { name: t('topbar.logo_dropdown.music'), icon: '#channel-music', href: 'https://www.bilibili.com/v/music' },
  { name: t('topbar.logo_dropdown.dance'), icon: '#channel-dance', href: 'https://www.bilibili.com/v/dance' },
  { name: t('topbar.logo_dropdown.cinephile'), icon: '#channel-cinephile', href: 'https://www.bilibili.com/v/cinephile' },
  { name: t('topbar.logo_dropdown.showbiz'), icon: '#channel-ent', href: 'https://www.bilibili.com/v/ent' },
  { name: t('topbar.logo_dropdown.knowledge'), icon: '#channel-knowledge', href: 'https://www.bilibili.com/v/knowledge' },
  { name: t('topbar.logo_dropdown.technology'), icon: '#channel-tech', href: 'https://www.bilibili.com/v/tech' },
  { name: t('topbar.logo_dropdown.news'), icon: '#channel-information', href: 'https://www.bilibili.com/v/information' },
  { name: t('topbar.logo_dropdown.foods'), icon: '#channel-food', href: 'https://www.bilibili.com/v/food' },
  { name: t('topbar.logo_dropdown.life'), icon: '#channel-life', href: 'https://www.bilibili.com/v/life' },
  { name: t('topbar.logo_dropdown.cars'), icon: '#channel-car', href: 'https://www.bilibili.com/v/car' },
  { name: t('topbar.logo_dropdown.fashion'), icon: '#channel-fashion', href: 'https://www.bilibili.com/v/fashion' },
  { name: t('topbar.logo_dropdown.sports'), icon: '#channel-sports', href: 'https://www.bilibili.com/v/sports' },
  { name: t('topbar.logo_dropdown.animals'), icon: '#channel-animal', href: 'https://www.bilibili.com/v/animal' },
  { name: t('topbar.logo_dropdown.vlog'), icon: '#channel-vlog', href: 'https://www.bilibili.com/v/life/daily/#/530003' },
  { name: t('topbar.logo_dropdown.funny'), icon: '#channel-gaoxiao', href: 'https://www.bilibili.com/v/life/funny' },
  { name: t('topbar.logo_dropdown.standalone_gaming'), icon: '#channel-danjiyouxi', href: 'https://www.bilibili.com/v/game/stand_alone' },
  { name: t('topbar.logo_dropdown.vtubers'), icon: '#channel-vtuber', href: 'https://www.bilibili.com/v/virtual' },
  { name: t('topbar.logo_dropdown.charitable_events'), icon: '#channel-love', href: 'https://love.bilibili.com' },
  { name: t('topbar.logo_dropdown.moocs'), icon: '#channel-gongkaike', href: 'https://www.bilibili.com/mooc' },
  { name: t('topbar.logo_dropdown.articles'), icon: '#channel-read', href: 'https://www.bilibili.com/read/home' },
  { name: t('topbar.logo_dropdown.live'), icon: '#channel-live', href: 'https://live.bilibili.com' },
  { name: t('topbar.logo_dropdown.activities'), icon: '#channel-activity', href: 'https://www.bilibili.com/blackboard/activity-list.html' },
  { name: t('topbar.logo_dropdown.paid_courses'), icon: '#channel-zhishi', href: 'https://www.bilibili.com/cheese' },
  { name: t('topbar.logo_dropdown.community'), icon: '#channel-blackroom', href: 'https://www.bilibili.com/blackboard/activity-5zJxM3spoS.html' },
  { name: t('topbar.logo_dropdown.music_plus'), icon: '#channel-musicplus', href: 'https://www.bilibili.com/v/musicplus' },
])
</script>

<template>
  <div
    style="backdrop-filter: var(--bew-filter-glass-1);"
    shadow="$bew-shadow-3"
    flex="~"
    p="4"
    bg="$bew-elevated-1"
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
          :target="isHomePage() ? '_blank' : '_self'"
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
