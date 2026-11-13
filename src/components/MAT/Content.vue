<template>
  <section class="section" v-if="content && content.length">
    <div class="wrap">
      <div class="sector mono"><span>{{ sector }}</span><i></i><b>{{ settings.t('popularNow') }}</b></div>
    </div>
    <Rail>
      <template #head>
        <h2 class="h2" v-html="type === 'movie' ? settings.t('popularFilms') : settings.t('popularSerials')"></h2>
      </template>
      <template #actions>
        <router-link :to="`/${type}`" class="link-arrow">
          <span>{{ type === 'movie' ? settings.t('allFilms') : settings.t('allSerials') }}</span>
          <svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>
        </router-link>
      </template>

      <CatalogItem
        v-for="item in content"
        :key="item.id"
        :item="item"
        :type="type"
        preview
        @preview="getItem"
      />
      <router-link :to="`/${type}`" class="rail__all">
        <span class="mono muted">{{ settings.t('viewAll') }}</span>
        <b>{{ type === 'movie' ? settings.t('allFilms') : settings.t('allSerials') }}</b>
        <svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>
      </router-link>
    </Rail>

    <InfoBox :current="current" :open="open" :type="type" @close="close" />
  </section>
  <Loader v-else-if="!popularStore.error" />
</template>

<script setup>
import { computed, ref } from "vue";
import { usePopular } from "@/stores/popular.js";
import { useSettings } from "@/stores/settings.js";
import { useItemId } from "@/stores/itemId.js";
import CatalogItem from "@/components/Catalog/CatalogItem.vue";
import InfoBox from "@/components/InfoBox/InfoBox.vue";
import Rail from "@/components/UI/Rail.vue";
import Loader from "@/components/UI/Loader.vue";

const props = defineProps({
  type: String,
  sector: { type: String, default: 'S1' }
});

const settings = useSettings();
const popularStore = usePopular();
popularStore.getPopular({ type: props.type });

const content = computed(() =>
  props.type === 'movie' ? popularStore.popularMovies : popularStore.popularTvs
);

const itemIdStore = useItemId();
const current = ref(null);
const open = ref(false);

const getItem = async (item) => {
  current.value = item;
  open.value = true;
  await itemIdStore.getItemId({ type: props.type, id: item.id });
  const full = props.type === 'movie' ? itemIdStore.movie : itemIdStore.tv;
  if (open.value && full && full.id === item.id) current.value = full;
};

const close = () => {
  open.value = false;
};
</script>
