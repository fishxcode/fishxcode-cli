<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
let onScroll: (() => void) | null = null

onMounted(() => {
  onScroll = () => { visible.value = window.scrollY > 300 }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll)
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition name="fade-up">
    <button v-show="visible" class="back-to-top" aria-label="Back to top" @click="scrollToTop">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 3L2 9l1.5 1.5L8 6l4.5 4.5L14 9z" fill="currentColor"/>
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 99;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: var(--vp-c-brand-3);
  color: var(--vp-c-white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, background-color 0.2s;
}

.back-to-top:hover {
  transform: scale(1.1);
  background-color: var(--vp-c-brand-2);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
