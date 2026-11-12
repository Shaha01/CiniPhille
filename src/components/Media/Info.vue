<template>
  <div class="main__info">
    <div class="main__info-item" v-for="item in info" :key="item.name">
      <span class="main__info-item-name">{{ item.name }}</span>
      <span class="main__info-item-text">{{ item.text }}</span>
    </div>
  </div>
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
  if (props.type === 'tv' || props.item?.number_of_seasons !== undefined) {
    return [
      {
        name: settings.t('seasons'),
        text: props.item?.number_of_seasons || settings.t('unknown')
      },
      {
        name: settings.t('episodes'),
        text: props.item?.number_of_episodes || settings.t('unknown')
      },
      {
        name: settings.t('status'),
        text: props.item?.status || settings.t('unknown')
      },
      {
        name: settings.t('originalTitle'),
        text: props.item?.original_name || props.item?.original_title || settings.t('unknown')
      }
    ];
  }
  return [
    {
      name: settings.t('budget'),
      text: formatCurrency(props.item?.budget)
    },
    {
      name: settings.t('fees'),
      text: formatCurrency(props.item?.revenue)
    },
    {
      name: settings.t('status'),
      text: props.item?.status || settings.t('unknown')
    },
    {
      name: settings.t('originalTitle'),
      text: props.item?.original_title || props.item?.original_name || settings.t('unknown')
    }
  ];
});
</script>
