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
])

const otherLinks = computed(() => [
  { name: t('topbar.logo_dropdown.articles'), icon: '#channel-read', href: 'https://www.bilibili.com/read/home' },
  { name: t('topbar.logo_dropdown.live'), icon: '#channel-live', href: 'https://live.bilibili.com' },
  { name: t('topbar.logo_dropdown.activities'), icon: '#channel-activity', href: 'https://www.bilibili.com/blackboard/activity-list.html' },
  { name: t('topbar.logo_dropdown.paid_courses'), icon: '#channel-zhishi', href: 'https://www.bilibili.com/cheese' },
  { name: t('topbar.logo_dropdown.community'), icon: '#channel-blackroom', href: 'https://www.bilibili.com/blackboard/activity-5zJxM3spoS.html' },
  { name: t('topbar.logo_dropdown.music_plus'), icon: '#channel-musicplus', href: 'https://www.bilibili.com/v/musicplus' },
  { name: 'Game Center', icon: 'i-mingcute:game-2-fill', color: '#69B1DD', href: 'https://game.bilibili.com/platform' },
  { name: 'Bilibili Store', icon: 'i-mingcute:store-fill', color: '#E4C081', href: 'https://show.bilibili.com/platform/home.html' },
  { name: 'Manga', icon: 'i-mingcute:store-fill', color: '#E4C081', href: 'https://manga.bilibili.com' },
  { name: 'Game Competitions', icon: 'i-mingcute:sword-fill', color: '#C8D3DF', href: 'https://www.bilibili.com/match/home' },
])
</script>

<template>
  <div
    style="backdrop-filter: var(--bew-filter-glass-1);"
    shadow="[var(--bew-shadow-3),var(--bew-shadow-edge-glow-1)]"
    flex="~ gap-1"
    p="4"
    bg="$bew-elevated-alt"
    rounded="$bew-radius"
    border="1 $bew-border-color"
  >
    <ul
      v-for="(item, index) in [0, 10, 20, 30]"
      :key="index"
      class="link-list"
    >
      <li
        v-for="genre in genres.slice(item, item + 10)"
        :key="genre.name"
        class="link-item"
      >
        <a
          :href="genre.href"
          :target="isHomePage() ? '_blank' : '_self'"
        >
          <svg aria-hidden="true" class="svg-icon">
            <use :xlink:href="genre.icon" />
          </svg>
          <span>{{ genre.name }}</span>
        </a>
      </li>
    </ul>
    <ul
      v-for="(item, index) in [0]"
      :key="index"
      class="link-list"
    >
      <li
        v-for="otherLink in otherLinks.slice(item, item + 10)"
        :key="otherLink.name"
        class="link-item"
      >
        <a
          :href="otherLink.href"
          :target="isHomePage() ? '_blank' : '_self'"
        >
          <svg
            v-if="otherLink.icon.startsWith('#')"
            class="svg-icon"
            aria-hidden="true"
          >
            <use :xlink:href="otherLink.icon" />
          </svg>
          <div
            v-else
            class="icon"
          >
            <i
              :class="otherLink.icon"
              :style="{ color: otherLink.color }"
            />
          </div>
          <span>{{ otherLink.name }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.link-list {
  --uno: "last-of-type:p-4 last-of-type:bg-$bew-fill-1 last-of-type:m--4 last-of-type:rounded-r-$bew-radius";
  --uno: "last-of-type:ml-2";
}

.link-item {
  --uno: "mb-1 last-of-type:mb-0 text-sm";

  a {
    --uno: "flex items-center w-170px h-38px p-2 rounded-$bew-radius duration-300";
    --uno: "hover:bg-$bew-fill-alt hover:shadow-[var(--bew-shadow-1),var(--bew-shadow-edge-glow-1)]";
  }
}

.svg-icon {
  --uno: "w-2em h-2em mr-4 vertical-bottom fill-current overflow-hidden";
}

.icon {
  --uno: "w-2em h-2em mr-4 bg-$bew-content-solid vertical-bottom fill-current overflow-hidden";
  --uno: "text-sm grid place-items-center rounded-1/2";
}
</style>
