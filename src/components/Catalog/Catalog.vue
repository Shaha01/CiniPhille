<template>
  <section class="page catalog">
    <div class="catalog__glow" aria-hidden="true"></div>
    <div class="wrap">
      <div class="sector mono rise"><span>{{ type === 'tv' ? 'TV' : 'FILM' }}</span><i></i><b>{{ settings.t('catalog') }}</b></div>

      <div class="section__head catalog__head">
        <h1 class="h1 rise rise-2">
          {{ type === 'movie' ? settings.t('films') : settings.t('serials') }}<em>.</em>
        </h1>
        <p class="mono muted rise rise-3"><b class="catalog__count">{{ allContent.length }}</b> {{ settings.t('results') }}</p>
      </div>

      <div class="catalog__filters rise rise-3">
        <span class="mono muted">{{ settings.t('filters') }}</span>
        <label class="select">
          <select v-model="selectedGenre" @change="resetAndLoad" :aria-label="settings.t('allGenres')">
            <option value="">{{ settings.t('allGenres') }}</option>
            <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
          </select>
        </label>
        <label class="select">
          <select v-model="selectedYear" @change="resetAndLoad" :aria-label="settings.t('allYears')">
            <option value="">{{ settings.t('allYears') }}</option>
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </label>
        <div class="tabs">
          <button
            v-for="s in sorts"
            :key="s.value"
            type="button"
            :class="{ 'is-active': sortBy === s.value }"
            @click="setSort(s.value)"
          >{{ s.label }}</button>
        </div>
      </div>

      <ErrorState v-if="popularStore.error && !allContent.length" @retry="resetAndLoad" />

      <div class="grid" v-if="allContent.length">
        <CatalogItem
          v-for="item in allContent"
          :key="`${item.id}-${item.title || item.name}`"
          :item="item"
          :type="type"
        />
      </div>

      <div v-if="allContent.length && !loading" class="catalog__more">
        <button type="button" class="btn btn--ghost" @click="getContent">
          <span>{{ settings.t('loadMore') }}</span>
          <svg class="arrow" viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg>
        </button>
      </div>
    </div>
    <Loader v-if="loading" />
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import CatalogItem from "@/components/Catalog/CatalogItem.vue";
import { usePopular } from "@/stores/popular.js";
import { useSettings } from "@/stores/settings.js";
import Loader from "@/components/UI/Loader.vue";
import ErrorState from "@/components/UI/ErrorState.vue";

const props = defineProps({
  type: String,
});

const popularStore = usePopular();
const settings = useSettings();

const currentPage = ref(1);
const allContent = ref([]);
const loading = ref(false);

const selectedGenre = ref('');
const selectedYear = ref('');
const sortBy = ref('popularity.desc');

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

const sorts = computed(() => [
  { value: 'popularity.desc', label: settings.t('sortPopular') },
  { value: 'vote_average.desc', label: settings.t('sortRating') },
  {
    value: props.type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc',
    label: settings.t('sortNewest')
  }
]);

const genres = computed(() =>
  props.type === 'movie' ? popularStore.genresMovie : popularStore.genresTv
);

const setSort = (value) => {
  if (sortBy.value === value) return;
  sortBy.value = value;
  resetAndLoad();
};

let requestId = 0;

const getContent = async () => {
  if (loading.value) return;
  loading.value = true;
  const myRequest = requestId;

  let items = [];
  const hasFilters = selectedGenre.value || selectedYear.value || sortBy.value !== 'popularity.desc';

  if (hasFilters) {
    items = await popularStore.discoverContent({
      type: props.type,
      page: currentPage.value,
      genre: selectedGenre.value,
      year: selectedYear.value,
      sortBy: sortBy.value
    });
  } else {
    items = await popularStore.getPopular({
      type: props.type,
      page: currentPage.value
    });
  }

  if (myRequest !== requestId) {
    // filters changed while this page was loading — drop it and load the fresh set
    loading.value = false;
    getContent();
    return;
  }

  if (Array.isArray(items)) {
    const existingIds = new Set(allContent.value.map((i) => i.id));
    const newItems = items.filter((i) => !existingIds.has(i.id));
    allContent.value.push(...newItems);
  }
  currentPage.value++;
  loading.value = false;
};

const resetAndLoad = () => {
  requestId++;
  currentPage.value = 1;
  allContent.value = [];
  getContent();
};

const handleScroll = () => {
  if (popularStore.error) return;
  if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 600) {
    getContent();
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

watch(
  () => props.type,
  (type) => {
    if (type) {
      selectedGenre.value = '';
      selectedYear.value = '';
      sortBy.value = 'popularity.desc';
      popularStore.getGenres(type);
      resetAndLoad();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.catalog {
  position: relative;
  overflow: hidden;

  &__glow {
    position: absolute;
    width: 60vmax;
    height: 60vmax;
    right: -20vmax;
    top: -25vmax;
    z-index: -1;
    background: radial-gradient(closest-side, rgba(255, 42, 61, .18), rgba(43, 76, 255, .08) 55%, transparent);
    filter: blur(30px);
  }

  &__head { margin-bottom: 28px; }

  &__count {
    color: var(--neon);
    font-family: var(--f-display);
    font-size: 16px;
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 14px 0 clamp(28px, 4vw, 44px);
    margin-bottom: clamp(20px, 3vw, 32px);
    border-bottom: 1px solid var(--line);

    > .mono { margin-right: 6px; }
  }

  &__more {
    display: flex;
    justify-content: center;
    margin-top: 48px;
  }
}

@media (max-width: 600px) {
  .catalog__filters .tabs {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }
}
</style>
