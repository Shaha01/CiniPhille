<template>
  <div class="main__rec" v-if="rec && rec.length">
    <div class="container">
      <h2 class="main__rec-title">{{ settings.t('recommendations') }}</h2>
      <div class="main__rec-list">
        <router-link
          v-for="item in rec"
          :key="item.id"
          :to="`/${type}/${item.id}`"
          class="main__rec-list-item"
        >
          <img
            v-lazy="getImageUrl(item.backdrop_path || item.poster_path)"
            alt=""
            class="main__rec-list-item-img"
          />
          <span v-if="item.vote_average" class="rec-rating">
            ★ {{ Number(item.vote_average).toFixed(1) }}
          </span>
          <h2 class="main__rec-list-item-title">{{ item.name || item.title }}</h2>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getImageUrl } from '@/apiUrl.js'
import { useSettings } from '@/stores/settings.js'

const settings = useSettings()

defineProps({
  rec: Array,
  type: String
})
</script>

<style lang="scss" scoped>
.main__rec-list-item {
  position: relative;
}

.rec-rating {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  background: rgba(20, 154, 3, 0.92);
  color: #fff;
  padding: 3px 9px;
  border-radius: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
}
</style>
