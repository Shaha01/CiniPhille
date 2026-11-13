<template>
  <router-link :to="`/${type}/${id}`" class="btn" :class="ghost ? 'btn--ghost' : 'btn--primary'">
    <span>{{ settings.t('getMore') }}</span>
    <svg class="arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  </router-link>
</template>

<script setup>
import { useSettings } from '@/stores/settings.js'

const settings = useSettings()

defineProps({
  type: String,
  id: [Number, String],
  ghost: Boolean
})
</script>
