<template>
  <Media type="movie"/>
</template>

<script setup>

import Media from "@/components/Media/Media.vue";
import { onBeforeRouteUpdate } from "vue-router";
import { inject } from "vue";

const reload = inject('reload')

onBeforeRouteUpdate((to, from) => {
  reload()
});
</script>
