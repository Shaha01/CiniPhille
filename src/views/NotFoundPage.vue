<template>
  <main class="page nf">
    <div class="wrap">
      <div class="sector mono rise"><span>DNF</span><i></i><b>{{ settings.t('notFoundTitle') }}</b></div>
      <h1 class="nf__code glitch rise rise-2" data-text="404">404</h1>
      <h2 class="h2 rise rise-3">{{ settings.t('notFoundTitle') }}<em>.</em></h2>
      <p class="lead rise rise-3">{{ settings.t('notFoundText') }}</p>
      <router-link to="/" class="btn btn--primary rise rise-4">
        <span>{{ settings.t('backHome') }}</span>
        <svg class="arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </router-link>
    </div>
  </main>
</template>

<script setup>
import { useSettings } from '@/stores/settings.js'

const settings = useSettings()
</script>

<style lang="scss" scoped>
.nf {
  display: flex;
  align-items: center;

  .lead { margin: 18px 0 32px; }

  &__code {
    position: relative;
    font-family: var(--f-display);
    font-weight: 900;
    font-size: clamp(120px, 26vw, 380px);
    line-height: .85;
    letter-spacing: -0.07em;
    margin-left: -0.05em;
    margin-bottom: 12px;
    color: transparent;
    -webkit-text-stroke: 2px var(--text);
  }
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  pointer-events: none;
  -webkit-text-stroke: 0;
}

.glitch::before {
  color: var(--neon);
  mix-blend-mode: screen;
  animation: glitch1 3.2s infinite steps(1);
}

.glitch::after {
  color: #00e5ff;
  mix-blend-mode: screen;
  animation: glitch2 3.2s infinite steps(1);
}

@keyframes glitch1 {
  0%, 80%, 100% { transform: none; clip-path: inset(0 0 100% 0); }
  82% { transform: translate(-8px, 2px); clip-path: inset(10% 0 60% 0); }
  86% { transform: translate(6px, -2px); clip-path: inset(55% 0 20% 0); }
  90% { transform: translate(-4px, 1px); clip-path: inset(30% 0 40% 0); }
}

@keyframes glitch2 {
  0%, 80%, 100% { transform: none; clip-path: inset(0 0 100% 0); }
  82% { transform: translate(8px, -2px); clip-path: inset(70% 0 5% 0); }
  86% { transform: translate(-6px, 2px); clip-path: inset(20% 0 65% 0); }
  90% { transform: translate(4px, 0); clip-path: inset(45% 0 30% 0); }
}
</style>
