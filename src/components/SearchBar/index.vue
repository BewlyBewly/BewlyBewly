<script lang="ts">
import { addSearchHistory, getSearchHistory, HistoryItem, removeSearchHistory, SuggestionItem } from './search-history-provider'

export default defineComponent({
  data() {
    return {
      isFocus: false,
      keyword: '',
      suggestions: [] as SuggestionItem[],
      selectedIndex: -1,
      searchHistory: [] as HistoryItem[],
    }
  },
  mounted() {
    this.searchHistory = getSearchHistory()
  },
  methods: {
    onSearchChange() {
      browser.runtime
        .sendMessage({
          contentScriptQuery: 'getSearchSuggestion',
          term: this.keyword,
        })
        .then((res) => {
          this.suggestions = res
        })
    },
    goToSearchPage(keyword: string) {
      if (keyword) {
        window.open(`//search.bilibili.com/all?keyword=${keyword}`, '_blank')
        const searchItem = {
          value: keyword,
          timestamp: Number(new Date()),
        }
        addSearchHistory(searchItem)
        this.searchHistory = getSearchHistory()
      }
    },
    onDelHistoryItem(value: string) {
      removeSearchHistory(value)
      this.searchHistory = getSearchHistory()
    },
    onUp() {
      if (this.selectedIndex <= 0) {
        this.selectedIndex = 0
        return
      }

      this.selectedIndex--

      if (this.isFocus && Object.keys(this.suggestions).length !== 0)
        this.keyword = this.suggestions[this.selectedIndex].value
      else if (this.isFocus && this.searchHistory.length !== 0)
        this.keyword = this.searchHistory[this.selectedIndex].value

      document.querySelectorAll('.suggestion-item').forEach((item, index) => {
        if (index === this.selectedIndex)
          item.classList.add('active')
        else
          item.classList.remove('active')
      })

      document.querySelectorAll('.history-item').forEach((item, index) => {
        if (index === this.selectedIndex)
          item.classList.add('active')
        else
          item.classList.remove('active')
      })
    },
    onDown() {
      let isShowSuggestion = false
      if (this.isFocus && Object.keys(this.suggestions).length !== 0)
        isShowSuggestion = true
      else if (this.isFocus && !this.keyword && this.searchHistory.length !== 0)
        isShowSuggestion = false

      if (isShowSuggestion && this.selectedIndex >= Object.keys(this.suggestions).length - 1) {
        this.selectedIndex = Object.keys(this.suggestions).length - 1
        return
      }
      if (!isShowSuggestion && this.selectedIndex >= this.searchHistory.length - 1) {
        this.selectedIndex = this.searchHistory.length - 1
        return
      }

      this.selectedIndex++
      this.keyword = isShowSuggestion
        ? this.suggestions[this.selectedIndex].value
        : this.searchHistory[this.selectedIndex].value

      document.querySelectorAll('.suggestion-item').forEach((item, index) => {
        if (index === this.selectedIndex)
          item.classList.add('active')
        else
          item.classList.remove('active')
      })

      document.querySelectorAll('.history-item').forEach((item, index) => {
        if (index === this.selectedIndex)
          item.classList.add('active')
        else
          item.classList.remove('active')
      })
    },
  },

})
</script>

<template>
  <div
    id="search-wrap"
    w="full max-500px"
    m="x-8"
    pos="relative"
  >
    <div
      v-if="isFocus"
      class="fixed top-0 left-0"
      w="full"
      h="full"
      content="~"
      @click="isFocus = false"
    ></div>
    <div class="search-bar">
      <input
        v-model.trim="keyword"
        type="text"
        @focus="isFocus = true"
        @input="onSearchChange()"
        @keyup.enter="goToSearchPage(keyword)"
        @keyup.up="onUp"
        @keyup.down="onDown"
      />
      <button class="search-btn" @click="goToSearchPage(keyword)">
        <tabler:search />
      </button>
    </div>

    <transition>
      <div v-if="isFocus && searchHistory.length !== 0 && Object.keys(suggestions).length === 0" id="search-history">
        <div
          v-for="(item) in searchHistory"
          :key="item.value"
          class="history-item"
          @click="goToSearchPage(item.value)"
        >
          {{ item.value }}
          <button class="delete" @click.stop="onDelHistoryItem(item.value)">
            <ic-baseline-clear />
          </button>
        </div>
      </div>
    </transition>

    <transition>
      <div v-if="isFocus && Object.keys(suggestions).length !== 0" id="search-suggestion">
        <div
          v-for="(item, index) in suggestions"
          :key="index"
          class="suggestion-item"
          @click="goToSearchPage(item.value)"
        >
          {{ item.value }}
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  @apply transition-all duration-300
}

.v-enter-from,
.v-leave-to {
  @apply transform translate-y-4 opacity-0 scale-95
}

#search-wrap {

  @mixin card-content {
    @apply text-base border-none outline-none w-full
      bg-$bew-content-1 backdrop-$bew-filter-glass;
    box-shadow: var(--bew-shadow-2);
    backdrop-filter: var(--bew-filter-glass);
  }

  .search-bar {
    @apply flex items-center relative;

    input {
      @include card-content;
      @apply rounded-$bew-radius pl-6 pr-16 py-3 text-$bew-text-1;
    }

    .search-btn {
      @apply p-2 rounded-full text-lg leading-0 duration-300
       border-none outline-none absolute right-2
       text-$bew-text-1
       hover:bg-$bew-fill-2;
    }
  }

  @mixin search-content {
    @include card-content;
    @apply mt-2 p-2 absolute rounded-$bew-radius
      hover:block;
  }

  @mixin search-content-item {
    @apply px-4 py-2 w-full rounded-$bew-radius duration-300 cursor-pointer
      not-first:mt-1
      hover:bg-$bew-fill-2;

    &.active {
      @apply bg-$bew-fill-2;
    }
  }

  #search-history,
  #search-suggestion {
    @include search-content;

    .history-item,
    .suggestion-item {
      @include search-content-item;
    }
  }

  #search-history {
    .history-item {
      @apply flex justify-between items-center;

      .delete {
        @apply rounded-full duration-300 text-base
        leading-0 pointer-events-auto cursor-pointer
        text-$bew-text-2;
      }
    }
  }
}
</style>
