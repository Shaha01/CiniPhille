<template>
  <router-link :to="`/${type}/${id}`" class="btnmore">
    <img src="@/assets/images/more.svg" alt="svg" />
    <span class="btnmore__text">{{ settings.t('getMore') }}</span>
  </router-link>
</template>

<script setup>
import { useSettings } from '@/stores/settings.js'

const settings = useSettings()

defineProps({
  type: String,
  id: [Number, String]
})
</script>
