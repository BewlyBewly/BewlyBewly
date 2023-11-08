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
  <div flex items-center justify-center h-full mt--80px>
    <div flex="~ col gap-1" items-center>
      <img :src="`${browser.runtime.getURL('/assets/icon-512.png')}`" alt="" width="80">
      <p text-xl>
        BewlyBewly <a href="https://github.com/hakadao/BewlyBewly/releases" target="_blank" un-text="sm color-$bew-text-2 hover:color-$bew-text-3">v{{ version }}</a>
      </p>
      <p text="sm $bew-text-2">
        Made by Hakadao
      </p>
      <p mt-6 flex gap-2>
        <a
          href="https://github.com/hakadao/BewlyBewly" target="_blank"
          p="y-2 x-4" flex items-center bg="black dark:white" un-text="!white dark:!black" rounded-12
          w-95px
        >
          <tabler:brand-github mr-2 /> Github
        </a>
        <a
          href="https://space.bilibili.com/5011356/dynamic" target="_blank"
          p="y-2 x-4" flex items-center bg="#fb7299 dark:#ffa7c0" un-text="!white dark:!black" rounded-12
          w-95px
        >
          <tabler:brand-bilibili mr-2 /> Bilibili
        </a>
      </p>
      <p pos="relative top-14">
        <Button class="btn" @click="handleImportSettings">
          <template #left>
            <mingcute:arrow-right-down-line />
          </template>
          <input ref="importSettingsRef" type="file" accept=".json" hidden>
          {{ $t('settings.import_settings') }}
        </Button>
        <Button class="btn" mt-2 @click="handleExportSettings">
          <template #left>
            <mingcute:arrow-left-up-line />
          </template>
          {{ $t('settings.export_settings') }}
        </Button>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  --b-button-color: var(--bew-fill-1);
  --b-button-color-hover: var(--bew-fill-2);
}
</style>
