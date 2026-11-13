<template>
  <main>
    <Upcoming />
    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        <template v-for="n in 2" :key="n">
          <span>CINEMA</span><b>✦</b><span>SERIALS</span><b>✦</b><span>TRAILERS</span><b>✦</b><span>TOP 10</span><b>✦</b><span>PREMIERES</span><b>✦</b><span>NO SPOILERS</span><b>✦</b>
        </template>
      </div>
    </div>
    <Movies />
    <Tvs />
    <Top />
  </main>
</template>

<script setup>
import Upcoming from '@/components/Upcoming/Upcoming.vue'
import Movies from '@/components/MAT/Movies.vue'
import Tvs from '@/components/MAT/Tvs.vue'
import Top from '@/components/Top/Top.vue'
</script>
