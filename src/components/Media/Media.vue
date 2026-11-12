<template>
  <ErrorState v-if="itemStore.error" @retry="loadData" />
  <div class="main__media" v-else-if="item">
    <Intro :type="type" :item="item"/>
    <Info :type="type" :item="item"/>
    <Rec :type="type" :rec="rec"/>
  </div>
  <Loader v-else/>
</template>

<script setup>
import Intro from "@/components/Media/Intro.vue";
import '@/components/Media/Media.scss';
import { useItemId } from "@/stores/itemId.js";
import { useRoute } from 'vue-router';
import { computed, onBeforeMount, watch } from "vue";
import Loader from "@/components/UI/Loader.vue";
import ErrorState from "@/components/UI/ErrorState.vue";
import Info from "@/components/Media/Info.vue";
import Rec from "@/components/Media/Rec.vue";
import { useRec } from "@/stores/rec.js";

const route = useRoute();
const recStore = useRec();
const itemStore = useItemId();

const props = defineProps({
  type: String
});

const loadData = () => {
  itemStore.getItemId({ type: props.type, id: route.params.id });
  recStore.getRecom({ type: props.type, id: route.params.id });
};

loadData();

const item = computed(() =>
  props.type === 'movie'
    ? itemStore.movie
    : props.type === 'tv'
      ? itemStore.tv
      : ''
);

watch(item, (val) => {
  if (val && (val.title || val.name)) {
    document.title = `${val.title || val.name} — CiniPhile`;
  }
});

const rec = computed(() => {
  const array =
    props.type === 'movie'
      ? recStore.recomMovie
      : props.type === 'tv'
        ? recStore.recomTv
        : '';
  if (array) {
    return array.slice(0, 4);
  }
  return [];
});

onBeforeMount(() => {
  itemStore.movie = itemStore.tv = null;
});
</script>
