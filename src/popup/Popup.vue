<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />
    <div>BewlyBewly</div>
    <p class="mt-2 opacity-50">
      This is the popup page
    </p>
    <div>
      Disable topbar (Compatible with bilibili evolved)
      <input v-model="isShowTopbar" type="checkbox" />
      {{ isShowTopbar }}
    </div>
    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <div class="mt-2">
      <span class="opacity-50">Storage:</span>
      {{ storageDemo }}
    </div>
  </main>
</template>

<script lang="ts">
import { storageDemo, isShowTopbar } from '~/logic/storage'
export default defineComponent({
  data() {
    return {
      isShowTopbar,
      storageDemo,
    }
  },
  methods: {
    openOptionsPage() {
      browser.runtime.openOptionsPage()
    },
  },
})
// const isShowTopbar = false
// console.log(isShowTopbar)

// function openOptionsPage() {
//   browser.runtime.openOptionsPage()
// }
</script>

<style lang="scss" scoped>
main {
  font-size: 12px!important;
}
</style>
