<template>
  <main>
    <ErrorState v-if="error" @retry="fetchPerson" />
    <Loader v-else-if="loading" />
    <div v-else-if="person" class="page person">
      <div class="person__glow" aria-hidden="true"></div>
      <div class="person__bigtext" aria-hidden="true">{{ lastName }}</div>

      <div class="wrap">
        <div class="sector mono rise"><span>CAST</span><i></i><b>{{ person.known_for_department || settings.t('person') }}</b></div>

        <div class="person__grid">
          <div class="person__photo rise rise-2">
            <img :src="getImageUrl(person.profile_path, 'h632')" :alt="person.name">
            <span class="person__scan"></span>
          </div>

          <div class="person__content">
            <h1 class="person__name rise rise-2">{{ person.name }}</h1>

            <div class="pitwall person__facts rise rise-3" :style="{ '--cols': facts.length }" v-if="facts.length">
              <div class="pitwall__cell" v-for="f in facts" :key="f.name">
                <span class="mono">{{ f.name }}</span>
                <b>{{ f.text }}</b>
              </div>
            </div>

            <div class="person__bio rise rise-4">
              <p class="mono muted">{{ settings.t('biography') }}</p>
              <p class="person__bio-text" :class="{ 'is-open': bioOpen }">{{ person.biography || settings.t('noBiography') }}</p>
              <button
                v-if="person.biography && person.biography.length > 600"
                type="button"
                class="link-arrow"
                @click="bioOpen = !bioOpen"
              >
                <span>{{ bioOpen ? '−' : '+' }} {{ settings.t('getMore') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section v-if="credits.length" class="section person__credits">
        <div class="wrap">
          <div class="sector mono"><span>S1</span><i></i><b>{{ credits.length }} · {{ settings.t('knownFor') }}</b></div>
          <h2 class="h2 person__credits-title">{{ settings.t('knownFor') }}<em>.</em></h2>
          <div class="grid grid--poster">
            <CatalogItem
              v-for="item in credits"
              :key="`${item.media_type}-${item.id}`"
              :item="item"
              :type="item.media_type"
              poster
            />
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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
const bioOpen = ref(false)

const lastName = computed(() => {
  const parts = (person.value?.name || '').split(' ')
  return (parts[parts.length - 1] || '').toUpperCase()
})

const facts = computed(() => {
  const p = person.value
  if (!p) return []
  const list = []
  if (p.birthday) {
    list.push({
      name: settings.t('birthday'),
      text: new Date(p.birthday).toLocaleDateString(settings.lang, { day: 'numeric', month: 'long', year: 'numeric' })
    })
  }
  if (p.place_of_birth) list.push({ name: settings.t('placeOfBirth'), text: p.place_of_birth })
  if (credits.value.length) list.push({ name: settings.t('knownFor'), text: credits.value.length })
  return list
})

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
.person {
  position: relative;
  overflow: hidden;
  padding-bottom: 0;

  &__glow {
    position: absolute;
    width: 70vmax;
    height: 70vmax;
    left: -25vmax;
    top: -25vmax;
    z-index: -1;
    background: radial-gradient(closest-side, rgba(255, 42, 61, .18), rgba(43, 76, 255, .08) 55%, transparent);
    filter: blur(30px);
  }

  &__bigtext {
    position: absolute;
    top: 22%;
    right: -2%;
    z-index: -1;
    white-space: nowrap;
    font-family: var(--f-display);
    font-weight: 900;
    font-size: clamp(90px, 18vw, 300px);
    letter-spacing: -0.06em;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, .06);
    pointer-events: none;
  }

  &__grid {
    display: grid;
    grid-template-columns: minmax(240px, .7fr) 1.3fr;
    gap: clamp(32px, 6vw, 96px);
    align-items: start;
  }

  &__photo {
    position: sticky;
    top: calc(var(--nav-h) + 24px);
    aspect-ratio: 2/3;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--line-2);
    background: var(--bg-3);
    box-shadow: 0 40px 120px -30px rgba(255, 42, 61, .45);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__scan {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, rgba(255, 255, 255, .035) 0 1px, transparent 1px 4px);
    mix-blend-mode: overlay;
    pointer-events: none;
  }

  &__content {
    min-width: 0;
    display: grid;
    gap: clamp(28px, 4vw, 44px);
  }

  &__name {
    font-family: var(--f-display);
    font-weight: 900;
    font-size: clamp(40px, 6.4vw, 112px);
    line-height: .9;
    letter-spacing: -0.055em;
    margin-left: -0.03em;
    text-wrap: balance;
  }

  &__bio {
    display: grid;
    gap: 14px;
    justify-items: start;
  }

  &__bio-text {
    color: var(--text-2);
    font-size: clamp(15px, 1.2vw, 17px);
    max-width: 70ch;
    white-space: pre-line;
    display: -webkit-box;
    -webkit-line-clamp: 9;
    -webkit-box-orient: vertical;
    overflow: hidden;

    &.is-open {
      display: block;
      -webkit-line-clamp: unset;
    }
  }

  &__credits-title { margin-bottom: clamp(28px, 4vw, 44px); }
}

@media (max-width: 800px) {
  .person {
    &__grid { grid-template-columns: 1fr; }

    &__photo {
      position: relative;
      top: 0;
      width: min(100%, 300px);
    }

    .pitwall { grid-template-columns: 1fr; }
  }
}
</style>
