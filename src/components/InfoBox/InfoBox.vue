<template>
  <div class="infobox" :class="{active: open}">
    <img @click="$emit('close')" :src="closeIcon" alt="svg" class="infobox__close">
    <div class="infobox__block" v-if="current">
      <img v-lazy="getImageUrl(current.backdrop_path || current.poster_path)" alt="photo" class="infobox__block-img">
      <div class="infobox__block-content">
        <div class="infobox__block-info">
          <h2 class="infobox__block-info-title">{{ current.title || current.name }}</h2>
          <p class="infobox__block-info-text">{{ current.overview || settings.t('noDescription') }}</p>
          <p class="infobox__block-info-descr">
            <span v-if="current.vote_average" class="infobox__rating">
              ★ {{ Number(current.vote_average).toFixed(1) }}
            </span>
            <span>{{ getYear }}{{ getGenres }}</span>
            <span>{{ getTime }}</span>
          </p>
          <Actors :type="type" :id="current.id" :count="4"/>
          <div class="infobox__actions">
            <BtnMore :type="type" :id="current.id"/>
            <button
              type="button"
              class="infobox__fav-btn"
              :class="{ active: favorites.isFavorite(type, current.id) }"
              @click="favorites.toggleFavorite(current, type)"
            >
              <span>{{ favorites.isFavorite(type, current.id) ? '♥' : '♡' }}</span>
              <span>{{ favorites.isFavorite(type, current.id) ? settings.t('removeFromFavorites') : settings.t('addToFavorites') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "./InfoBox.scss";
import closeIcon from '@/assets/images/close.svg';
import { getImageUrl } from "@/apiUrl.js";
import { computed } from "vue";
import Actors from "@/components/UI/Actors.vue";
import BtnMore from "@/components/UI/BtnMore.vue";
import { useSettings } from "@/stores/settings.js";
import { useFavorites } from "@/stores/favorites.js";

const props = defineProps({
  current: Object,
  open: Boolean,
  type: String
});

const settings = useSettings();
const favorites = useFavorites();

const getYear = computed(() => {
  const dateStr = props.current?.release_date || props.current?.first_air_date;
  if (!dateStr) return '';
  const year = new Date(dateStr).getFullYear();
  return Number.isNaN(year) ? '' : `${year}, `;
});

const getGenres = computed(() => {
  if (!props.current?.genres?.length) return '';
  return props.current.genres.map((g) => g.name).join(', ');
});

const getTime = computed(() => {
  if (props.type === 'tv' && !props.current?.episode_run_time?.length) {
    return '';
  }
  const minutes =
    props.type === 'movie'
      ? props.current?.runtime
      : props.type === 'tv'
        ? props.current?.episode_run_time?.[0]
        : '';

  if (!minutes) return '';

  const hours = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return hours === 0 ? `${minute}m` : `${hours}h ${minute}m`;
});
</script>

<style lang="scss" scoped>
.infobox__rating {
  background: #149a03;
  color: #fff !important;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 700;
  margin-right: 10px;
}

.infobox__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.infobox__fav-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 20px;
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
