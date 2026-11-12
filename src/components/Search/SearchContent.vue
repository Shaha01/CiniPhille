<template>
  <router-link :to="`/${item.media_type}/${item.id}`" class="main__search-list-item search-card">
    <img v-lazy="getImageUrl(item.backdrop_path || item.poster_path)" alt="photo" class="main__search-list-item-img" />
    <span v-if="item.vote_average" class="search-card__rating">
      ★ {{ Number(item.vote_average).toFixed(1) }}
    </span>
    <button
      type="button"
      class="search-card__fav"
      :class="{ active: favorites.isFavorite(item.media_type, item.id) }"
      @click.prevent.stop="favorites.toggleFavorite(item, item.media_type)"
    >
      {{ favorites.isFavorite(item.media_type, item.id) ? '♥' : '♡' }}
    </button>
    <h2 class="main__search-list-item-title">{{ item.name || item.title }}</h2>
  </router-link>
</template>

<script setup>
import { getImageUrl } from '@/apiUrl.js'
import { useFavorites } from '@/stores/favorites.js'

const favorites = useFavorites()

defineProps({
  item: Object
})
</script>

<style lang="scss" scoped>
.search-card {
  position: relative;

  &__rating {
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

  &__fav {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.35);
    background: rgba(20, 20, 20, 0.75);
    color: #fff;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &.active,
    &:hover {
      background: #e50914;
      border-color: #e50914;
    }
  }
}
</style>
