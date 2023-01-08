<script setup lang="ts">
import RecommendContent from './RecommendContent.vue'
</script>

<template>
  <div bg="$bew-bg">
    <div class="banner flex justify-center items-center flex-col" />
    <recommend-content />
  </div>
</template>

<style lang="scss">
.banner {
  height: 83px;
  max-height: unset;
  transition: 0.3s;
}
</style>
