<script setup lang="ts">
import browser from 'webextension-polyfill'
const emptyImg = browser.runtime.getURL('/assets/empty.png')
</script>

<template>
  <div flex="~" justify="center" items="center">
    <img :src="emptyImg" w="200px" h="auto">
  </div>
</template>
