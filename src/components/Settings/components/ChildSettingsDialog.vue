<script setup lang="ts">
defineProps<{
  title: string
  desc?: string
  center?: boolean
}>()

const emit = defineEmits(['close'])

function handleClose() {
  emit('close')
}
</script>

<template>
  <div class="child-settings-dialog">
    <div
      pos="fixed top-0 left-0" w-full h-full bg="black opacity-20 dark:opacity-40" rounded="$bew-radius"
      z-1
      @click="handleClose"
    />
    <div
      style="
        --un-shadow: var(--bew-shadow-3) var(--bew-shadow-edge-glow-2);
        backdrop-filter: var(--bew-filter-glass-2);
      "
      pos="fixed top-1/2 left-1/2" bg="$bew-content-2 dark:$bew-elevated-1" rounded="$bew-radius"
      transform="translate--1/2 translate-z-0 gpu" z-2 shadow overflow="x-hidden y-overlay" w="$b-dialog-width"
      h="$b-dialog-height" antialiased
    >
      <header
        style="
          text-shadow: 0 0 15px var(--bew-elevated-solid-1), 0 0 20px var(--bew-elevated-solid-1)
        "
        pos="sticky top-0 left-0" w-full h-80px px-8 flex
        items-center justify-between
        rounded="t-$bew-radius" z-1
      >
        <div px-8 w-full pos="absolute left-0" :style="{ textAlign: center ? 'center' : 'left' }">
          <p text-xl fw-bold>
            {{ title }}
          </p>
          <p text="sm $bew-text-2">
            <slot name="desc">
              {{ desc }}
            </slot>
          </p>
        </div>

        <div
          style="backdrop-filter: var(--bew-filter-glass-1)"
          text-2xl leading-0 bg="$bew-fill-1 hover:$bew-theme-color-30" w="32px" h="32px"
          ml-auto p="1" rounded-8 cursor="pointer"
          hover:ring="2 $bew-theme-color" hover:text="$bew-theme-color" duration-300
          @click="handleClose"
        >
          <div i-ic-baseline-clear />
        </div>
      </header>
      <main p="x-9 b-5" relative>
        <!-- <div h-80px mt--8 /> -->
        <slot />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.child-settings-dialog {
  --b-dialog-width: 85%;
  --b-dialog-height: auto;
}
</style>
