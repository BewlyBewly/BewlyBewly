<script setup lang="ts">
// import Home from '~/contentScripts/views/Home'
// import Home from '~/contentScripts/views/Home/index.vue'
import { storageDemo } from '~/logic/storage'
</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <pixelarticons-sliders class="icon-btn mx-2 text-2xl" />
    <div>Options</div>
    <p class="mt-2 opacity-50">
      This is the options page
    </p>

    <input v-model="storageDemo" class="border border-gray-400 rounded px-2 py-1 mt-2">

    <div class="mt-4">
      Powered by Vite <pixelarticons-zap class="align-middle" />
    </div>
    <!-- <Home /> -->
    <!-- <router-view /> -->
  </main>
</template>

<style lang="scss" scoped>

</style>
