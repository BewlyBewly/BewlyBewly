<script setup lang="ts">
import RecommendContent from './components/RecommendContent.vue'
import emitter from '~/utils/mitt'

const recommendContentKey = ref<string>(`recommendContent${Number(new Date())}`)

onMounted(() => {
  emitter.off('pageRefresh')
  emitter.on('pageRefresh', async () => {
    recommendContentKey.value = `recommendContent${Number(new Date())}`
  })
})

onUnmounted(() => {
  emitter.off('pageRefresh')
})
</script>

<template>
  <transition name="fade">
    <RecommendContent :key="recommendContentKey" />
  </transition>
</template>

<style scoped lang="scss"></style>
