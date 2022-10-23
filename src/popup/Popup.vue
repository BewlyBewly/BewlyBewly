<script lang="ts">
import { storageDemo } from '~/logic/storage'
export default defineComponent({
  data() {
    return {
      storageDemo,
    }
  },
  methods: {
    openOptionsPage() {
      browser.runtime.openOptionsPage()
    },
  },
})
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />
    <div>BewlyBewly</div>
    <p class="mt-2 opacity-50">
      This is the popup page
    </p>
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div class="mt-2">
      <span class="opacity-50">Storage:</span>
      {{ storageDemo }}
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  font-size: 12px !important;
}
</style>
