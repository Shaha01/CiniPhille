<template>
  <div class="main__intro">
    <img v-lazy="getImageUrl(item.poster_path)" alt="" class="main__intro-poster">
    <div class="main__intro-block">
      <div class="main__intro-block-left">
        <h1 class="main__intro-block-left-title">{{ item.title || item.name }}</h1>
        <p class="main__intro-block-left-text">{{ item.overview || settings.t('noDescription') }}</p>
        <p class="main__intro-block-left-descr">
          <span v-if="item.vote_average" class="intro-rating">★ {{ Number(item.vote_average).toFixed(1) }}</span>
          <span>{{ getYear }}{{ getGenres }}</span>
          <span>{{ getTime }}</span>
        </p>
        <div class="intro-actions">
          <Trailer :type="type" :id="item.id" />
          <button
            type="button"
            class="fav-btn"
            :class="{ active: favorites.isFavorite(type, item.id) }"
            @click="favorites.toggleFavorite(item, type)"
          >
            <span>{{ favorites.isFavorite(type, item.id) ? '♥' : '♡' }}</span>
            <span>{{ favorites.isFavorite(type, item.id) ? settings.t('removeFromFavorites') : settings.t('addToFavorites') }}</span>
          </button>
        </div>
      </div>
      <div class="main__intro-block-right">
        <img v-lazy="getImageUrl(item.backdrop_path || item.poster_path)" alt="" class="main__intro-block-right-img">
      </div>

      <div class="main__intro-actors">
        <h2 class="main__intro-actors-title">{{ settings.t('inMainRoles') }}</h2>
        <Actors :type="type" :id="item.id" :count="6" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getImageUrl } from "@/apiUrl.js";
import { computed } from "vue";
import Actors from "@/components/UI/Actors.vue";
import { useSettings } from "@/stores/settings.js";
import { useFavorites } from "@/stores/favorites.js";

const props = defineProps({
  type: String,
  item: Object
});

const settings = useSettings();
const favorites = useFavorites();

const getYear = computed(() => {
  const dateStr = props.item?.release_date || props.item?.first_air_date;
  if (!dateStr) return '';
  const year = new Date(dateStr).getFullYear();
  return Number.isNaN(year) ? '' : `${year}, `;
});

const getGenres = computed(() => {
  if (!props.item?.genres?.length) return '';
  return props.item.genres.map((g) => g.name).join(', ');
});

const getTime = computed(() => {
  if (props.type === 'tv' && !props.item?.episode_run_time?.length) {
    return '';
  }
  const minutes =
    props.type === 'movie'
      ? props.item?.runtime
      : props.type === 'tv'
        ? props.item?.episode_run_time?.[0]
        : '';

  if (!minutes) return '';

  const hours = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return hours === 0 ? `${minute}m` : `${hours}h ${minute}m`;
});
</script>

<style lang="scss" scoped>
.intro-rating {
  background: #149a03;
  color: #fff !important;
  padding: 2px 10px;
  border-radius: 6px;
  font-weight: 700;
  margin-right: 10px;
}

.intro-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}

.fav-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 22px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(20, 20, 20, 0.7);
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &.active,
  &:hover {
    background: #e50914;
    border-color: #e50914;
  }
}
</style>
