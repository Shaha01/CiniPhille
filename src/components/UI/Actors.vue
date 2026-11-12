<template>
  <div class="actors" v-if="actors && actors.length">
    <router-link
      v-for="actor in actors"
      :key="actor.id"
      :to="`/person/${actor.id}`"
      class="actors__item"
    >
      <img v-lazy="getImageUrl(actor.profile_path, false)" :alt="actor.name">
      <span>{{ actor.name }}</span>
    </router-link>
  </div>
</template>

<script setup>
import { useActors } from "@/stores/actors.js";
import { computed, watch } from "vue";
import { getImageUrl } from "@/apiUrl.js";
import { useSettings } from "@/stores/settings.js";

const props = defineProps({
  type: String,
  id: [Number, String],
  count: [Number, String]
});

const actorsStore = useActors();
const settings = useSettings();

watch(
  () => [props.type, props.id, settings.lang],
  ([type, id]) => {
    if (type && id) {
      actorsStore.getActors({ type, id });
    }
  },
  { immediate: true }
);

const actors = computed(() => {
  const actorsArray =
    props.type === 'movie'
      ? actorsStore.actorsMovie
      : props.type === 'tv'
        ? actorsStore.actorsTv
        : null;
  if (actorsArray) {
    return actorsArray.slice(0, Number(props.count) || 4);
  }
  return [];
});
</script>

<style lang="scss" scoped>
  .actors {
    max-width: 450px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    &__item {
      background: rgba(20, 20, 20, 0.5);
      border: 1px solid #ffffff;
      border-radius: 25px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding-right: 15px;
      transition: border-color 0.2s, transform 0.2s;
      &:hover {
        border-color: #149a03;
        transform: translateY(-2px);
      }
      & img {
        width: 45px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
      }
      & span {
        font-size: 16px;
        line-height: 188%;
        font-family: 'Raleway';
        color: white;
      }
    }
  }
</style>
