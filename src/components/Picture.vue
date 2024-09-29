<script setup lang="ts">
defineProps<{
  src: string
  loading: 'lazy' | 'eager'
  alt: string
}>()
</script>

<template>
  <picture>
    <source :srcset="`${src}.avif`" type="image/avif">
    <source :srcset="`${src}.webp`" type="image/webp">
    <img
      :src="src"
      :loading="loading"
      block w-full h-full object="[inherit]" aspect-inherit
      rounded-inherit
    >
  </picture>
</template>
