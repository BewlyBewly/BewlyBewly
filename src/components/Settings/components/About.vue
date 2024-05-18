<script setup lang="ts">
import DOMPurify from 'dompurify'
import browser from 'webextension-polyfill'

import Button from '~/components/Button.vue'
import Dialog from '~/components/Dialog.vue'
import Tooltip from '~/components/Tooltip.vue'
import { settings } from '~/logic'

import { version } from '../../../../package.json'

const importSettingsRef = ref<HTMLElement>()
const dialogVisible = reactive({
  justWannaChangeTheJob: false,
})

function handleImportSettings() {
  if (importSettingsRef.value) {
    importSettingsRef.value.click()

    const handleChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files && input.files.length > 0) {
        // A file has been selected
        const selectedFile = input.files[0]
        // Clear all previous file contents
        input.value = ''

        const reader = new FileReader()
        reader.onload = (event: Event) => {
          const fileReaderTarget = event.target as FileReader
          const fileContent = fileReaderTarget.result as string
          const jsonObject = JSON.parse(fileContent) as any

          // Merge the new settings with the existing settings
          Object.keys(jsonObject).forEach((key) => {
            if (key in settings.value)
              (settings.value as any)[key] = jsonObject[key]
          })

          importSettingsRef.value?.removeEventListener('change', handleChange)
        }
        reader.readAsText(selectedFile)
      }
    }

    importSettingsRef.value.addEventListener('change', handleChange)
  }
}

function handleExportSettings() {
  const jsonStr = JSON.stringify(settings.value)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'bewly-settings.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div
    flex items-center justify-center w-full
  >
    <div flex="~ col gap-4" items-center mt-8>
      <img :src="`${browser.runtime.getURL('/assets/icon-512.png')}`" alt="" width="80">
      <section text-xl>
        BewlyBewly <a href="https://github.com/hakadao/BewlyBewly/releases" target="_blank" un-text="sm color-$bew-text-2 hover:color-$bew-text-3">v{{ version }}</a>
      </section>
      <section mt-4 flex gap-2>
        <a
          href="https://github.com/hakadao/BewlyBewly" target="_blank"
          p="y-2 x-4" flex items-center bg="black dark:white" un-text="!white dark:!black"
          rounded-12
          w-100px
        >
          <div i-tabler:brand-github mr-2 shrink-0 /> GitHub
        </a>
        <a
          href="https://space.bilibili.com/5011356/dynamic" target="_blank"
          p="y-2 x-4" flex items-center bg="#fb7299 dark:#ffa7c0" un-text="!white dark:!black"
          rounded-12
          w-100px
        >
          <div i-tabler:brand-bilibili mr-2 shrink-0 /> Bilibili
        </a>
        <a
          href="https://discord.gg/TS6vgBmZVp" target="_blank"
          p="y-2 x-4" flex items-center bg="#5866F2 dark:#a0a7f8" un-text="!white dark:!black"
          rounded-12
          w-100px
        >
          <div i-tabler:brand-discord mr-2 shrink-0 /> Discord
        </a>
      </section>
      <section mt-4 flex="~ col gap-2 items-center">
        <Button class="btn" @click="handleImportSettings">
          <template #left>
            <div i-uil:import />
          </template>
          <input ref="importSettingsRef" type="file" accept=".json" hidden>
          {{ $t('settings.import_settings') }}
        </Button>
        <Tooltip placement="bottom" :content="$t('settings.export_settings_desc')">
          <Button class="btn" @click="handleExportSettings">
            <template #left>
              <div i-uil:export />
            </template>
            {{ $t('settings.export_settings') }}
          </Button>
        </Tooltip>
      </section>
      <section mt-4>
        <!-- <h3 text="xl center" mb-2>
          {{ $t('settings.contributors') }}
        </h3> -->
        <Button type="tertiary" @click="dialogVisible.justWannaChangeTheJob = true">
          <template #left>
            <i class="i-solar:expressionless-circle-bold-duotone" text-xl />
          </template>
          {{ $t('settings.just_wanna_change_the_job') }}
        </Button>
        <Dialog
          v-if="dialogVisible.justWannaChangeTheJob"
          width="90%"
          max-width="740px"
          content-height="70vh"
          content-max-height="700px"
          append-to-bewly-body
          @close="dialogVisible.justWannaChangeTheJob = false"
        >
          <template #title>
            <div text-18px font-bold>
              {{ $t('settings.just_wanna_change_the_job') }}
            </div>
            <a
              href="mailto:hakadao2000@gmail.com"
              block text-14px color="$bew-theme-color" mt-2
            >
              Gmail: hakadao2000@gmail.com
            </a>
          </template>
          <div text-16.5px mb-2>
            {{ $t('settings.contact_me') }}
            <a href="mailto:hakadao2000@gmail.com" color="$bew-theme-color">hakadao2000@gmail.com</a>,
            GitHub: <a href="https://github.com/hakadao" target="_blank" color="$bew-theme-color">Hakadao</a>
          </div>
          <div
            whitespace-pre-wrap lh-8 text-16.5px
            :frosted-glass="false"
            v-html="DOMPurify.sanitize($t('settings.just_wanna_change_the_job_desc'))"
          />

          <a href="mailto:hakadao2000@gmail.com" mt-2 text-16.5px color="$bew-theme-color">Gmail: hakadao2000@gmail.com</a>
          <i
            class="i-solar:planet-bold-duotone"
            pos="fixed bottom-0 right-0" opacity-10 pointer-events-none
            w-500px h-500px
          />
          <i
            class="i-solar:rocket-bold-duotone"
            pos="fixed top-130px left-20px" opacity-10 pointer-events-none
            w-200px h-200px
          />
        </Dialog>
      </section>
      <section mt-8>
        <h3 text="xl center" mb-2>
          {{ $t('settings.contributors') }}
        </h3>
        <a href="https://github.com/hakadao/BewlyBewly/graphs/contributors" target="_blank">
          <img src="https://contrib.rocks/image?repo=hakadao/BewlyBewly">
        </a>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  --b-button-color: var(--bew-fill-1);
  --b-button-color-hover: var(--bew-fill-2);
}
</style>
