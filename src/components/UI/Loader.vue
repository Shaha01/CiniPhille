<template>
  <div class="lights" role="status" :aria-label="settings.t('loading')">
    <div class="lights__rig">
      <div v-for="n in 5" :key="n" class="lights__col" :style="{ '--i': n - 1 }"><i></i><i></i></div>
    </div>
    <p class="mono lights__text">{{ settings.t('loading') }}</p>
  </div>
</template>

<script setup>
import { useSettings } from '@/stores/settings.js'

const settings = useSettings()
</script>

<style lang="scss" scoped>
.lights {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 120px 16px 60px;

  &__rig {
    position: relative;
    display: flex;
    gap: clamp(6px, 1.4vw, 12px);
    padding: 10px clamp(8px, 1.4vw, 12px) 12px;
    background: #0d0d10;
    border: 1px solid var(--line);
    border-radius: 12px;

    &::before {
      content: "";
      position: absolute;
      top: -10px;
      left: 10%;
      right: 10%;
      height: 6px;
      background: #1a1a1f;
      border-radius: 4px;
    }
  }

  &__col {
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding: 7px;
    background: #000;
    border-radius: 8px;

    i {
      width: clamp(20px, 4vw, 30px);
      aspect-ratio: 1;
      border-radius: 50%;
      background: #1a0508;
      box-shadow: inset 0 -3px 8px rgba(0, 0, 0, .8);
    }

    i:nth-child(2) {
      animation: light 2.4s infinite;
      animation-delay: calc(var(--i) * .3s);
    }
  }

  &__text {
    color: var(--muted);
    animation: blink 1.4s infinite;
  }
}

@keyframes light {
  0% { background: #1a0508; box-shadow: inset 0 -3px 8px rgba(0, 0, 0, .8); }
  8%, 70% {
    background: radial-gradient(circle at 40% 35%, #ff8a94, var(--neon) 45%, #9e0012);
    box-shadow: 0 0 18px var(--neon), 0 0 40px rgba(255, 42, 61, .55);
  }
  78%, 100% { background: #1a0508; box-shadow: inset 0 -3px 8px rgba(0, 0, 0, .8); }
}
</style>
