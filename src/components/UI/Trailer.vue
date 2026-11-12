<template>
  <button type="button" class="trailer" @click="openTrailer">
    <img src="@/assets/images/play.png" alt="svg" />
    <span class="trailer__text">
      {{ loading ? settings.t('loading') : settings.t('watchTrailer') }}
    </span>
  </button>

  <Teleport to="body">
    <div v-if="isOpen" class="trailer-modal" @click.self="closeTrailer">
      <div class="trailer-modal__content">
        <button type="button" class="trailer-modal__close" @click="closeTrailer">✕</button>
        <iframe
          v-if="videoKey"
          class="trailer-modal__iframe"
          :src="`https://www.youtube.com/embed/${videoKey}?autoplay=1`"
          title="Trailer"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <div v-else class="trailer-modal__empty">
          {{ settings.t('noTrailer') }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
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
  }
})

const settings = useSettings()
const isOpen = ref(false)
const loading = ref(false)
const videoKey = ref(null)

const pickTrailer = (videos) =>
  videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
  videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
  videos.find((v) => v.site === 'YouTube')

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
    isOpen.value = true
  } catch (error) {
    console.error('Error loading trailer:', error)
    isOpen.value = true
  } finally {
    loading.value = false
  }
}

const closeTrailer = () => {
  isOpen.value = false
  videoKey.value = null
}
</script>

<style lang="scss" scoped>
.trailer {
  border: none;
  cursor: pointer;
}

.trailer-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  &__content {
    position: relative;
    width: 100%;
    max-width: 900px;
    aspect-ratio: 16 / 9;
    background: #141414;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }

  &__iframe {
    width: 100%;
    height: 100%;
  }

  &__empty {
    color: #fff;
    font-family: 'Raleway', sans-serif;
    font-size: 18px;
    text-align: center;
    padding: 24px;
  }
}
</style>
