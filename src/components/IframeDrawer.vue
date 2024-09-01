<script setup lang="ts">
const props = defineProps<{
  url: string
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const model = defineModel<boolean>({ required: true, default: false })

watch(() => model.value, (newValue) => {
  if (newValue)
    history.pushState({}, '', props.url)
  else
    history.pushState({}, '', 'https://www.bilibili.com')
})
</script>

<template>
  <div
    pos="absolute top-0 left-0" of-hidden w-full h-full
    z-100 pointer-events-none
  >
    <!-- Mask -->
    <div
      v-if="model"
      pos="absolute bottom-0 left-0" w-full h-full bg="black opacity-60"
      pointer-events-auto
      @click="emit('close')"
    />

    <!-- Iframe -->
    <Transition name="drawer">
      <div
        v-if="model"
        pos="absolute bottom-0 left-0" bg="$bew-bg"
        w-full h="[calc(100%-var(--bew-top-bar-height))]"
      >
        <iframe
          :src="url" frameborder="0"
          pointer-events-auto
          pos="absolute bottom-0 left-0"
          w-full h-full
        />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateY(100%);
}
</style>
