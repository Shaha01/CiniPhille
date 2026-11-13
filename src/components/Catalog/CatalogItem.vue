<template>
  <router-link
    :to="`/${type}/${item.id}`"
    class="card"
    :class="{ 'card--poster': poster }"
    @mousemove="onMove"
    @click="onClick"
  >
    <div class="card__visual">
      <img
        v-lazy="poster
          ? getImageUrl(item.poster_path || item.backdrop_path, 'w500')
          : getImageUrl(item.backdrop_path || item.poster_path, 'w780')"
        :alt="item.title || item.name"
      >
      <span v-if="item.vote_average" class="chip chip--rating card__rating">
        <svg viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5L5.5 21l2-7.5L2 9h7z"/></svg>
        {{ Number(item.vote_average).toFixed(1) }}
      </span>
      <span v-if="showType" class="chip card__type">{{ type === 'tv' ? settings.t('serial') : settings.t('film') }}</span>
      <button
        type="button"
        class="card__fav"
        :class="{ 'is-active': isFav }"
        :aria-label="isFav ? settings.t('removeFromFavorites') : settings.t('addToFavorites')"
        :title="isFav ? settings.t('removeFromFavorites') : settings.t('addToFavorites')"
        @click.prevent.stop="favorites.toggleFavorite(item, type)"
      >
        <svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg>
      </button>
    </div>
    <div class="card__body">
      <h3 class="card__title">{{ item.title || item.name }}</h3>
      <p class="card__meta">{{ meta }}</p>
    </div>
    <span class="card__glare" aria-hidden="true"></span>
  </router-link>
</template>

<script setup>
import { computed } from "vue";
import { getImageUrl, getYear } from "@/apiUrl.js";
import { useFavorites } from "@/stores/favorites.js";
import { useSettings } from "@/stores/settings.js";

const props = defineProps({
  item: Object,
  type: String,
  poster: Boolean,
  showType: Boolean,
  preview: Boolean
});

const emit = defineEmits(['preview']);

const favorites = useFavorites();
const settings = useSettings();

const isFav = computed(() => favorites.isFavorite(props.type, props.item.id));

const meta = computed(() => {
  const parts = [];
  const y = getYear(props.item);
  if (y) parts.push(y);
  parts.push(props.type === 'tv' ? settings.t('serial') : settings.t('film'));
  if (props.item.original_language) parts.push(props.item.original_language);
  return parts.join(' · ');
});

const onMove = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`);
};

const onClick = (e) => {
  if (props.preview && window.innerWidth >= 800) {
    e.preventDefault();
    emit('preview', props.item);
  }
};
</script>
