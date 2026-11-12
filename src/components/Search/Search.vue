<template>
  <div class="main__search">
    <div class="container">
      <div class="search-bar">
        <input
          class="main__search-input"
          :placeholder="settings.t('searchPlaceholder')"
          type="text"
          v-model="text"
        >
        <button
          v-if="text"
          type="button"
          class="search-bar__clear"
          @click="clearSearch"
        >
          ✕
        </button>
      </div>

      <div v-if="searchStore.result && searchStore.result.length" class="search-tabs">
        <button
          type="button"
          class="search-tabs__btn"
          :class="{ active: filterType === 'all' }"
          @click="filterType = 'all'"
        >
          {{ settings.t('all') }}
        </button>
        <button
          type="button"
          class="search-tabs__btn"
          :class="{ active: filterType === 'movie' }"
          @click="filterType = 'movie'"
        >
          {{ settings.t('films') }}
        </button>
        <button
          type="button"
          class="search-tabs__btn"
          :class="{ active: filterType === 'tv' }"
          @click="filterType = 'tv'"
        >
          {{ settings.t('serials') }}
        </button>
      </div>

      <Loader v-if="searchStore.loading" />

      <div class="main__search-list" v-else-if="filteredResults.length">
        <SearchContent
          v-for="item in filteredResults"
          :key="`${item.media_type}-${item.id}`"
          :item="item"
        />
      </div>

      <p
        v-else-if="text.trim() && searchStore.result && filteredResults.length === 0"
        class="search-empty"
      >
        {{ settings.t('nothingFound') }} "{{ text }}"
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from "vue";
import './Search.scss';
import SearchContent from "@/components/Search/SearchContent.vue";
import Loader from "@/components/UI/Loader.vue";
import { useSearch } from "@/stores/search.js";
import { useSettings } from "@/stores/settings.js";

const searchStore = useSearch();
const settings = useSettings();
const text = ref('');
const filterType = ref('all');

const filteredResults = computed(() => {
  const list = searchStore.result || [];
  if (filterType.value === 'all') return list;
  return list.filter((i) => i.media_type === filterType.value);
});

let timer = null;

const clearSearch = () => {
  text.value = '';
  searchStore.result = null;
};

watch(text, (val) => {
  clearTimeout(timer);
  const trimmed = val.trim();
  if (!trimmed) {
    searchStore.result = null;
    return;
  }
  timer = setTimeout(() => {
    searchStore.searching(trimmed);
  }, 450);
});

onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<style lang="scss" scoped>
.search-bar {
  position: relative;

  &__clear {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.15);
    color: #141414;
    font-size: 16px;
    cursor: pointer;
  }
}

.search-tabs {
  display: flex;
  gap: 10px;
  margin-top: 20px;

  &__btn {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 8px 18px;
    font-family: 'Raleway', sans-serif;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;

    &.active,
    &:hover {
      background: #149a03;
      border-color: #149a03;
    }
  }
}

.search-empty {
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-size: 18px;
  margin-top: 40px;
  text-align: center;
}
</style>
