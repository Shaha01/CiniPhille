<template>
  <Transition name="upcoming">
    <div class="main__upcoming-item" v-if="activeItem == i">
      <img :src="getImageUrl(movie.backdrop_path || movie.poster_path)" alt="jpg" class="main__upcoming-item-img">
      <div class="main__upcoming-item-content">
        <h1 class="main__upcoming-item-content-title">
          {{ movie.title || movie.original_title }}
        </h1>
        <p class="main__upcoming-item-content-text">
          {{ movie.overview || settings.t('noDescription') }}
        </p>
        <BtnMoreName type="movie" :id="movie.id"/>
      </div>

      <div class="main__upcoming-item-next" @click="$emit('nextSlide')">
        <img :src="getImageUrl(nextMovie.backdrop_path || nextMovie.poster_path)" alt="jpg" class="main__upcoming-item-next-img">
        <div class="main__upcoming-item-next-info">
          <span>{{ settings.t('next') }}</span>
          <h2>{{ nextMovie.title || nextMovie.original_title }}</h2>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { getImageUrl } from "@/apiUrl.js";
import { useSettings } from "@/stores/settings.js";

const settings = useSettings();

defineProps({
  movie: {
    type: Object
  },
  i: {
    type: Number
  },
  activeItem: {
    type: Number
  },
  nextMovie: {
    type: Object
  }
});
</script>

<style src="./Upcoming.scss">
</style>
