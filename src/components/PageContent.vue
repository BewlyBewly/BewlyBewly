<script setup lang="ts">
import { useBewlyApp } from '~/composables/useAppProvider'
import { AppPage } from '~/enums/appEnums'

const { activatedPage } = useBewlyApp()
const pages = {
  [AppPage.Home]: defineAsyncComponent(() => import('~/contentScripts/views/Home/Home.vue')),
  [AppPage.Search]: defineAsyncComponent(() => import('~/contentScripts/views/Search/Search.vue')),
  [AppPage.Anime]: defineAsyncComponent(() => import('~/contentScripts/views/Anime/Anime.vue')),
  [AppPage.History]: defineAsyncComponent(() => import('~/contentScripts/views/History/History.vue')),
  [AppPage.WatchLater]: defineAsyncComponent(() => import('~/contentScripts/views/WatchLater/WatchLater.vue')),
  [AppPage.Favorites]: defineAsyncComponent(() => import('~/contentScripts/views/Favorites/Favorites.vue')),
}
</script>

<template>
  <main m-auto max-w="$bew-page-max-width">
    <div
      p="t-80px" m-auto
      w="lg:85% md:[calc(90%-60px)] [calc(100%-140px)]"
    >
      <Transition name="page-fade">
        <Component :is="pages[activatedPage]" />
      </Transition>
    </div>
  </main>
</template>
