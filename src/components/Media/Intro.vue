<template>
  <section class="intro">
    <div class="intro__bg" aria-hidden="true">
      <img :src="getImageUrl(item.backdrop_path || item.poster_path, 'w1280')" alt="">
      <div class="intro__shade"></div>
      <div class="intro__grid"></div>
    </div>

    <div class="wrap intro__inner">
      <div class="intro__text">
        <div class="sector mono rise"><span>{{ type === 'tv' ? 'TV' : 'FILM' }}</span><i></i><b>{{ genres || settings.t('details') }}</b></div>
        <h1 class="intro__title rise rise-2">{{ item.title || item.name }}</h1>
        <p v-if="item.tagline" class="intro__tagline rise rise-2">{{ item.tagline }}</p>

        <div class="intro__chips rise rise-3">
          <span v-if="item.vote_average" class="chip chip--rating">★ {{ Number(item.vote_average).toFixed(1) }}</span>
          <span v-if="year" class="chip">{{ year }}</span>
          <span v-if="time" class="chip">{{ time }}</span>
          <span v-if="item.vote_count" class="chip">{{ settings.t('votes') }} <b>{{ item.vote_count }}</b></span>
          <span v-if="item.original_language" class="chip">{{ item.original_language }}</span>
        </div>

        <p class="intro__overview rise rise-3">{{ item.overview || settings.t('noDescription') }}</p>

        <div class="intro__actions rise rise-4">
          <Trailer :type="type" :id="item.id" primary />
          <button
            type="button"
            class="btn btn--ghost"
            :class="{ 'is-active': favorites.isFavorite(type, item.id) }"
            @click="favorites.toggleFavorite(item, type)"
          >
            <svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg>
            <span>{{ favorites.isFavorite(type, item.id) ? settings.t('removeFromFavorites') : settings.t('addToFavorites') }}</span>
          </button>
        </div>

        <div class="intro__cast rise rise-4">
          <p class="mono muted">{{ settings.t('inMainRoles') }}</p>
          <Actors :type="type" :id="item.id" :count="6" />
        </div>
      </div>

      <div class="intro__visual rise rise-2">
        <div class="intro__poster">
          <img :src="getImageUrl(item.poster_path || item.backdrop_path, 'w780')" :alt="item.title || item.name">
          <span class="intro__scan"></span>
        </div>
        <div class="intro__tag mono"><span>{{ item.vote_average ? Number(item.vote_average).toFixed(1) : '—' }}</span>{{ statusLabel }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { getImageUrl, getYear, formatRuntime } from "@/apiUrl.js";
import Actors from "@/components/UI/Actors.vue";
import { useSettings } from "@/stores/settings.js";
import { useFavorites } from "@/stores/favorites.js";

const props = defineProps({
  type: String,
  item: Object
});

const settings = useSettings();
const favorites = useFavorites();

const year = computed(() => getYear(props.item));

const genres = computed(() => {
  if (!props.item?.genres?.length) return '';
  return props.item.genres.slice(0, 3).map((g) => g.name).join(' · ');
});

const time = computed(() =>
  formatRuntime(props.type === 'movie' ? props.item?.runtime : props.item?.episode_run_time?.[0])
);

const statusLabel = computed(() => (props.item?.status || 'TMDB').toUpperCase());
</script>

<style lang="scss" scoped>
.intro {
  position: relative;
  min-height: min(100svh, 1000px);
  display: flex;
  align-items: center;
  padding: calc(var(--nav-h) + 40px) 0 clamp(48px, 6vw, 80px);
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: -1;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(.85) brightness(.5);
      transform: scale(1.05);
    }
  }

  &__shade {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, var(--bg) 10%, rgba(5, 5, 6, .85) 50%, rgba(5, 5, 6, .4) 100%),
      linear-gradient(0deg, var(--bg) 3%, transparent 45%),
      linear-gradient(180deg, rgba(5, 5, 6, .85), transparent 25%);
  }

  &__grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: radial-gradient(ellipse at 70% 40%, #000 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at 70% 40%, #000 0%, transparent 70%);
    opacity: .45;
  }

  &__inner {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: clamp(32px, 5vw, 96px);
    align-items: center;
  }

  &__text { min-width: 0; }

  &__title {
    font-family: var(--f-display);
    font-weight: 900;
    font-size: clamp(36px, 5.6vw, 100px);
    line-height: .92;
    letter-spacing: -0.05em;
    margin-left: -0.03em;
    text-wrap: balance;
    padding-bottom: .06em;
  }

  &__tagline {
    font-family: var(--f-display);
    font-weight: 600;
    font-size: clamp(16px, 1.6vw, 22px);
    color: var(--neon);
    letter-spacing: -0.01em;
    margin-top: 14px;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 26px;
  }

  &__overview {
    max-width: 62ch;
    margin: 24px 0 32px;
    color: var(--text-2);
    font-size: clamp(15px, 1.25vw, 18px);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__cast {
    display: grid;
    gap: 14px;
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid var(--line);
  }

  &__visual {
    position: relative;
    width: min(30vw, 440px);
    min-width: 260px;
  }

  &__poster {
    position: relative;
    aspect-ratio: 2/3;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--line-2);
    background: var(--bg-3);
    box-shadow: 0 40px 120px -30px rgba(255, 42, 61, .5);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__scan {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, rgba(255, 255, 255, .035) 0 1px, transparent 1px 4px);
    mix-blend-mode: overlay;
    pointer-events: none;
  }

  &__tag {
    position: absolute;
    left: -22px;
    bottom: 36px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px 10px 10px;
    background: rgba(10, 10, 12, .85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--line-2);
    border-left: 3px solid var(--neon);
    border-radius: 8px;
    font-weight: 600;
    font-size: 12px;

    span {
      background: var(--yellow);
      color: #000;
      padding: 2px 6px;
      border-radius: 3px;
    }
  }
}

@media (max-width: 900px) {
  .intro {
    min-height: auto;

    &__inner { grid-template-columns: 1fr; }

    &__visual {
      order: -1;
      width: min(100%, 280px);
      min-width: 0;
    }

    &__tag { left: auto; right: -10px; }

    &__shade {
      background:
        linear-gradient(0deg, var(--bg) 5%, rgba(5, 5, 6, .8) 60%, rgba(5, 5, 6, .55)),
        linear-gradient(180deg, rgba(5, 5, 6, .8), transparent 25%);
    }
  }
}
</style>
