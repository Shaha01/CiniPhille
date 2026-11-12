<template>
  <section class="main__top">
    <h2 class="main__top-title">
      TOP
      <span>10</span>
    </h2>

    <swiper
        :autoplay="{
          delay: 2000,
          disableOnInteraction: false
        }"
        :breakpoints="breakpoints"
        :modules="modules"
        :navigation="true"
        :space-between="23"
        class="main__top-swiper">

      <swiper-slide
          class="main__top-swiper-item"
          v-for="(item, i) in topMovies"
          :key="item.id"
          @click="goToMovie(item.id)"
          style="cursor: pointer"
      >
        <div class="main__top-swiper-item-number">
          <span>{{ i + 1 }}</span>
        </div>
        <img
            v-lazy="getImageUrl(item.backdrop_path || item.poster_path)"
            :alt="item.title"
            class="main__top-swiper-item-img">
      </swiper-slide>
    </swiper>

  </section>
</template>

<script setup>
import { getImageUrl } from "@/apiUrl.js";
import './Top.scss';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { useTop } from "@/stores/top.js";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const topStore = useTop();
topStore.getTop();

const amount = ref(10);

const topMovies = computed(() => {
  if (topStore.top) {
    return topStore.top.slice(0, amount.value);
  }
  return [];
});

const goToMovie = (id) => {
  router.push(`/movie/${id}`);
};

const modules = ref([Navigation, Autoplay]);

const breakpoints = ref({
  320: { slidesPerView: 1 },
  576: { slidesPerView: 1 },
  900: { slidesPerView: 2 },
  1200: { slidesPerView: 2 },
  1400: { slidesPerView: 3 },
});
</script>
