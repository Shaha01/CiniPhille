<template>
  <div class="state wrap">
    <div class="state__box rise">
      <span class="mono err-flag"><i></i>RED FLAG</span>
      <h3 class="h3">{{ settings.t('errorTitle') }}</h3>
      <p>{{ settings.t('errorHint') }}</p>
      <button type="button" class="btn btn--primary" @click="$emit('retry')">
        <span>{{ settings.t('retry') }}</span>
        <svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useSettings } from '@/stores/settings.js'

defineEmits(['retry'])
const settings = useSettings()
</script>

<style lang="scss" scoped>
.state { padding-top: calc(var(--nav-h) + 40px); }

.err-flag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--neon);

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--neon);
    box-shadow: 0 0 10px var(--neon);
    animation: blink 1s infinite;
  }
}
</style>
