<template>
  <div class="cast" v-if="actors && actors.length">
    <router-link
      v-for="actor in actors"
      :key="actor.id"
      :to="`/person/${actor.id}`"
      class="cast__item"
    >
      <img v-lazy="getImageUrl(actor.profile_path, 'w185')" :alt="actor.name">
      <span>
        {{ actor.name }}
        <small v-if="actor.character">{{ actor.character }}</small>
      </span>
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
