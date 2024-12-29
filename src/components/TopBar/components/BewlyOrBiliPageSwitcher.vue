<script lang="ts" setup>
import { useBewlyApp } from '~/composables/useAppProvider'
import { settings } from '~/logic'
import { useMainStore } from '~/stores/mainStore'
import { isHomePage } from '~/utils/main'

const { activatedPage } = useBewlyApp()
const { getDockItemByPage } = useMainStore()

const options = readonly([
  {
    name: 'BewlyBewly',
    useOriginalBiliPage: false,
  },
  {
    name: 'BiliBili',
    useOriginalBiliPage: true,
  },
])

const currentPage = computed(() => {
  return settings.value.dockItemsConfig.find(dockItem => dockItem.page === activatedPage.value)
})

function switchPage(useOriginalBiliPage: boolean) {
  const dockItem = settings.value.dockItemsConfig.find(dockItem => dockItem.page === activatedPage.value)
  if (dockItem) {
    dockItem.useOriginalBiliPage = useOriginalBiliPage
  }
}
</script>

<template>
  <div
    v-if="getDockItemByPage(activatedPage)?.hasBewlyPage && isHomePage() && !settings.useOriginalBilibiliHomepage"
    style="backdrop-filter: var(--bew-filter-glass-1);"
    flex="~ gap-1" bg="$bew-elevated" p-1 rounded-full
    h-34px
  >
    <button
      v-for="option in options" :key="option.name"
      :class="{
        active: option.useOriginalBiliPage === currentPage?.useOriginalBiliPage,
      }"
      rounded-inherit text="$bew-text-2 hover:$bew-text-1 xs" p="x-4 y-1" bg="hover:$bew-fill-2"
      fw-bold duration-300
      @click="switchPage(option.useOriginalBiliPage)"
    >
      {{ option.name }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.active {
  --uno: "bg-$bew-fill-3 text-$bew-text-1";
}
</style>
