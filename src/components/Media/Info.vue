<template>
  <section class="section info">
    <div class="wrap">
      <div class="sector mono"><span>S1</span><i></i><b>{{ settings.t('details') }}</b></div>
      <div class="pitwall" :style="{ '--cols': info.length }">
        <div class="pitwall__cell" v-for="row in info" :key="row.name">
          <span class="mono">{{ row.name }}</span>
          <b :class="{ 'is-accent': row.accent }">{{ row.text }}</b>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useSettings } from "@/stores/settings.js";

const props = defineProps({
  type: String,
  item: Object
});

const settings = useSettings();

const formatCurrency = (val) => {
  if (!val) return settings.t('unknown');
  return '$' + Number(val).toLocaleString('en-US');
};

const info = computed(() => {
  const unknown = settings.t('unknown');
  if (props.type === 'tv' || props.item?.number_of_seasons !== undefined) {
    return [
      { name: settings.t('seasons'), text: props.item?.number_of_seasons || unknown, accent: true },
      { name: settings.t('episodes'), text: props.item?.number_of_episodes || unknown },
      { name: settings.t('status'), text: props.item?.status || unknown },
      { name: settings.t('originalTitle'), text: props.item?.original_name || props.item?.original_title || unknown }
    ];
  }
  return [
    { name: settings.t('budget'), text: formatCurrency(props.item?.budget) },
    { name: settings.t('fees'), text: formatCurrency(props.item?.revenue), accent: true },
    { name: settings.t('status'), text: props.item?.status || unknown },
    { name: settings.t('originalTitle'), text: props.item?.original_title || props.item?.original_name || unknown }
  ];
});
</script>

<style lang="scss" scoped>
.info { padding-top: 0; }
.is-accent { color: var(--yellow); }
</style>
