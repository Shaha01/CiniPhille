<template>
  <main class="main not-found">
    <div class="not-found__box">
      <h1 class="not-found__code">404</h1>
      <h2 class="not-found__title">{{ settings.t('notFoundTitle') }}</h2>
      <p class="not-found__text">{{ settings.t('notFoundText') }}</p>
      <router-link to="/" class="not-found__btn">
        {{ settings.t('backHome') }}
      </router-link>
    </div>
  </main>
</template>

<script setup>
import { useSettings } from '@/stores/settings.js'

const settings = useSettings()
</script>

<style lang="scss" scoped>
.not-found {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  color: #fff;
  font-family: 'Raleway', sans-serif;

  &__code {
    font-size: 96px;
    color: #149a03;
    line-height: 1;
    margin-bottom: 12px;
  }

  &__title {
    font-size: 28px;
    margin-bottom: 10px;
  }

  &__text {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 28px;
    font-size: 16px;
  }

  &__btn {
    display: inline-block;
    background: #149a03;
    color: #fff;
    padding: 12px 28px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 16px;
  }
}
</style>

