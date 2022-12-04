<script setup lang="ts">
const imgURL = browser.runtime.getURL('/assets/loading.gif')
</script>

<template>
  <div
    w="full"
    h="46px"
    p="y-8"
    flex="~"
    justify="center"
    items="center"
  >
    <img
      :src="imgURL"
      alt="loading"
      w="46px"
      h="46px"
      m="r-2"
    >
    {{ $t('common.loading') }}
  </div>
</template>
