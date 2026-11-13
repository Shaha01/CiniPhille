<template>
  <section class="page search">
    <div class="wrap">
      <div class="sector mono rise"><span>SRCH</span><i></i><b>{{ settings.t('searchLabel') }}</b></div>

      <label class="search__field rise rise-2">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>
        <input
          ref="input"
          class="search__input"
          :placeholder="settings.t('searchPlaceholder')"
          type="search"
          autocomplete="off"
          spellcheck="false"
          v-model="text"
        >
        <button v-if="text" type="button" class="search__clear" :aria-label="settings.t('close')" @click="clearSearch">
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </label>

      <div class="search__bar rise rise-3">
        <p class="mono muted">
          <template v-if="searchStore.result && text.trim()">
            <b class="search__count">{{ filteredResults.length }}</b> {{ settings.t('results') }}
          </template>
          <template v-else>{{ settings.t('searchHint') }}</template>
        </p>
        <div v-if="searchStore.result && searchStore.result.length" class="tabs">
          <button
            v-for="t in tabs"
            :key="t.value"
            type="button"
            :class="{ 'is-active': filterType === t.value }"
            @click="filterType = t.value"
          >{{ t.label }}</button>
        </div>
      </div>

      <Loader v-if="searchStore.loading" />

      <div class="grid" v-else-if="filteredResults.length">
        <SearchContent
          v-for="item in filteredResults"
          :key="`${item.media_type}-${item.id}`"
          :item="item"
        />
      </div>

      <div
        v-else-if="text.trim() && searchStore.result && filteredResults.length === 0"
        class="search__empty"
      >
        <b class="search__empty-big" aria-hidden="true">DNF</b>
        <p>{{ settings.t('nothingFound') }} «{{ text }}»</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import SearchContent from "@/components/Search/SearchContent.vue";
import Loader from "@/components/UI/Loader.vue";
import { useSearch } from "@/stores/search.js";
import { useSettings } from "@/stores/settings.js";

const searchStore = useSearch();
const settings = useSettings();
const text = ref('');
const filterType = ref('all');
const input = ref(null);

const tabs = computed(() => [
  { value: 'all', label: settings.t('all') },
  { value: 'movie', label: settings.t('films') },
  { value: 'tv', label: settings.t('serials') }
]);

const filteredResults = computed(() => {
  const list = searchStore.result || [];
  if (filterType.value === 'all') return list;
  return list.filter((i) => i.media_type === filterType.value);
});

let timer = null;

const clearSearch = () => {
  text.value = '';
  searchStore.result = null;
  input.value?.focus();
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

onMounted(() => {
  searchStore.result = null;
  input.value?.focus();
});

onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<style lang="scss" scoped>
.search {
  &__field {
    position: relative;
    display: flex;
    align-items: center;
    gap: clamp(12px, 2vw, 24px);
    padding: 6px 0 18px;
    border-bottom: 2px solid var(--line-2);
    transition: border-color .3s;

    &:focus-within { border-color: var(--neon); }

    > svg {
      width: clamp(28px, 4vw, 56px);
      height: clamp(28px, 4vw, 56px);
      flex: none;
      fill: none;
      stroke: var(--neon);
      stroke-width: 1.6;
    }
  }

  &__input {
    flex: 1;
    min-width: 0;
    font-family: var(--f-display);
    font-weight: 800;
    font-size: clamp(26px, 5vw, 76px);
    letter-spacing: -0.04em;
    line-height: 1.1;
    caret-color: var(--neon);

    &::placeholder {
      color: transparent;
      -webkit-text-stroke: 1px rgba(255, 255, 255, .22);
    }

    &::-webkit-search-cancel-button { display: none; }
  }

  &__clear {
    width: 46px;
    height: 46px;
    flex: none;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: 1px solid var(--line-2);
    transition: border-color .3s, transform .4s var(--ease);

    svg {
      width: 18px;
      height: 18px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
    }

    &:hover {
      border-color: var(--neon);
      transform: rotate(90deg);
    }
  }

  &__bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin: 22px 0 clamp(28px, 4vw, 44px);
  }

  &__count {
    color: var(--neon);
    font-family: var(--f-display);
    font-size: 16px;
  }

  &__empty {
    display: grid;
    gap: 10px;
    justify-items: start;
    padding: 40px 0;
    color: var(--text-2);
  }

  &__empty-big {
    font-family: var(--f-display);
    font-weight: 900;
    font-size: clamp(80px, 16vw, 220px);
    line-height: .85;
    letter-spacing: -0.06em;
    color: transparent;
    -webkit-text-stroke: 1.5px var(--neon);
  }
}
</style>
