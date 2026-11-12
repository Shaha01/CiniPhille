<template>
  <ErrorState v-if="upcomingStore.error" @retry="upcomingStore.getUpcoming" />
  <div class="main__upcoming" v-else-if="upcomingMovies && upcomingMovies.length">
    <UpcomingItem
      v-for="(movie, i) in upcomingMovies"
      :key="movie.id"
      :movie="movie"
      :i="i"
      :activeItem="activeItem"
      :nextMovie="upcomingMovies[i + 1] || upcomingMovies[0]"
      @nextSlide="nextSlide"
    />
  </div>
  <Loader v-else/>
</template>

<script setup>
import UpcomingItem from "@/components/Upcoming/UpcomingItem.vue";
import { useUpcoming } from "@/stores/upcoming.js";
import { computed, ref, onMounted, onUnmounted } from "vue";
import Loader from "@/components/UI/Loader.vue";
import ErrorState from "@/components/UI/ErrorState.vue";

const upcomingStore = useUpcoming();
upcomingStore.getUpcoming();

const upcomingMovies = computed(() => upcomingStore.upcoming);

const activeItem = ref(0);
let timeout = null;

const next = () => {
  if (upcomingMovies.value?.length) {
    if (upcomingMovies.value.length - 1 === activeItem.value) {
      activeItem.value = 0;
    } else {
      activeItem.value++;
    }
  }
  timeout = setTimeout(() => next(), 5000);
};

const nextSlide = () => {
  clearTimeout(timeout);
  next();
};

onMounted(() => {
  timeout = setTimeout(() => next(), 5000);
});

onUnmounted(() => {
  clearTimeout(timeout);
});
</script>

<style src="./Upcoming.scss">
</style>
