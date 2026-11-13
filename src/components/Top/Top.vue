<template>
  <section class="section top" v-if="topMovies.length">
    <div class="top__bigtext" aria-hidden="true">TOP 10</div>
    <div class="wrap">
      <div class="sector mono"><span>S3</span><i></i><b>{{ settings.t('topLabel') }} · TMDB</b></div>
    </div>
    <Rail col="clamp(260px, 26vw, 380px)">
      <template #head>
        <h2 class="h2" v-html="settings.t('topTitle')"></h2>
      </template>

      <router-link
        v-for="(item, i) in topMovies"
        :key="item.id"
        :to="`/movie/${item.id}`"
        class="top__item"
        :class="{ 'is-p1': i === 0 }"
      >
        <span class="top__num" aria-hidden="true">{{ i + 1 }}</span>
        <div class="top__poster">
          <img v-lazy="getImageUrl(item.poster_path || item.backdrop_path, 'w500')" :alt="item.title">
          <span class="chip chip--rating top__rating">★ {{ Number(item.vote_average).toFixed(1) }}</span>
        </div>
        <div class="top__info">
          <span class="mono">P{{ i + 1 }} · {{ getYear(item) }}</span>
          <b>{{ item.title }}</b>
        </div>
      </router-link>
    </Rail>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { getImageUrl, getYear } from "@/apiUrl.js";
import { useTop } from "@/stores/top.js";
import { useSettings } from "@/stores/settings.js";
import Rail from "@/components/UI/Rail.vue";

const settings = useSettings();
const topStore = useTop();
topStore.getTop();

const topMovies = computed(() => (topStore.top ? topStore.top.slice(0, 10) : []));
</script>

<style lang="scss" scoped>
.top {
  overflow: hidden;
  background: radial-gradient(ellipse at 80% 40%, rgba(13, 20, 64, .9), transparent 60%), var(--bg);

  &__bigtext {
    position: absolute;
    bottom: 2%;
    left: 0;
    white-space: nowrap;
    font-family: var(--f-display);
    font-weight: 900;
    font-size: clamp(90px, 20vw, 320px);
    letter-spacing: -0.06em;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, .05);
    pointer-events: none;
  }

  &__item {
    position: relative;
    display: grid;
    gap: 12px;
    padding-left: clamp(56px, 6vw, 84px);
  }

  &__num {
    position: absolute;
    left: 0;
    bottom: 56px;
    z-index: 2;
    font-family: var(--f-display);
    font-weight: 900;
    font-size: clamp(110px, 12vw, 180px);
    line-height: .78;
    letter-spacing: -0.08em;
    color: var(--bg);
    -webkit-text-stroke: 2px rgba(255, 255, 255, .55);
    transition: -webkit-text-stroke-color .4s, color .4s, text-shadow .4s;
  }

  &__item:hover &__num,
  &__item.is-p1 &__num {
    -webkit-text-stroke-color: var(--neon);
    text-shadow: 0 0 40px rgba(255, 42, 61, .45);
  }

  &__item.is-p1 &__num { color: var(--neon); }

  &__poster {
    position: relative;
    aspect-ratio: 2/3;
    border-radius: var(--radius);
    overflow: hidden;
    border: 1px solid var(--line);
    background: var(--bg-3);
    transition: border-color .4s, transform .5s var(--ease);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform .8s var(--ease);
    }
  }

  &__item:hover &__poster {
    border-color: rgba(255, 42, 61, .55);
    transform: translateY(-4px);

    img { transform: scale(1.05); }
  }

  &__rating {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  &__info {
    display: grid;
    gap: 4px;
    min-width: 0;

    span { color: var(--muted); font-size: 11px; }

    b {
      font-family: var(--f-display);
      font-weight: 700;
      font-size: 15px;
      letter-spacing: -0.02em;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
