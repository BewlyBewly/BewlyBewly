<script lang="ts" setup>
import type { Ref } from 'vue'

const hahaha = ref() as Ref<HTMLElement>

const app = document.querySelector('#app') as HTMLElement
// app.innerHTML = ''

// document.body.removeChild(app)

onMounted(() => {
  const videoPlayer = document.querySelector('#playerWrap') as HTMLElement
  if (hahaha.value)
    hahaha.value.appendChild(videoPlayer)
})
</script>

<template>
  <div>
    <div ref="hahaha" class="uwuwuw" />
  </div>
</template>

<style lang="scss" scoped>

</style>
