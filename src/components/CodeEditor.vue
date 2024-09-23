<script setup lang="ts">
// import { computed, ref, watch } from 'vue'
// import { Codemirror } from 'vue-codemirror'

defineProps<{
  modelValue: string | number
  // language?: string
}>()

// const emit = defineEmits(['update:modelValue'])

const model = defineModel<string | number>()

// const code = ref(props.modelValue)

// watch(() => props.modelValue, (newValue) => {
//   if (newValue !== code.value)
//     code.value = newValue
// })

// const extensions = computed(() => {
//   const exts = []
//   if (props.language === 'css')
//     exts.push(css())
//   else
//     exts.push(javascript())

//   exts.push(oneDark)
//   return exts
// })

// function onChange(value: string) {
//   code.value = value
//   emit('update:modelValue', value)
// }
</script>

<template>
  <!-- <Codemirror
    v-model="code"
    :extensions="extensions"
    :indent-with-tab="true"
    :tab-size="2"
    :style="{ height: '500px', border: '1px solid var(--bew-border-color)', borderRadius: '4px !important' }"
    @change="onChange"
  /> -->
  <textarea
    v-model="model"
    w-full h-500px border="1 solid $bew-border-color" rounded="4px" p-2
    outline-none
  />
</template>
