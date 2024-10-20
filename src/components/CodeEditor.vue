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
    outline-none
  />
</template>
