<script setup lang="ts">
import type { AnimeTimeTableItem } from '../types'
import { removeHttpFromUrl } from '~/utils'

const animeTimeTable = reactive<AnimeTimeTableItem[]>([])
const daysOfTheWeekList = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

onMounted(() => {
  getAnimeTimeTable()
})

function getAnimeTimeTable() {
  browser.runtime
    .sendMessage({
      contentScriptQuery: 'getAnimeTimeTable',
    })
    .then((res) => {
      const { code, result } = res
      if (code === 0)
        Object.assign(animeTimeTable, result as AnimeTimeTableItem[])
    })
}
</script>

<template>
  <div>
    <HorizontalScrollView :default-scroll-left="600">
      <ul flex="~">
        <li
          v-for="item in animeTimeTable"
          :key="item.date_ts"
          w="1/7"
          p="x-2 b-8"
          shrink-0
          :bg="item.is_today ? '!$bew-theme-color-10' : ''"
          hover:bg="$bew-fill-1"
          duration-300
        >
          <div flex mb-3 items-end h="66px" overflow-hidden>
            <div
              :w="item.is_today ? '50px' : '38px'"
              :h="item.is_today ? '48px' : '36px'"
              mr-4
              :style="{
                backgroundPosition: item.is_today
                  ? `-56px ${-36 + (item.day_of_week - 1) * -72}px`
                  : `-146px ${-36 + (item.day_of_week - 1) * -72}px`,
                backgroundSize: item.is_today ? '247px 663px' : '',
                filter: item.is_today
                  ? `drop-shadow(50px 0 var(--bew-text-1))`
                  : `drop-shadow(38px 0 var(--bew-text-3))`,
              }"
              style="
                transform: translateX(-100%);
                background-size: 247px 663px;
                background-image: url(//s1.hdslb.com/bfs/static/bangumi-timeline/asserts/icons.png);
              "
            />
            <h3 :text="item.is_today ? '$bew-text-2' : '$bew-text-3'">
              <span text="2xl" font-bold>{{
                daysOfTheWeekList[item.day_of_week - 1]
              }}</span>
              <span text="base $bew-text-2" ml-2>{{ item.date }}</span>
            </h3>
          </div>
          <span
            block
            w-full
            h-4px
            :bg="item.is_today ? '$bew-theme-color' : '$bew-fill-3'"
            rounded-8
          />
          <ul
            grid
            gap-4
            :border-l="`~ 2px dashed ${
              item.is_today ? '$bew-theme-color-40' : '$bew-fill-2'
            }`"
            p="t-3 l-3"
          >
            <li v-for="episode in item.episodes" :key="episode.season_id">
              <div
                p="x-2 y-1"
                w="[fit-content]"
                mb-2
                rounded-4
                :color="item.is_today ? '$bew-theme-color' : '$bew-text-3'"
                :bg="item.is_today ? '$bew-theme-color-10' : '$bew-fill-1'"
                relative
                grid
                place-items-center
              >
                <i
                  pos="absolute left--3"
                  w-2
                  h-2
                  rounded-6
                  :bg="item.is_today ? '$bew-theme-color' : '$bew-fill-3'"
                  transform="~ translate-x-[calc(-0.25rem-1px)]"
                />
                {{ episode.pub_time }}
              </div>

              <div flex gap-4>
                <a
                  :href="`//www.bilibili.com/bangumi/play/ss${episode.season_id}`"
                  target="_blank"
                  shrink-0
                >
                  <img
                    :src="`${removeHttpFromUrl(episode.square_cover)}@300w_300h.webp`"
                    :alt="episode.title"
                    w-18
                    aspect="square"
                    rounded="$bew-radius-half"
                  >
                </a>
                <div flex="~ col">
                  <a
                    :href="`//www.bilibili.com/bangumi/play/ss${episode.season_id}`"
                    target="_blank"
                  >{{ episode.title }}</a>
                  <p mt-auto text="$bew-theme-color">
                    {{ episode.pub_index }}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </HorizontalScrollView>
  </div>
</template>
