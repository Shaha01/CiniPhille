<template>
  <section class="main__video" v-if="content">

    <router-link :to="`/${type}`" class="main__video-title">
      {{ props.type === 'movie' ? settings.t('films') : props.type === 'tv' ? settings.t('serials') : '' }}
      <img :src="arrowIcon" alt="png">
    </router-link>

    <swiper
        :autoplay="{
          delay: 2000,
          disableOnInteraction: false
        }"
        :breakpoints="breakpoints"
        :modules="modules"
        :navigation="true"
        :space-between="25"
        class="main__video-swiper">

      <swiper-slide
          v-for="item in content"
          :key="item.id"
          class="main__video-swiper-item"
          @click="getItem(item)"
      >
        <img
            v-lazy="getImageUrl(item.backdrop_path || item.poster_path)"
            alt="photo"
            class="main__video-swiper-item-img"
        />
        <span v-if="item.vote_average" class="swiper-rating">
          ★ {{ Number(item.vote_average).toFixed(1) }}
        </span>
        <h2 class="main__video-swiper-item-title">{{ item.title || item.name }}</h2>
      </swiper-slide>
      <swiper-slide class="main__video-swiper-item">

        <router-link :to="`/${type}`" class="main__video-swiper-item-page">
          <img :src="arrowIcon" alt="svg">
          {{ props.type === 'movie' ? settings.t('allFilms') : props.type === 'tv' ? settings.t('allSerials') : '' }}
        </router-link>

      </swiper-slide>
    </swiper>
    <InfoBox
      :current="current"
      :open="open"
      :type="type"
      @close="close"
    />

  </section>
  <Loader v-else-if="!popularStore.error"/>
</template>

<script setup>
import './Mat.scss';
import { getImageUrl } from "@/apiUrl.js";
import arrowIcon from '@/assets/images/arrow.png';
import { usePopular } from "@/stores/popular.js";
import { useSettings } from "@/stores/settings.js";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import InfoBox from "@/components/InfoBox/InfoBox.vue";
import Loader from "@/components/UI/Loader.vue";
import { useItemId } from "@/stores/itemId.js";

const props = defineProps({
  type: String
});

const router = useRouter();
const settings = useSettings();
const popularStore = usePopular();
popularStore.getPopular({ type: props.type });

const content = computed(() =>
  props.type === 'movie'
    ? popularStore.popularMovies
    : props.type === 'tv'
      ? popularStore.popularTvs
      : ''
);

const modules = ref([Navigation, Autoplay]);

const breakpoints = ref({
  320: { slidesPerView: 1 },
  576: { slidesPerView: 2 },
  900: { slidesPerView: 3 },
  1200: { slidesPerView: 4 },
  1400: { slidesPerView: 5 },
});

const itemIdStore = useItemId();
const current = ref(null);
const open = ref(false);
const disableClick = ref(false);

const getItem = async (item) => {
  if (disableClick.value) {
    router.push(`/${props.type}/${item.id}`);
    return;
  }
  current.value = null;
  await itemIdStore.getItemId({ type: props.type, id: item.id });
  current.value =
    props.type === 'movie'
      ? itemIdStore.movie
      : props.type === 'tv'
        ? itemIdStore.tv
        : '';
  open.value = true;
};

const close = () => {
  open.value = false;
};

const checkSize = () => {
  const screenWidthThreshold = 800;
  disableClick.value = window.innerWidth < screenWidthThreshold;
};

onMounted(() => {
  window.addEventListener('resize', checkSize);
  checkSize();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkSize);
});
</script>

<style lang="scss" scoped>
.swiper-rating {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  background: rgba(20, 154, 3, 0.92);
  color: #fff;
  padding: 3px 9px;
  border-radius: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
}
</style>
