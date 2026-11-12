<template>
  <div class="wrapper">
    <Navbar />
    <RouterView :key="`${$route.fullPath}-${settings.lang}`" v-if="routerAlive" />
    <button
      v-show="showScrollTop"
      type="button"
      class="scroll-top-btn"
      aria-label="Scroll to top"
      @click="scrollToTop"
    >
      ↑
    </button>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar/Navbar.vue";
import { ref, provide, nextTick, onMounted, onUnmounted } from "vue";
import { useSettings } from "@/stores/settings.js";

const settings = useSettings();
const routerAlive = ref(true);
const showScrollTop = ref(false);

const reload = () => {
  routerAlive.value = false;
  nextTick(() => {
    routerAlive.value = true;
  });
};

const onScroll = () => {
  showScrollTop.value = window.scrollY > 500;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});

provide('reload', reload);
</script>

<style lang="scss" scoped>
.scroll-top-btn {
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 90;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  background: #149a03;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
  transition: transform 0.2s, opacity 0.2s;

  &:hover {
    transform: translateY(-3px);
  }
}
</style>
