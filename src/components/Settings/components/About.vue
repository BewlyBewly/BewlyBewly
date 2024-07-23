<script setup lang="ts">
import DOMPurify from 'dompurify'
import browser from 'webextension-polyfill'

import Button from '~/components/Button.vue'
import Dialog from '~/components/Dialog.vue'
import Tooltip from '~/components/Tooltip.vue'
import { settings } from '~/logic'

import { version } from '../../../../package.json'

const importSettingsRef = ref<HTMLElement>()
const hasNewVersion = ref<boolean>(false)
const dialogVisible = reactive({
  sponsor: false,
  justWannaChangeTheJob: false,
})

onMounted(() => {
  checkGitHubRelease()
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

async function checkGitHubRelease() {
  const apiUrl = `https://api.github.com/repos/BewlyBewly/BewlyBewly/releases/latest`

  try {
    const response = await fetch(apiUrl)
    if (!response.ok)
      throw new Error('Network response was not ok')

    const data = await response.json()
    const latestVersion = data.tag_name

    // Here you can compare `latestVersion` with your current version
    const currentVersion = `v${version}` // Replace with your actual current version

    if (latestVersion !== currentVersion)
      hasNewVersion.value = true
  }
  catch {
  }
}
</script>

<template>
  <div>
    <div max-w-600px mx-auto>
      <div relative w-200px m-auto>
        <img
          :src="`${browser.runtime.getURL('/assets/bewly-vtuber-style-logo.png')}`" alt="" width="200"
        >

        <a
          v-if=" hasNewVersion"
          href="https://github.com/hakadao/BewlyBewly/releases" target="_blank"
          pos="absolute bottom-0 right-0" transform="translate-x-50%" un-text="xs $bew-text-1" p="y-1 x-2" bg="$bew-fill-1"
          rounded-12
        >
          NEW
        </a>
      </div>
      <section text-xl text-center>
        <p>BewlyBewly</p>
        <p text-center>
          <a href="https://github.com/hakadao/BewlyBewly/releases" target="_blank" un-text="sm color-$bew-text-2 hover:color-$bew-text-3">v{{ version }}</a>
        </p>
      </section>

      <section
        style="box-shadow: var(--bew-shadow-1), var(--bew-shadow-edge-glow-1);"
        mt-6 p-4 bg="$bew-fill-alt" rounded="$bew-radius"
        flex="~ col items-center gap-6"
      >
        <section w-full>
          <h3 class="title">
            {{ $t('settings.links') }}
          </h3>
          <div grid="~ xl:cols-5 lg:cols-4 md:cols-3 cols-2 gap-2">
            <a
              href="https://github.com/hakadao/BewlyBewly" target="_blank"
              class="link-card"
              bg="black dark:white !opacity-10 !hover:opacity-20"
              un-text="black dark:white"
            >
              <div i-tabler:brand-github /> GitHub
            </a>
            <a
              href="https://space.bilibili.com/5011356/dynamic" target="_blank"
              class="link-card"
              bg="#fb7299 dark:#ffa7c0 !opacity-10 !hover:opacity-20"
              un-text="#fb7299 dark:#ffa7c0"
            >
              <div i-tabler:brand-bilibili /> Bilibili
            </a>
            <a
              href="https://discord.gg/TS6vgBmZVp" target="_blank"
              class="link-card"
              bg="#5866f2 dark:#a0a7f8 !opacity-10 !hover:opacity-20"
              un-text="#5866f2 dark:#a0a7f8"
            >
              <div i-tabler:brand-discord /> Discord
            </a>
            <a
              href="https://x.com/search?q=BewlyBewly%20(from%3Ahakadaooo%20OR%20from%3Ahakadaoooo)&src=typed_query" target="_blank"
              class="link-card"
              bg="#1d9bf0 dark:#7ec6f7 !opacity-10 !hover:opacity-20"
              un-text="#1d9bf0 dark:#7ec6f7"
            >
              <div i-tabler:brand-twitter /> Twitter
            </a>

            <button
              class="link-card"
              bg="#f87171 dark:#fca5a5 !opacity-10 !hover:opacity-20"
              un-text="#f87171 dark:#fca5a5"
              @click="dialogVisible.sponsor = true"
            >
              <div i-tabler:heart /> {{ $t('settings.sponsor') }}
            </button>
            <Dialog
              v-if="dialogVisible.sponsor"
              width="50%"
              max-width="600px"
              :title="$t('settings.sponsor')"
              content-height="50vh"
              append-to-bewly-body
              @close="dialogVisible.sponsor = false"
            >
              <p mb-4>
                {{ $t('settings.sponsor_desc') }}
              </p>
              <p mb-4>
                1. {{ $t('settings.afdian') }}:
                <a
                  href="https://afdian.com/@hakadao" target="_blank"
                  color="$bew-theme-color"
                >https://afdian.com/@hakadao</a>
              </p>
              <img
                :src="browser.runtime.getURL('/assets/sponsor/afdian.jpg')" alt=""
                max-w-400px w-full
              >

              <p mb-4 mt-6>
                2. Buy me a coffee:
                <a
                  href="https://buymeacoffee.com/hakadao" target="_blank"
                  color="$bew-theme-color"
                >https://buymeacoffee.com/hakadao</a>
              </p>
              <img
                :src="browser.runtime.getURL('/assets/sponsor/bmc.png')" alt=""
                max-w-150px w-full
              >
            </Dialog>
          </div>
        </section>
        <section w-full>
          <h3 class="title">
            {{ `${$t('settings.import_settings')} / ${$t('settings.export_settings')}` }}
          </h3>
          <div flex="~ gap-2">
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
          </div>
        </section>
        <!-- <section>
          <h3 class="title">
            {{ $t('settings.contributors') }}
          </h3>
          <a
            href="https://github.com/hakadao/BewlyBewly/graphs/contributors" target="_blank"
          >
            <img
              src="https://contrib.rocks/image?repo=hakadao/BewlyBewly"
              w-full
            >
          </a>
        </section> -->
      </section>
      <section mt-4>
        <Button
          type="tertiary" mx-auto
          @click="dialogVisible.justWannaChangeTheJob = true"
        >
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  --b-button-color: var(--bew-fill-1);
  --b-button-color-hover: var(--bew-fill-2);
}

.title {
  --uno: "text-base fw-bold mb-2";
}

.link-card {
  --uno: "w-full h-48px px-4 py-2 flex items-center rounded-$bew-radius";
  --uno: "duration-300";

  > div {
    --uno: "mr-2 shrink-0";
  }
}
</style>
