<template>
  <main class="main">
    <ErrorState v-if="error" @retry="fetchPerson" />
    <Loader v-else-if="loading" />
    <div v-else-if="person" class="person-page container">
      <div class="person-page__profile">
        <img
          v-lazy="getImageUrl(person.profile_path, false)"
          :alt="person.name"
          class="person-page__photo"
        />
        <div class="person-page__details">
          <h1 class="person-page__name">{{ person.name }}</h1>
          <div class="person-page__meta">
            <span v-if="person.birthday">
              <strong>{{ settings.t('birthday') }}:</strong> {{ person.birthday }}
            </span>
            <span v-if="person.place_of_birth">
              <strong>{{ settings.t('placeOfBirth') }}:</strong> {{ person.place_of_birth }}
            </span>
          </div>
          <h3 class="person-page__subtitle">{{ settings.t('biography') }}</h3>
          <p class="person-page__bio">
            {{ person.biography || settings.t('noBiography') }}
          </p>
        </div>
      </div>

      <div v-if="credits.length" class="person-page__credits">
        <h2 class="main__catalog-title">{{ settings.t('knownFor') }}</h2>
        <div class="main__catalog-list">
          <CatalogItem
            v-for="item in credits"
            :key="`${item.media_type}-${item.id}`"
            :item="item"
            :type="item.media_type"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { apiKey, getImageUrl } from '@/apiUrl.js'
import { useSettings } from '@/stores/settings.js'
import CatalogItem from '@/components/Catalog/CatalogItem.vue'
import Loader from '@/components/UI/Loader.vue'
import ErrorState from '@/components/UI/ErrorState.vue'

const route = useRoute()
const settings = useSettings()

const person = ref(null)
const credits = ref([])
const loading = ref(true)
const error = ref(false)

const fetchPerson = async () => {
  const id = route.params.id
  if (!id) return
  loading.value = true
  error.value = false
  try {
    const [personRes, creditsRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=${settings.lang}`),
      axios.get(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}&language=${settings.lang}`)
    ])
    person.value = personRes.data
    document.title = `${person.value.name} — CiniPhile`

    const cast = creditsRes.data?.cast || []
    const seen = new Set()
    credits.value = cast
      .filter((item) => {
        if (item.media_type !== 'movie' && item.media_type !== 'tv') return false
        const key = `${item.media_type}-${item.id}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 24)
  } catch (e) {
    console.error('Error loading person:', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

watch(
  () => [route.params.id, settings.lang],
  () => fetchPerson(),
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.person-page {
  padding-top: 120px;
  padding-bottom: 60px;
  color: #fff;
  font-family: 'Raleway', sans-serif;

  &__profile {
    display: flex;
    gap: 36px;
    align-items: flex-start;
    margin-bottom: 50px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }

  &__photo {
    width: 260px;
    height: 380px;
    object-fit: cover;
    border-radius: 14px;
    flex-shrink: 0;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  &__details {
    flex: 1;
  }

  &__name {
    font-size: 36px;
    margin-bottom: 14px;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    color: rgba(255, 255, 255, 0.75);
    font-size: 15px;
    margin-bottom: 24px;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  &__subtitle {
    font-size: 20px;
    margin-bottom: 10px;
  }

  &__bio {
    font-size: 16px;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.85);
    max-height: 320px;
    overflow-y: auto;
    white-space: pre-line;
  }
}
</style>

