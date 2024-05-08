<script setup lang="ts">
const props = defineProps<{
  horizontal?: boolean
  hasTag?: boolean
}>()

const wValue = computed((): string => {
  if (props.horizontal)
    return 'xl:280px lg:250px md:200px 200px'
  else
    return 'w-full'
})
</script>

<template>
  <div
    v-if="!horizontal"
    mb-4 pointer-events-none select-none
    class="video-card__skeleton"
  >
    <div aspect-video bg="$bew-fill-2" />
    <div flex mt-4 class="video-card__skeleton__content">
      <div
        m="r-4" w="36px" h="36px" rounded="1/2" bg="$bew-fill-2"
        shrink-0
      />
      <div w-full>
        <div grid gap-2>
          <div w-full h-5 bg="$bew-fill-3" />
          <div w="3/4" h-5 bg="$bew-fill-3" />
        </div>
        <div grid gap-2 mt-2>
          <div w="40%" h-4 bg="$bew-fill-2" />
          <div w="80%" h-4 bg="$bew-fill-2" />
        </div>
        <div
          text="transparent sm" inline-block mt-4 p="x-2" h-7
          bg="$bew-fill-1" rounded-4
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
    class="video-card__skeleton"
  >
    <!-- By directly using predefined unocss width properties, it is possible to dynamically set the width attribute -->
    <div hidden w="xl:280px lg:250px md:200px 200px" />
    <div hidden w="full" />

    <!-- Cover -->
    <div
      :w="wValue" shrink-0 aspect-video h-fit bg="$bew-fill-4"
    />
    <!-- Other Information -->
    <div
      w-full mt-0
      flex="~ gap-4"
      class="mt-2"
    >
      <div w-full>
        <div grid gap-2>
          <div w="5/6" h-5 bg="$bew-fill-3" />
          <div w="3/4" h-5 bg="$bew-fill-3" />
        </div>

        <div mt-4 flex>
          <div
            text="transparent sm" inline-block p="x-2" h-7 bg="$bew-fill-1"
            rounded-4
          >
            hello world
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.video-card__skeleton {
  overflow: hidden;
  border-radius: var(--bew-radius);
  background-repeat: no-repeat;
  background-position: left -60px top 0;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.15);
}

.video-card__skeleton__content {
  --at-apply: p2 pt0;
}
</style>
