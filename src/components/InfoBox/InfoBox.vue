<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open && current" class="modal" @click.self="$emit('close')">
        <button type="button" class="modal__close" :aria-label="settings.t('close')" @click="$emit('close')">
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>

        <div class="modal__panel infobox">
          <div class="infobox__visual">
            <img :src="getImageUrl(current.backdrop_path || current.poster_path, 'w1280')" :alt="current.title || current.name">
            <div class="infobox__chips">
              <span v-if="current.vote_average" class="chip chip--rating">★ {{ Number(current.vote_average).toFixed(1) }}</span>
              <span v-if="year" class="chip">{{ year }}</span>
              <span v-if="time" class="chip">{{ time }}</span>
            </div>
          </div>

          <div class="infobox__body">
            <div class="sector mono"><span>{{ type === 'tv' ? 'TV' : 'FILM' }}</span><i></i><b>{{ settings.t('details') }}</b></div>
            <h2 class="h3 infobox__title">{{ current.title || current.name }}</h2>
            <p v-if="genres" class="mono muted infobox__genres">{{ genres }}</p>
            <p class="infobox__text">{{ current.overview || settings.t('noDescription') }}</p>
            <Actors :type="type" :id="current.id" :count="4" />
            <div class="infobox__actions">
              <BtnMore :type="type" :id="current.id" />
              <Trailer :type="type" :id="current.id" />
              <button
                type="button"
                class="btn btn--ghost"
                :class="{ 'is-active': favorites.isFavorite(type, current.id) }"
                @click="favorites.toggleFavorite(current, type)"
              >
                <svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg>
                <span>{{ favorites.isFavorite(type, current.id) ? settings.t('removeFromFavorites') : settings.t('addToFavorites') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onUnmounted } from "vue";
import { getImageUrl, getYear, formatRuntime } from "@/apiUrl.js";
import Actors from "@/components/UI/Actors.vue";
import BtnMore from "@/components/UI/BtnMore.vue";
import { useSettings } from "@/stores/settings.js";
import { useFavorites } from "@/stores/favorites.js";

const props = defineProps({
  current: Object,
  open: Boolean,
  type: String
});

const emit = defineEmits(['close']);

const settings = useSettings();
const favorites = useFavorites();

const year = computed(() => getYear(props.current));

const genres = computed(() => {
  if (!props.current?.genres?.length) return '';
  return props.current.genres.map((g) => g.name).join(' · ');
});

const time = computed(() =>
  formatRuntime(props.type === 'movie' ? props.current?.runtime : props.current?.episode_run_time?.[0])
);

const onKey = (e) => {
  if (e.key === 'Escape') emit('close');
};

watch(() => props.open, (o) => {
  if (o) window.addEventListener('keydown', onKey);
  else window.removeEventListener('keydown', onKey);
});

onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<style lang="scss" scoped>
.infobox {
  width: min(100%, 1100px);
  max-height: calc(100svh - 40px);
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  border: 1px solid var(--line-2);
  border-radius: 24px;
  background: var(--bg-2);
  overflow: hidden;
  box-shadow: 0 40px 120px -30px rgba(255, 42, 61, .45);

  &__visual {
    position: relative;
    min-height: 100%;
    background: var(--bg-3);

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent 50%, var(--bg-2)), linear-gradient(0deg, rgba(5, 5, 6, .7), transparent 40%);
    }
  }

  &__chips {
    position: absolute;
    left: 18px;
    bottom: 18px;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__body {
    padding: clamp(24px, 3vw, 40px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .sector { margin-bottom: 4px; }
  }

  &__genres { font-size: 11px; }

  &__text {
    color: var(--text-2);
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 8px;
  }
}

@media (max-width: 900px) {
  .infobox {
    grid-template-columns: 1fr;
    overflow-y: auto;

    &__visual { aspect-ratio: 16/9; }
  }
}
</style>
