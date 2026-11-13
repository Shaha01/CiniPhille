<template>
  <CatalogItem :item="item" :type="item.media_type" show-type />
</template>

<script setup>
import CatalogItem from '@/components/Catalog/CatalogItem.vue'

defineProps({
  item: Object
})
</script>
