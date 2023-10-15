<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const genres = computed(() => {
  return [
    { name: 'All', rid: 0 },
    { name: t('topbar.logo_dropdown.anime'), seasonType: 1 },
    { name: t('topbar.logo_dropdown.chinese_anime'), seasonType: 4 },
    { name: t('topbar.logo_dropdown.chinese_anime'), rid: 168 },
    { name: t('topbar.logo_dropdown.documentary_films'), seasonType: 3 },
    { name: t('topbar.logo_dropdown.animations'), rid: 1 },
    { name: t('topbar.logo_dropdown.music'), rid: 3 },
    { name: t('topbar.logo_dropdown.dance'), rid: 129 },
    { name: t('topbar.logo_dropdown.gaming'), rid: 4 },
    { name: t('topbar.logo_dropdown.knowledge'), rid: 36 },
    { name: t('topbar.logo_dropdown.technology'), rid: 188 },
    { name: t('topbar.logo_dropdown.sports'), rid: 234 },
    { name: t('topbar.logo_dropdown.cars'), rid: 223 },
    { name: t('topbar.logo_dropdown.life'), rid: 160 },
    { name: t('topbar.logo_dropdown.foods'), rid: 211 },
    { name: t('topbar.logo_dropdown.animals'), rid: 217 },
    { name: t('topbar.logo_dropdown.kichiku'), rid: 119 },
    { name: t('topbar.logo_dropdown.fashion'), rid: 155 },
    { name: t('topbar.logo_dropdown.showbiz'), rid: 5 },
    { name: t('topbar.logo_dropdown.cinephile'), rid: 181 },
    { name: t('topbar.logo_dropdown.movies'), seasonType: 2 },
    { name: t('topbar.logo_dropdown.tv_shows'), seasonType: 5 },
    { name: t('topbar.logo_dropdown.variety_shows'), seasonType: 7 },
    { name: 'Original', rid: 0, type: 'origin' },
    { name: 'Newest Uploader', rid: 0, type: 'rookie' },
  ]
})
</script>

<template>
  <div>
    <ul>
      <li>
        <a href="">ALL</a>
      </li>
    </ul>
  </div>
</template>
