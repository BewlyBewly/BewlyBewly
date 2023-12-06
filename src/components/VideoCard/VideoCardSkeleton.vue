<script setup lang="ts">
defineProps<{
  horizontal?: boolean
  hasTag?: boolean
}>()
</script>

<template>
  <div
    v-if="!horizontal"
    mb-8 pointer-events-none select-none
  >
    <div aspect-video bg="$bew-fill-4" rounded="$bew-radius" />
    <div flex mt-4>
      <div
        m="r-4" w="40px" h="40px" rounded="1/2" bg="$bew-fill-4"
        shrink-0
      />
      <div w-full>
        <div grid gap-2>
          <div w-full h-5 bg="$bew-fill-3" />
          <div w="3/4" h-5 bg="$bew-fill-3" />
        </div>
        <div grid gap-2 mt-4>
          <div w="50%" h-4 bg="$bew-fill-2" />
          <div w="80%" h-4 bg="$bew-fill-2" />
        </div>
        <div
          text="transparent sm" inline-block mt-4 p="x-2 y-1" bg="$bew-fill-1"
          rounded-4
        >
          hello world
        </div>
      </div>
    </div>
  </div>

  <div
    v-else
    flex="~ gap-6"
    mb-10 pointer-events-none select-none
  >
    <!-- Cover -->
    <div
      :style="{ width: '300px' }" shrink-0 aspect-video h-fit bg="$bew-fill-4"
      rounded="$bew-radius"
    />
    <!-- Other Information -->
    <div
      w-full mt-0
      flex="~ gap-4"
    >
      <div w-full>
        <div grid gap-2>
          <div w-full h-5 bg="$bew-fill-3" />
          <div w="3/4" h-5 bg="$bew-fill-3" />
        </div>
        <div grid gap-2 mt-4>
          <div :style="{ width: '70%' }" h-4 bg="$bew-fill-2" />
          <div w="80%" h-4 bg="$bew-fill-2" />
        </div>

        <div mt-4 flex>
          <div text="transparent sm" inline-block p="x-2 y-1" bg="$bew-fill-1" rounded-4>
            hello world
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
