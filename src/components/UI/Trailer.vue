<template>
  <button type="button" class="btn" :class="primary ? 'btn--primary' : 'btn--ghost'" :disabled="loading" @click="openTrailer">
    <svg class="fill" viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg>
    <span>{{ loading ? settings.t('loading') : settings.t('watchTrailer') }}</span>
  </button>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal" @click.self="closeTrailer">
        <button type="button" class="modal__close" :aria-label="settings.t('close')" @click="closeTrailer">
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <div class="modal__panel trailer">
          <div class="trailer__screen">
            <iframe
              v-if="videoKey"
              :src="`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`"
              title="Trailer"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <div v-else class="trailer__empty">
              <b class="h3">NO SIGNAL</b>
              <p class="muted">{{ settings.t('noTrailer') }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import axios from 'axios'
import { apiKey } from '@/apiUrl.js'
import { useSettings } from '@/stores/settings.js'

const props = defineProps({
  type: {
    type: String,
    default: 'movie'
  },
  id: {
    type: [Number, String],
    default: null
  },
  primary: Boolean
})

const settings = useSettings()
const isOpen = ref(false)
const loading = ref(false)
const videoKey = ref(null)

const pickTrailer = (videos) =>
  videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
  videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
  videos.find((v) => v.site === 'YouTube')

const onKey = (e) => {
  if (e.key === 'Escape') closeTrailer()
}

const openTrailer = async () => {
  if (!props.id || loading.value) return
  loading.value = true
  videoKey.value = null
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${props.type}/${props.id}/videos?api_key=${apiKey}&language=${settings.lang}`
    )
    let trailer = pickTrailer(res.data?.results || [])
    if (!trailer && settings.lang !== 'en-US') {
      const fallbackRes = await axios.get(
        `https://api.themoviedb.org/3/${props.type}/${props.id}/videos?api_key=${apiKey}&language=en-US`
      )
      trailer = pickTrailer(fallbackRes.data?.results || [])
    }
    videoKey.value = trailer ? trailer.key : null
  } catch (error) {
    console.error('Error loading trailer:', error)
  } finally {
    loading.value = false
    isOpen.value = true
    window.addEventListener('keydown', onKey)
  }
}

const closeTrailer = () => {
  isOpen.value = false
  videoKey.value = null
  window.removeEventListener('keydown', onKey)
}

onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style lang="scss" scoped>
.btn:disabled { opacity: .7; cursor: progress; }

.trailer {
  width: min(100%, 1100px);
  border: 1px solid var(--line-2);
  border-radius: var(--radius);
  background: var(--bg-2);
  overflow: hidden;
  box-shadow: 0 40px 120px -30px rgba(255, 42, 61, .45);

  &__screen {
    aspect-ratio: 16 / 9;
    background: #000;
    display: grid;
    place-items: center;

    iframe { width: 100%; height: 100%; }
  }

  &__empty {
    display: grid;
    gap: 10px;
    text-align: center;
    padding: 24px;
  }
}
</style>
