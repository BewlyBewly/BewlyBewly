<template>
  <div bg="$bew-bg">
    <div class="banner flex justify-center items-center flex-col"></div>
    <recommend-content></recommend-content>
  </div>
</template>

<script setup lang="ts">
import RecommendContent from './RecommendContent.vue'
</script>

<style lang="scss">
.banner {
  height: 83px;
  max-height: unset;
  transition: 0.3s;
}
</style>
