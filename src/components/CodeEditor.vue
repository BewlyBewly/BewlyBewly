<script setup lang="ts">
defineProps<{
  modelValue: string | number
}>()

const model = defineModel<string | number>()
</script>

<template>
  <textarea
    v-model="model"
    w-full h-500px border="1 solid $bew-border-color" rounded="4px" p-2
    outline-none bg="$bew-fill-1"
  />
</template>

<style lang="scss" scoped>
textarea {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */
}
</style>
