<template>
  <div class="nav" :class="{active: isScrolled}">
    <div class="container">
      <div class="nav__container">
        <router-link to="/" class="logo">
          <img :src="Logo" alt="svg">
        </router-link>
        <button class="nav__menu" @click="burger = true">
          <img :src="menuIcon" alt="svg">
        </button>
        <ul class="nav__container-list" :class="{active: burger}">
          <button class="nav__close" @click="burger = false">
            <img :src="closeIcon" alt="svg">
          </button>

          <li v-for="item in links" :key="item.url">
            <router-link @click="burger = false" :to="item.url" class="nav__container-list-link">
              {{ item.name }}
              <span v-if="item.badge" class="nav__badge">{{ item.badge }}</span>
            </router-link>
          </li>

          <li>
            <router-link @click="burger = false" to="/search" class="nav__container-list-link">
              <img :src="searchIcon" alt="svg">
            </router-link>
          </li>

          <li>
            <button type="button" class="nav__lang-btn" @click="settings.toggleLang">
              {{ settings.langShort }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import menuIcon from "@/assets/images/menu.svg";
import closeIcon from "@/assets/images/close.svg";
import Logo from '@/assets/images/Logo.svg';
import searchIcon from '@/assets/images/search.svg';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSettings } from '@/stores/settings.js';
import { useFavorites } from '@/stores/favorites.js';

const settings = useSettings();
const favorites = useFavorites();

const links = computed(() => [
  { name: settings.t('main'), url: '/' },
  { name: settings.t('films'), url: '/movie' },
  { name: settings.t('serials'), url: '/tv' },
  { name: settings.t('favorites'), url: '/favorites', badge: favorites.count || 0 }
]);

const burger = ref(false);
const isScrolled = ref(false);

const onScroll = () => {
  const next = window.scrollY > 150;
  if (isScrolled.value !== next) {
    isScrolled.value = next;
  }
};

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style src="./Navbar.scss"></style>
<style lang="scss" scoped>
.nav__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  margin-left: 6px;
  border-radius: 10px;
  background: #149a03;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.nav__lang-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  padding: 5px 10px;
  font-family: 'Raleway', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    background: #149a03;
    border-color: #149a03;
  }
}
</style>
