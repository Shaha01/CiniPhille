<template>
  <main class="main">
    <div class="main__catalog favorites-page">
      <div class="container">
        <div class="favorites-page__header">
          <h2 class="main__catalog-title">
            {{ settings.t('favorites') }} ({{ filteredItems.length }})
          </h2>
          <div class="favorites-page__tabs" v-if="favorites.items.length">
            <button
              type="button"
              class="favorites-page__tab"
              :class="{ active: filterType === 'all' }"
              @click="filterType = 'all'"
            >
              {{ settings.t('all') }}
            </button>
            <button
              type="button"
              class="favorites-page__tab"
              :class="{ active: filterType === 'movie' }"
              @click="filterType = 'movie'"
            >
              {{ settings.t('films') }}
            </button>
            <button
              type="button"
              class="favorites-page__tab"
              :class="{ active: filterType === 'tv' }"
              @click="filterType = 'tv'"
            >
              {{ settings.t('serials') }}
            </button>
          </div>
        </div>

        <div class="main__catalog-list" v-if="filteredItems.length">
          <CatalogItem
            v-for="item in filteredItems"
            :key="`${item.media_type}-${item.id}`"
            :item="item"
            :type="item.media_type"
          />
        </div>

        <div v-else class="favorites-page__empty">
          <p>{{ settings.t('emptyFavorites') }}</p>
          <router-link to="/movie" class="favorites-page__btn">
            {{ settings.t('allFilms') }}
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFavorites } from '@/stores/favorites.js'
import { useSettings } from '@/stores/settings.js'
import CatalogItem from '@/components/Catalog/CatalogItem.vue'

const favorites = useFavorites()
const settings = useSettings()
const filterType = ref('all')

const filteredItems = computed(() => {
  if (filterType.value === 'all') return favorites.items
  return favorites.items.filter((i) => i.media_type === filterType.value)
})
</script>

<style lang="scss" scoped>
.favorites-page {
  min-height: 75vh;

  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 10px;
  }

  &__tabs {
    display: flex;
    gap: 10px;
  }

  &__tab {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 8px 18px;
    font-family: 'Raleway', sans-serif;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;

    &.active,
    &:hover {
      background: #149a03;
      border-color: #149a03;
    }
  }

  &__empty {
    margin-top: 60px;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-family: 'Raleway', sans-serif;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  &__btn {
    background: #149a03;
    color: #fff;
    padding: 12px 28px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 16px;
  }
}
</style>

