<template>
  <header class="nav" :class="{ 'is-scrolled': isScrolled, 'is-open': burger }">
    <router-link to="/" class="nav__logo" aria-label="CiniPhile" @click="burger = false">
      <span class="logo">
        <span class="logo__text">CINI<b>PHILE</b></span>
        <span class="logo__stripes" aria-hidden="true"><i></i><i></i><i></i></span>
      </span>
      <span class="nav__live"><i></i>ON AIR</span>
    </router-link>

    <nav class="nav__links">
      <router-link
        v-for="item in links"
        :key="item.url"
        :to="item.url"
        class="nav__link"
        :class="{ 'is-active': isActive(item.url) }"
        @click="burger = false"
      >
        <span>{{ item.name }}</span>
        <b v-if="item.badge !== undefined" class="nav__badge" :class="{ 'is-zero': !item.badge }">{{ item.badge }}</b>
      </router-link>
    </nav>

    <div class="nav__right">
      <router-link
        to="/search"
        class="nav__search"
        :class="{ 'is-active': route.path === '/search' }"
        :aria-label="settings.t('searchLabel')"
        @click="burger = false"
      >
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>
      </router-link>

      <div class="lang" role="group" aria-label="Language">
        <button
          v-for="l in langs"
          :key="l.code"
          type="button"
          :class="{ 'is-active': settings.lang === l.code }"
          @click="settings.setLang(l.code)"
        >{{ l.label }}</button>
        <span class="lang__pill" :style="{ transform: `translateX(${settings.lang === 'en-US' ? 100 : 0}%)` }"></span>
      </div>

      <button
        type="button"
        class="burger"
        aria-label="Menu"
        :aria-expanded="burger"
        @click="burger = !burger"
      ><span></span><span></span></button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSettings } from '@/stores/settings.js';
import { useFavorites } from '@/stores/favorites.js';

const route = useRoute();
const settings = useSettings();
const favorites = useFavorites();

const langs = [
  { code: 'ru-RU', label: 'RU' },
  { code: 'en-US', label: 'EN' }
];

const links = computed(() => [
  { name: settings.t('main'), url: '/' },
  { name: settings.t('films'), url: '/movie' },
  { name: settings.t('serials'), url: '/tv' },
  { name: settings.t('favorites'), url: '/favorites', badge: favorites.count || 0 }
]);

const isActive = (url) => {
  if (url === '/') return route.path === '/';
  return route.path === url || route.path.startsWith(`${url}/`);
};

const burger = ref(false);
const isScrolled = ref(false);

watch(burger, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

const onScroll = () => {
  const next = window.scrollY > 40;
  if (isScrolled.value !== next) isScrolled.value = next;
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  document.body.style.overflow = '';
});
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--nav-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 var(--gutter);
  border-bottom: 1px solid transparent;
  transition: background .4s, border-color .4s, backdrop-filter .4s;

  &.is-scrolled {
    background: rgba(5, 5, 6, .72);
    backdrop-filter: blur(16px) saturate(140%);
    -webkit-backdrop-filter: blur(16px) saturate(140%);
    border-bottom-color: var(--line);
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 2;
  }

  &__live {
    font-family: var(--f-mono);
    font-size: 10px;
    letter-spacing: .16em;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 6px;

    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--neon);
      box-shadow: 0 0 8px var(--neon);
      animation: blink 1.4s infinite;
    }
  }

  &__links {
    display: flex;
    gap: 4px;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 999px;
    color: var(--muted);
    transition: color .25s, background .25s, box-shadow .25s;

    &:hover {
      color: var(--text);
      background: rgba(255, 255, 255, .06);
    }

    &.is-active {
      color: var(--text);
      background: rgba(255, 255, 255, .06);
      box-shadow: inset 0 -2px 0 var(--neon);
    }
  }

  &__badge {
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    display: inline-grid;
    place-items: center;
    border-radius: 999px;
    background: var(--neon);
    color: #fff;
    font-family: var(--f-mono);
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
    box-shadow: 0 0 10px rgba(255, 42, 61, .5);

    &.is-zero {
      background: rgba(255, 255, 255, .08);
      color: var(--muted);
      box-shadow: none;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 2;
  }

  &__search {
    width: 40px;
    height: 36px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line-2);
    border-radius: 999px;
    background: rgba(255, 255, 255, .03);
    transition: border-color .3s, background .3s;

    svg {
      width: 17px;
      height: 17px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
    }

    &:hover, &.is-active {
      border-color: var(--neon);
      background: var(--neon-soft);
    }
  }
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px 7px 13px;
  border: 1px solid var(--line-2);
  border-radius: 10px;
  background: rgba(8, 8, 10, .6);
  transition: border-color .3s, box-shadow .3s;

  &__text {
    display: inline-block;
    font-family: var(--f-display);
    font-weight: 900;
    font-size: 16px;
    line-height: 1;
    letter-spacing: -0.02em;
    transform: skewX(-9deg);

    b {
      font-weight: 400;
      color: var(--muted);
    }
  }

  &__stripes {
    display: inline-flex;
    gap: 3px;

    i {
      width: 3px;
      height: 15px;
      border-radius: 1px;
      transform: skewX(-20deg);
      transition: transform .45s var(--ease);

      &:nth-child(1) { background: var(--neon); box-shadow: 0 0 6px var(--neon); }
      &:nth-child(2) { background: var(--yellow); transition-delay: .04s; }
      &:nth-child(3) { background: var(--blue); transition-delay: .08s; }
    }
  }
}

.nav__logo:hover .logo {
  border-color: var(--neon);
  box-shadow: 0 0 20px -4px rgba(255, 42, 61, .6);
}

.nav__logo:hover .logo__stripes i {
  transform: skewX(-20deg) translateX(4px) scaleY(1.15);
}

.lang {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 3px;
  border: 1px solid var(--line-2);
  border-radius: 999px;
  background: rgba(255, 255, 255, .03);

  button {
    position: relative;
    z-index: 1;
    font-family: var(--f-mono);
    font-size: 11px;
    font-weight: 600;
    padding: 6px 10px;
    border-radius: 999px;
    color: var(--muted);
    transition: color .25s;

    &.is-active { color: #fff; }
  }

  &__pill {
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 3px;
    width: calc(50% - 3px);
    border-radius: 999px;
    background: var(--neon);
    box-shadow: 0 0 16px rgba(255, 42, 61, .5);
    transition: transform .45s var(--ease);
  }
}

.burger {
  display: none;
  width: 42px;
  height: 42px;
  border: 1px solid var(--line-2);
  border-radius: 50%;
  position: relative;

  span {
    position: absolute;
    left: 12px;
    right: 12px;
    height: 1.5px;
    background: var(--text);
    transition: transform .4s var(--ease), top .4s var(--ease);

    &:nth-child(1) { top: 16px; }
    &:nth-child(2) { top: 24px; }
  }

  &[aria-expanded="true"] span:nth-child(1) { top: 20px; transform: rotate(45deg); }
  &[aria-expanded="true"] span:nth-child(2) { top: 20px; transform: rotate(-45deg); }
}

@media (max-width: 900px) {
  .burger { display: block; }
  .nav__live { display: none; }

  .nav__links {
    position: fixed;
    inset: 0;
    z-index: 1;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    padding: var(--nav-h) var(--gutter) 40px;
    background: rgba(5, 5, 6, .97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    opacity: 0;
    pointer-events: none;
    transition: opacity .4s var(--ease);
  }

  .nav.is-open .nav__links {
    opacity: 1;
    pointer-events: auto;
  }

  .nav__link {
    font-family: var(--f-display);
    font-weight: 800;
    font-size: clamp(32px, 9vw, 56px);
    letter-spacing: -0.04em;
    padding: 4px 0;
    border-radius: 0;
    background: none !important;
    box-shadow: none !important;
    color: var(--muted);
    transform: translateY(20px);
    transition: color .25s, transform .5s var(--ease);

    &.is-active { color: var(--text); }
    &.is-active span::after { content: "."; color: var(--neon); }
  }

  .nav.is-open .nav__link { transform: none; }

  .nav__badge {
    font-size: 13px;
    min-width: 28px;
    height: 28px;
  }
}

@media (max-width: 420px) {
  .logo__text b { display: none; }
}
</style>
