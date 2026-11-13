<template>
  <main class="page favs">
    <div class="wrap">
      <div class="sector mono rise"><span>BOX</span><i></i><b>{{ settings.t('favorites') }}</b></div>

      <div class="section__head">
        <h1 class="h1 rise rise-2">{{ settings.t('favorites') }}<em>.</em></h1>
        <div class="favs__side rise rise-3">
          <p class="mono muted"><b class="favs__count">{{ filteredItems.length }}</b> {{ settings.t('saved') }}</p>
          <div class="tabs" v-if="favorites.items.length">
            <button
              v-for="t in tabs"
              :key="t.value"
              type="button"
              :class="{ 'is-active': filterType === t.value }"
              @click="filterType = t.value"
            >{{ t.label }}</button>
          </div>
        </div>
      </div>

      <TransitionGroup v-if="filteredItems.length" name="list" tag="div" class="grid">
        <CatalogItem
          v-for="item in filteredItems"
          :key="`${item.media_type}-${item.id}`"
          :item="item"
          :type="item.media_type"
          show-type
        />
      </TransitionGroup>

      <div v-else class="state">
        <div class="state__box rise">
          <span class="mono muted">PIT LANE · EMPTY</span>
          <h3 class="h3">{{ settings.t('favorites') }}: 0</h3>
          <p>{{ settings.t('emptyFavorites') }}</p>
          <router-link to="/movie" class="btn btn--primary">
            <span>{{ settings.t('allFilms') }}</span>
            <svg class="arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
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

const tabs = computed(() => [
  { value: 'all', label: settings.t('all') },
  { value: 'movie', label: settings.t('films') },
  { value: 'tv', label: settings.t('serials') }
])

const filteredItems = computed(() => {
  if (filterType.value === 'all') return favorites.items
  return favorites.items.filter((i) => i.media_type === filterType.value)
})
</script>

<style lang="scss" scoped>
.favs {
  &__side {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
  }

  &__count {
    color: var(--neon);
    font-family: var(--f-display);
    font-size: 16px;
  }

  .state { min-height: 40vh; place-items: start; }
}

.list-enter-active, .list-leave-active { transition: opacity .4s var(--ease), transform .4s var(--ease); }
.list-enter-from, .list-leave-to { opacity: 0; transform: scale(.94); }
.list-move { transition: transform .5s var(--ease); }
</style>
