import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'ciniphile_favorites'

export const useFavorites = defineStore('favorites', () => {
  const loadInitial = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  const items = ref(loadInitial())

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    } catch (e) {
      console.error('Failed to save favorites:', e)
    }
  }

  const isFavorite = (type, id) => {
    return items.value.some((i) => i.media_type === type && Number(i.id) === Number(id))
  }

  const toggleFavorite = (item, type) => {
    if (!item || !item.id) return
    const mediaType = type || item.media_type || 'movie'
    const idx = items.value.findIndex(
      (i) => i.media_type === mediaType && Number(i.id) === Number(item.id)
    )
    if (idx !== -1) {
      items.value.splice(idx, 1)
    } else {
      items.value.unshift({
        id: item.id,
        media_type: mediaType,
        title: item.title || item.name,
        name: item.name || item.title,
        backdrop_path: item.backdrop_path || null,
        poster_path: item.poster_path || null,
        vote_average: item.vote_average || 0,
        release_date: item.release_date || item.first_air_date || ''
      })
    }
    save()
  }

  const count = computed(() => items.value.length)

  return {
    items,
    count,
    isFavorite,
    toggleFavorite
  }
})

