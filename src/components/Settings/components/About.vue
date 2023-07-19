<script setup lang="ts">
import browser from 'webextension-polyfill'
import { version } from '../../../../package.json'
</script>

<template>
  <div flex items-center justify-center>
    <div flex="~ col gap-1" items-center>
      <img :src="`${browser.runtime.getURL('/assets/icon-512.png')}`" alt="" width="80">
      <p text-xl>
        BewlyBewly <a href="https://github.com/hakadao/BewlyBewly/releases" target="_blank" un-text="sm $bew-theme-color">v{{ version }}</a>
      </p>
      <p text="sm $bew-text-3">
        Made by Hakadao
      </p>
      <a
        type="primary" p="y-2 x-4" mt-6 flex items-center bg="black dark:white" un-text="white dark:black" rounded-12
        href="https://github.com/hakadao/BewlyBewly" target="_blank"
      >
        <tabler:brand-github mr-2 /> Github
      </a>
    </div>
  </div>
</template>
