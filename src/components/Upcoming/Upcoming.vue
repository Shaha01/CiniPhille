<template>
  <ErrorState v-if="upcomingStore.error" @retry="upcomingStore.getUpcoming" />
  <section
    v-else-if="movies.length && movie"
    class="hero"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <div class="hero__bg" aria-hidden="true">
      <Transition name="fade">
        <img
          :key="movie.id"
          class="hero__backdrop"
          :src="getImageUrl(movie.backdrop_path || movie.poster_path, 'w1280')"
          alt=""
        >
      </Transition>
      <div class="hero__shade"></div>
      <div class="hero__glow"></div>
      <div class="hero__grid"></div>
    </div>

    <div class="hero__inner wrap">
      <Transition name="swap" mode="out-in">
        <div class="hero__text" :key="movie.id">
          <p class="hero__kicker mono">
            <span class="hero__live"><i></i>{{ settings.t('comingSoon') }}</span>
            <span class="muted">{{ pad(active + 1) }} / {{ pad(movies.length) }}</span>
          </p>
          <h1 class="hero__title">{{ movie.title || movie.original_title }}</h1>
          <p class="hero__text-body">{{ movie.overview || settings.t('noDescription') }}</p>
          <div class="hero__ctas">
            <BtnMoreName type="movie" :id="movie.id" />
            <Trailer type="movie" :id="movie.id" />
            <button
              type="button"
              class="btn btn--ghost hero__fav"
              :class="{ 'is-active': favorites.isFavorite('movie', movie.id) }"
              :aria-label="settings.t('addToFavorites')"
              @click="favorites.toggleFavorite(movie, 'movie')"
            >
              <svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg>
            </button>
          </div>
        </div>
      </Transition>

      <div class="hero__visual">
        <Transition name="swap" mode="out-in">
          <router-link :to="`/movie/${movie.id}`" class="hero__poster" :key="movie.id">
            <img :src="getImageUrl(movie.poster_path || movie.backdrop_path, 'w780')" :alt="movie.title">
            <span class="hero__scan"></span>
          </router-link>
        </Transition>
        <div class="hero__tag mono"><span>P{{ active + 1 }}</span>{{ shortTitle }}<em>#{{ year }}</em></div>

        <button type="button" class="hero__next" @click="nextSlide">
          <img :src="getImageUrl(nextMovie.backdrop_path || nextMovie.poster_path, 'w300')" alt="">
          <span>
            <small class="mono">{{ settings.t('next') }} →</small>
            <b>{{ nextMovie.title || nextMovie.original_title }}</b>
          </span>
        </button>
      </div>
    </div>

    <div class="telemetry wrap mono">
      <div class="telemetry__item"><span>{{ settings.t('release') }}</span><b>{{ releaseDate }}</b></div>
      <div class="telemetry__item"><span>{{ settings.t('rating') }}</span><b class="is-y">{{ movie.vote_average ? Number(movie.vote_average).toFixed(1) : '—' }}</b></div>
      <div class="telemetry__item"><span>{{ settings.t('votes') }}</span><b>{{ movie.vote_count || 0 }}</b></div>
      <div class="telemetry__item"><span>{{ settings.t('language') }}</span><b>{{ (movie.original_language || '—').toUpperCase() }}</b></div>
      <div class="telemetry__ctl">
        <button type="button" class="rbtn" aria-label="Previous" @click="prevSlide">
          <svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
        </button>
        <div class="telemetry__lap">
          <i :key="lap" :class="{ 'is-paused': paused }" :style="{ animationDuration: `${DELAY}ms` }"></i>
        </div>
        <button type="button" class="rbtn" aria-label="Next" @click="nextSlide">
          <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>
    </div>
  </section>
  <Loader v-else />
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from "vue";
import { useUpcoming } from "@/stores/upcoming.js";
import { useSettings } from "@/stores/settings.js";
import { useFavorites } from "@/stores/favorites.js";
import { getImageUrl, getYear } from "@/apiUrl.js";
import Loader from "@/components/UI/Loader.vue";
import ErrorState from "@/components/UI/ErrorState.vue";

const DELAY = 7000;

const upcomingStore = useUpcoming();
const settings = useSettings();
const favorites = useFavorites();
upcomingStore.getUpcoming();

const movies = computed(() => (upcomingStore.upcoming || []).filter((m) => m.backdrop_path || m.poster_path));
const active = ref(0);
const paused = ref(false);
const lap = ref(0);

const movie = computed(() => movies.value[active.value]);
const nextMovie = computed(() => movies.value[(active.value + 1) % movies.value.length] || {});
const year = computed(() => getYear(movie.value));
const shortTitle = computed(() => {
  const t = (movie.value?.title || movie.value?.original_title || '').toUpperCase();
  return t.length > 18 ? `${t.slice(0, 17)}…` : t;
});
const releaseDate = computed(() => {
  const d = movie.value?.release_date;
  if (!d) return '—';
  return new Date(d).toLocaleDateString(settings.lang, { day: '2-digit', month: 'short', year: 'numeric' });
});

const pad = (n) => String(n).padStart(2, '0');

let timer = null;

const schedule = () => {
  clearTimeout(timer);
  lap.value++;
  timer = setTimeout(nextSlide, DELAY);
};

function nextSlide() {
  if (!movies.value.length) return;
  active.value = (active.value + 1) % movies.value.length;
  schedule();
}

function prevSlide() {
  if (!movies.value.length) return;
  active.value = (active.value - 1 + movies.value.length) % movies.value.length;
  schedule();
}

// hovering the hero holds the slide; leaving restarts the lap (the bar restarts too)
watch(paused, (p) => {
  if (p) clearTimeout(timer);
  else schedule();
});

watch(() => movies.value.length, (len) => {
  if (len) schedule();
}, { immediate: true });

onUnmounted(() => clearTimeout(timer));
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: min(100svh, 1000px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: calc(var(--nav-h) + 30px) 0 28px;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: -1;
  }

  &__backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(.85) brightness(.55);
    transform: scale(1.06);
  }

  &__shade {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, var(--bg) 8%, rgba(5, 5, 6, .82) 45%, rgba(5, 5, 6, .35) 100%),
      linear-gradient(0deg, var(--bg) 2%, transparent 40%),
      linear-gradient(180deg, rgba(5, 5, 6, .8), transparent 25%);
  }

  &__glow {
    position: absolute;
    width: 70vmax;
    height: 70vmax;
    right: -20vmax;
    top: -15vmax;
    background: radial-gradient(closest-side, rgba(255, 42, 61, .22), rgba(43, 76, 255, .08) 55%, transparent);
    filter: blur(30px);
  }

  &__grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: radial-gradient(ellipse at 60% 40%, #000 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at 60% 40%, #000 0%, transparent 70%);
    opacity: .5;
  }

  &__inner {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: clamp(32px, 5vw, 96px);
    flex: 1;
  }

  &__text {
    min-width: 0;
  }

  &__kicker {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px 18px;
    margin-bottom: 22px;

    &::before {
      content: "";
      width: 28px;
      height: 1px;
      background: var(--neon);
    }
  }

  &__live {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 10px;
    border: 1px solid rgba(255, 212, 0, .35);
    border-radius: 999px;
    color: var(--yellow);
    font-size: 11px;

    i {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--yellow);
      box-shadow: 0 0 8px var(--yellow);
      animation: blink 1.4s infinite;
    }
  }

  &__title {
    font-family: var(--f-display);
    font-weight: 900;
    font-size: clamp(36px, 5.8vw, 104px);
    line-height: .92;
    letter-spacing: -0.05em;
    margin-left: -0.03em;
    text-wrap: balance;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    padding-bottom: .06em;
  }

  &__text-body {
    max-width: 58ch;
    margin: 26px 0 34px;
    color: var(--text-2);
    font-size: clamp(15px, 1.25vw, 18px);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__fav {
    padding: 15px;

    svg { width: 20px; height: 20px; }
    &.is-active svg { fill: var(--neon); }
  }

  &__visual {
    position: relative;
    width: min(28vw, 440px, (100svh - 260px) * 0.6);
    min-width: 240px;
  }

  &__poster {
    position: relative;
    display: block;
    aspect-ratio: 2/3;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--line-2);
    box-shadow: 0 40px 120px -30px rgba(255, 42, 61, .5);
    background: var(--bg-3);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1s var(--ease);
    }

    &:hover img { transform: scale(1.04); }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 55%, rgba(5, 5, 6, .85));
      pointer-events: none;
    }
  }

  &__scan {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: repeating-linear-gradient(0deg, rgba(255, 255, 255, .035) 0 1px, transparent 1px 4px);
    pointer-events: none;
    mix-blend-mode: overlay;
  }

  &__tag {
    position: absolute;
    left: -22px;
    bottom: 96px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: calc(100% + 10px);
    padding: 10px 16px 10px 10px;
    background: rgba(10, 10, 12, .85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--line-2);
    border-left: 3px solid var(--neon);
    border-radius: 8px;
    font-weight: 600;
    font-size: 12px;
    white-space: nowrap;

    span {
      background: var(--yellow);
      color: #000;
      padding: 2px 6px;
      border-radius: 3px;
    }

    em { color: var(--muted); }
  }

  &__next {
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 14px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    text-align: left;
    border: 1px solid var(--line-2);
    border-radius: 14px;
    background: rgba(5, 5, 6, .7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: border-color .3s;

    img {
      width: 72px;
      aspect-ratio: 16/10;
      object-fit: cover;
      border-radius: 8px;
      flex: none;
    }

    span {
      display: grid;
      min-width: 0;
    }

    small {
      color: var(--neon);
      font-size: 10px;
    }

    b {
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:hover { border-color: var(--neon); }
  }
}

.telemetry {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  margin-top: 44px;
  border-top: 1px solid var(--line);

  &__item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 18px 28px 0 0;
    margin-right: 28px;
    border-right: 1px solid var(--line);

    span {
      color: var(--muted);
      font-size: 10px;
    }

    b {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);

      &.is-y { color: var(--yellow); }
    }
  }

  &__ctl {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 16px;
  }

  &__lap {
    position: relative;
    width: clamp(80px, 12vw, 180px);
    height: 2px;
    background: var(--line-2);
    overflow: hidden;

    i {
      position: absolute;
      inset: 0;
      transform-origin: 0 50%;
      background: linear-gradient(90deg, var(--blue), var(--yellow), var(--neon));
      box-shadow: 0 0 10px var(--neon);
      animation: lap linear forwards;

      &.is-paused { animation-play-state: paused; }
    }
  }
}

@keyframes lap {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 1.2s var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.swap-enter-active { transition: opacity .6s var(--ease), transform .7s var(--ease); }
.swap-leave-active { transition: opacity .3s, transform .3s; }
.swap-enter-from { opacity: 0; transform: translateY(24px); }
.swap-leave-to { opacity: 0; transform: translateY(-12px); }

@media (max-width: 900px) {
  .hero {
    min-height: auto;
    padding-top: calc(var(--nav-h) + 24px);

    &__inner {
      grid-template-columns: 1fr;
    }

    &__visual {
      order: -1;
      width: min(100%, 300px);
      min-width: 0;
      justify-self: start;
    }

    &__shade {
      background:
        linear-gradient(0deg, var(--bg) 5%, rgba(5, 5, 6, .75) 60%, rgba(5, 5, 6, .55)),
        linear-gradient(180deg, rgba(5, 5, 6, .8), transparent 25%);
    }

    &__tag { left: auto; right: -10px; bottom: auto; top: 18px; }
  }

  .telemetry {
    margin-top: 32px;

    &__item {
      padding-right: 18px;
      margin-right: 18px;
      margin-bottom: 4px;
    }

    &__ctl {
      width: 100%;
      margin-left: 0;
    }

    &__lap { flex: 1; }
  }
}

@media (max-width: 520px) {
  .telemetry__item:nth-child(3) { display: none; }
}
</style>
