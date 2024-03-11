<script setup lang="ts">
import browser from 'webextension-polyfill'
import { version } from '../../../../package.json'
import { settings } from '~/logic'

const importSettingsRef = ref<HTMLElement>()

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
          <tabler:brand-github mr-2 shrink-0 /> GitHub
        </a>
        <a
          href="https://space.bilibili.com/5011356/dynamic" target="_blank"
          p="y-2 x-4" flex items-center bg="#fb7299 dark:#ffa7c0" un-text="!white dark:!black"
          rounded-12
          w-100px
        >
          <tabler:brand-bilibili mr-2 shrink-0 /> Bilibili
        </a>
        <a
          href="https://discord.gg/TS6vgBmZVp" target="_blank"
          p="y-2 x-4" flex items-center bg="#5866F2 dark:#a0a7f8" un-text="!white dark:!black"
          rounded-12
          w-100px
        >
          <tabler:brand-discord mr-2 shrink-0 /> Discord
        </a>
      </section>
      <section mt-4 flex="~ col gap-2 items-center">
        <Button class="btn" @click="handleImportSettings">
          <template #left>
            <uil:import />
          </template>
          <input ref="importSettingsRef" type="file" accept=".json" hidden>
          {{ $t('settings.import_settings') }}
        </Button>
        <Tooltip placement="bottom" :content="$t('settings.export_settings_desc')">
          <Button class="btn" @click="handleExportSettings">
            <template #left>
              <uil:export />
            </template>
            {{ $t('settings.export_settings') }}
          </Button>
        </Tooltip>
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
