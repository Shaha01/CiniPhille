<template>
  <div class="grain" aria-hidden="true"></div>
  <div class="progress" aria-hidden="true"><span :style="{ transform: `scaleX(${progress})` }"></span></div>

  <Navbar />
  <RouterView :key="`${$route.fullPath}-${settings.lang}`" v-if="routerAlive" />

  <footer class="footer">
    <div class="footer__checker" aria-hidden="true"></div>
    <div class="wrap footer__inner">
      <div class="footer__brand">
        <span class="footer__logo">CINIPHILE</span>
        <p class="mono muted">{{ settings.t('footerMade') }}</p>
      </div>
      <nav class="footer__links">
        <router-link to="/movie">{{ settings.t('films') }}</router-link>
        <router-link to="/tv">{{ settings.t('serials') }}</router-link>
        <router-link to="/favorites">{{ settings.t('favorites') }}</router-link>
        <router-link to="/search">{{ settings.t('searchLabel') }}</router-link>
      </nav>
    </div>
    <div class="wrap footer__bottom mono">
      <span>© {{ year }} CiniPhile</span>
      <a href="https://www.themoviedb.org/" target="_blank" rel="noopener">{{ settings.t('footerData') }}</a>
      <button type="button" class="footer__top" @click="scrollToTop">{{ settings.t('toTop') }} ↑</button>
    </div>
  </footer>

  <button
    type="button"
    class="to-top"
    :class="{ 'is-visible': showScrollTop }"
    :aria-label="settings.t('toTop')"
    @click="scrollToTop"
  >
    <svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
  </button>
</template>

<script setup>
import Navbar from "@/components/Navbar/Navbar.vue";
import { ref, provide, nextTick, onMounted, onUnmounted } from "vue";
import { useSettings } from "@/stores/settings.js";

const settings = useSettings();
const routerAlive = ref(true);
const showScrollTop = ref(false);
const progress = ref(0);
const year = new Date().getFullYear();

const reload = () => {
  routerAlive.value = false;
  nextTick(() => {
    routerAlive.value = true;
  });
};

let raf = 0;
const onScroll = () => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    showScrollTop.value = window.scrollY > 700;
  });
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  cancelAnimationFrame(raf);
});

provide('reload', reload);
</script>

<style lang="scss" scoped>
.footer {
  position: relative;
  margin-top: clamp(40px, 6vw, 80px);
  border-top: 1px solid var(--line);
  background: var(--bg-2);
  overflow: hidden;

  &__checker {
    height: 14px;
    background: conic-gradient(#fff 0 25%, #000 0 50%, #fff 0 75%, #000 0);
    background-size: 14px 14px;
    opacity: .08;
  }

  &__inner {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 28px;
    padding-top: clamp(40px, 6vw, 72px);
    padding-bottom: clamp(32px, 4vw, 48px);
  }

  &__logo {
    display: block;
    font-family: var(--f-display);
    font-weight: 900;
    font-size: clamp(44px, 9vw, 140px);
    line-height: .85;
    letter-spacing: -0.06em;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, .25);
    margin-bottom: 14px;
    transition: color .5s var(--ease), -webkit-text-stroke-color .5s;
  }

  &__brand:hover &__logo {
    color: var(--neon);
    -webkit-text-stroke-color: var(--neon);
    text-shadow: 0 0 50px rgba(255, 42, 61, .45);
  }

  &__links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    a {
      padding: 10px 16px;
      border: 1px solid var(--line-2);
      border-radius: 999px;
      font-size: 14px;
      font-weight: 600;
      transition: border-color .3s, background .3s;

      &:hover {
        border-color: var(--neon);
        background: var(--neon-soft);
      }
    }
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px 24px;
    padding-top: 20px;
    padding-bottom: 28px;
    border-top: 1px solid var(--line);
    color: var(--muted);

    a:hover, button:hover { color: var(--text); }
  }

  &__top {
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: inherit;
  }
}

.to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 95;
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--neon);
  color: #fff;
  box-shadow: 0 0 0 6px rgba(255, 42, 61, .14), 0 12px 40px -10px rgba(255, 42, 61, .8);
  opacity: 0;
  transform: translateY(16px) scale(.9);
  pointer-events: none;
  transition: opacity .35s, transform .45s var(--ease);

  svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
  }

  &.is-visible {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }

  &:hover {
    transform: translateY(-3px);
  }
}
</style>
