<template>
  <div class="main__catalog">
    <div class="container">
      <div class="catalog-header">
        <h2 class="main__catalog-title">
          {{ title }}
        </h2>

        <div class="catalog-filters">
          <select v-model="selectedGenre" class="catalog-filters__select" @change="resetAndLoad">
            <option value="">{{ settings.t('allGenres') }}</option>
            <option v-for="g in genres" :key="g.id" :value="g.id">
              {{ g.name }}
            </option>
          </select>

          <select v-model="selectedYear" class="catalog-filters__select" @change="resetAndLoad">
            <option value="">{{ settings.t('allYears') }}</option>
            <option v-for="y in years" :key="y" :value="y">
              {{ y }}
            </option>
          </select>

          <select v-model="sortBy" class="catalog-filters__select" @change="resetAndLoad">
            <option value="popularity.desc">{{ settings.t('sortPopular') }}</option>
            <option value="vote_average.desc">{{ settings.t('sortRating') }}</option>
            <option :value="type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc'">
              {{ settings.t('sortNewest') }}
            </option>
          </select>
        </div>
      </div>

      <ErrorState v-if="popularStore.error && !allContent.length" @retry="resetAndLoad" />

      <div class="main__catalog-list" v-if="allContent.length">
        <CatalogItem
          v-for="item in allContent"
          :key="`${item.id}-${item.title || item.name}`"
          :item="item"
          :type="type"
        />
      </div>

      <div v-if="allContent.length && !loading" class="catalog-more">
        <button type="button" class="catalog-more__btn" @click="getContent">
          {{ settings.t('loadMore') }}
        </button>
      </div>
    </div>
  </div>
  <Loader v-if="loading"/>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import CatalogItem from "@/components/Catalog/CatalogItem.vue";
import { usePopular } from "@/stores/popular.js";
import { useSettings } from "@/stores/settings.js";
import "./Catalog.scss";
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
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

const genres = computed(() =>
  props.type === 'movie' ? popularStore.genresMovie : popularStore.genresTv
);

const getContent = async () => {
  if (loading.value) return;
  loading.value = true;

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

  if (Array.isArray(items)) {
    const existingIds = new Set(allContent.value.map((i) => i.id));
    const newItems = items.filter((i) => !existingIds.has(i.id));
    allContent.value.push(...newItems);
  }
  currentPage.value++;
  loading.value = false;
};

const resetAndLoad = () => {
  currentPage.value = 1;
  allContent.value = [];
  getContent();
};

const handleScroll = () => {
  if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 250) {
    getContent();
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
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

const title = computed(() =>
  props.type === "movie"
    ? settings.t('allFilms')
    : props.type === "tv"
      ? settings.t('allSerials')
      : ""
);
</script>

<style lang="scss" scoped>
.catalog-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.catalog-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  &__select {
    background: #1f1f1f;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    padding: 10px 14px;
    font-family: 'Raleway', sans-serif;
    font-size: 15px;
    cursor: pointer;
    outline: none;

    &:focus {
      border-color: #149a03;
    }
  }
}

.catalog-more {
  display: flex;
  justify-content: center;
  margin-top: 40px;

  &__btn {
    background: #149a03;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 14px 36px;
    font-family: 'Raleway', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.85;
    }
  }
}
</style>
