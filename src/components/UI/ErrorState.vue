<template>
  <div class="error-state">
    <div class="error-state__box">
      <h3 class="error-state__title">{{ settings.t('errorTitle') }}</h3>
      <p class="error-state__hint">{{ settings.t('errorHint') }}</p>
      <button type="button" class="error-state__btn" @click="$emit('retry')">
        {{ settings.t('retry') }}
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
.error-state {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;

  &__box {
    max-width: 520px;
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    color: #fff;
    font-family: 'Raleway', sans-serif;
  }

  &__title {
    font-size: 22px;
    margin-bottom: 12px;
  }

  &__hint {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.5;
    margin-bottom: 24px;
  }

  &__btn {
    background: #149a03;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 12px 28px;
    font-size: 16px;
    font-family: 'Raleway', sans-serif;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.85;
    }
  }
}
</style>

