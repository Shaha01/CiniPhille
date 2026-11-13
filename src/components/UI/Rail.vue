<template>
  <div class="rail">
    <div class="wrap section__head rail__head">
      <slot name="head" />
      <div class="rail__ctl">
        <slot name="actions" />
        <div class="rail__nav">
          <button type="button" class="rbtn" :disabled="atStart" aria-label="Previous" @click="go(-1)">
            <svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          </button>
          <button type="button" class="rbtn" :disabled="atEnd" aria-label="Next" @click="go(1)">
            <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </div>
    <div
      ref="track"
      class="rail__track"
      :class="{ 'is-drag': dragging }"
      :style="{ '--col': col }"
      @scroll.passive="update"
      @pointerdown="onDown"
      @click.capture="onClickCapture"
    >
      <slot />
    </div>
    <div class="wrap rail__meter" aria-hidden="true"><i :style="{ transform: `scaleX(${ratio})` }"></i></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

defineProps({
  col: { type: String, default: 'clamp(240px, 24vw, 360px)' }
})

const track = ref(null)
const atStart = ref(true)
const atEnd = ref(false)
const ratio = ref(0)
const dragging = ref(false)

const update = () => {
  const el = track.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  atStart.value = el.scrollLeft <= 4
  atEnd.value = el.scrollLeft >= max - 4
  ratio.value = max > 0 ? Math.max(0.04, el.scrollLeft / max) : 1
}

const go = (dir) => {
  const el = track.value
  if (!el) return
  el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
}

/* mouse drag-to-scroll (touch uses native scrolling) */
let startX = 0
let startScroll = 0
let moved = 0

const onMove = (e) => {
  const dx = e.clientX - startX
  moved = Math.max(moved, Math.abs(dx))
  if (moved > 5) dragging.value = true
  track.value.scrollLeft = startScroll - dx
}

const onUp = () => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  setTimeout(() => { dragging.value = false }, 0)
}

const onDown = (e) => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return
  startX = e.clientX
  startScroll = track.value.scrollLeft
  moved = 0
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

const onClickCapture = (e) => {
  if (moved > 5) {
    e.preventDefault()
    e.stopPropagation()
    moved = 0
  }
}

onMounted(() => {
  nextTick(update)
  window.addEventListener('resize', update)
})

onUnmounted(() => {
  window.removeEventListener('resize', update)
  onUp()
})
</script>

<style lang="scss" scoped>
.rail {
  &__ctl {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__nav {
    display: flex;
    gap: 8px;
  }

  &__track {
    --pad: max(var(--gutter), calc((100vw - var(--wrap)) / 2 + var(--gutter)));
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: var(--col);
    gap: clamp(14px, 1.6vw, 22px);
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--pad);
    padding: 6px var(--pad) 18px;
    scrollbar-width: none;
    cursor: grab;
    user-select: none;

    &::-webkit-scrollbar { display: none; }

    > :deep(*) { scroll-snap-align: start; }

    &.is-drag {
      cursor: grabbing;
      scroll-snap-type: none;

      :deep(*) { pointer-events: none; }
    }

    :deep(img) { -webkit-user-drag: none; }
  }

  &__meter {
    position: relative;
    height: 2px;
    margin-top: 10px;

    &::before {
      content: "";
      position: absolute;
      inset: 0 var(--gutter);
      background: var(--line);
    }

    i {
      position: absolute;
      top: 0;
      bottom: 0;
      left: var(--gutter);
      right: var(--gutter);
      transform-origin: 0 50%;
      background: linear-gradient(90deg, var(--blue), var(--yellow), var(--neon));
      transition: transform .2s linear;
    }
  }
}

.rbtn:disabled {
  opacity: .3;
  pointer-events: none;
}

@media (max-width: 600px) {
  .rail__nav { display: none; }
}
</style>
