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
    <div pos="fixed top-0 left-0" w-full h-full bg="black opacity-20 dark:opacity-40" rounded="$bew-radius" z-1 @click="handleClose" />
    <div
      pos="fixed top-1/2 left-1/2" bg="$bew-elevated-solid-1" rounded="$bew-radius"
      transform="translate--1/2" z-2 shadow="$bew-shadow-3" overflow="x-hidden y-overlay" w="$b-dialog-width" h="$b-dialog-height"
    >
      <header
        pos="sticky top-0 left-0" w-full h-80px px-8 flex items-center justify-between
        rounded="t-$bew-radius" z-1
        style="
          background: linear-gradient(var(--bew-elevated-solid-1), transparent);
          text-shadow: 0 0 15px var(--bew-elevated-solid-1), 0 0 20px var(--bew-elevated-solid-1)
        "
      >
        <!-- Mask -->
        <div
          pos="absolute top-0 left-0" w-inherit h-inherit backdrop="blur-6px" pointer-events-none
          style="mask-image: linear-gradient(to bottom,  black 70%, transparent);"
          z--1 rounded-inherit
        />

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
          text-2xl leading-0 bg="$bew-fill-1 hover:$bew-theme-color-30" w="32px" h="32px" ml-auto p="1" rounded-8 cursor="pointer" backdrop-glass
          hover:ring="2 $bew-theme-color" hover:text="$bew-theme-color" duration-300
          @click="handleClose"
        >
          <ic-baseline-clear />
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
