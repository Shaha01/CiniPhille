<template>
  <section class="section rec" v-if="rec && rec.length">
    <div class="wrap">
      <div class="sector mono"><span>S2</span><i></i><b>{{ settings.t('recommendations') }}</b></div>
    </div>
    <Rail>
      <template #head>
        <h2 class="h2">{{ settings.t('recommendations') }}<em>.</em></h2>
      </template>
      <CatalogItem
        v-for="item in rec"
        :key="item.id"
        :item="item"
        :type="type"
      />
    </Rail>
  </section>
</template>

<script setup>
import { useSettings } from '@/stores/settings.js'
import CatalogItem from '@/components/Catalog/CatalogItem.vue'
import Rail from '@/components/UI/Rail.vue'

const settings = useSettings()

defineProps({
  rec: Array,
  type: String
})
</script>

<style lang="scss" scoped>
.rec { padding-top: 0; }
</style>
