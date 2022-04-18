<script setup lang="ts">
const emptyImg = browser.runtime.getURL('/assets/empty.png')
</script>

<template>
  <div flex="~" justify="center" items="center">
    <img :src="emptyImg" w="200px" h="auto">
  </div>
</template>
