<script setup lang="ts">
defineProps<{
  horizontal?: boolean
  hasTag?: boolean
}>()
</script>

<template>
  <div
    v-if="!horizontal"
    mb-4 pointer-events-none select-none
  >
    <div aspect-video bg="$bew-skeleton" rounded="$bew-radius" />
    <div flex mt-5>
      <div
        m="r-2" w="34px" h="34px" rounded="1/2" bg="$bew-skeleton"
        shrink-0
      />
      <div w="[calc(100%-30px)]">
        <div flex="~ col gap-2" mb-4 w-inherit>
          <div w-full h-5 bg="$bew-skeleton" rounded-4px />
          <div w="3/4" h-5 bg="$bew-skeleton" rounded-4px />
        </div>
        <div flex="~ col gap-2" mb-3>
          <div w="40%" h-3 bg="$bew-skeleton" rounded-4px />
          <div w="60%" h-3 bg="$bew-skeleton" rounded-4px />
        </div>
        <div
          text="transparent sm" inline-block p="x-2" lh-22px
          bg="$bew-skeleton" rounded-4
        >
          hello world
        </div>
      </div>
    </div>
  </div>

  <div
    v-else
    flex="~ gap-6"
    mb-4 pointer-events-none select-none
  >
    <!-- By directly using predefined unocss width properties, it is possible to dynamically set the width attribute -->
    <div hidden w="xl:280px lg:250px md:200px 200px" />
    <div hidden w="full" />

    <!-- Cover -->
    <div
      :class="horizontal ? 'horizontal-card-cover' : 'vertical-card-cover'"
      shrink-0 aspect-video h-fit bg="$bew-skeleton"
      rounded="$bew-radius"
    />
    <!-- Other Information -->
    <div
      w-full mt-0
      flex="~ gap-4"
    >
      <div w="[calc(100%-30px)]">
        <div grid gap-2>
          <div w-full h-5 bg="$bew-skeleton" rounded-4px />
        </div>

        <div mt-4 flex="~ col gap-2">
          <div flex="~ items-center justify-start" w-inherit>
            <div
              m="r-2" w="34px" h="34px" rounded="1/2" bg="$bew-skeleton"
              shrink-0
            />

            <div w="40%" h-5 bg="$bew-skeleton" rounded-4px />
          </div>
          <div w="60%" h-4 bg="$bew-skeleton" rounded-4px />
          <div
            text="transparent sm" inline-block w-fit
            lh-6 p="x-2" mt-1
            bg="$bew-skeleton" rounded-4
          >
            hello world
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.horizontal-card-cover {
  --uno: "xl:w-280px lg:w-250px md:w-200px w-200px";
}

.vertical-card-cover {
  --uno: "w-full";
}
</style>
