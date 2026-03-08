<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const currentPath = ref('/')

function updatePath() {
  currentPath.value = window.location.pathname
}

onMounted(updatePath)
watch(() => route.path, updatePath)

const i18n = {
  'zh-CN': { title: '页面未找到', subtitle: '你访问的页面不存在', link: '返回首页', home: '/' },
  'en-US': { title: 'Page not found', subtitle: 'The page you are looking for does not exist', link: 'Back to Home', home: '/en/' },
  'fr-FR': { title: 'Page introuvable', subtitle: 'La page que vous recherchez n\'existe pas', link: 'Retour à l\'accueil', home: '/fr/' },
  'es-ES': { title: 'Página no encontrada', subtitle: 'La página que buscas no existe', link: 'Volver al inicio', home: '/es/' },
  'pt-BR': { title: 'Página não encontrada', subtitle: 'A página que você procura não existe', link: 'Voltar ao início', home: '/pt/' },
}

const prefixMap: Record<string, string> = {
  '/en/': 'en-US',
  '/fr/': 'fr-FR',
  '/es/': 'es-ES',
  '/pt/': 'pt-BR',
}

const locale = computed(() => {
  const path = currentPath.value
  for (const [prefix, lang] of Object.entries(prefixMap)) {
    if (path.startsWith(prefix)) return lang
  }
  return 'zh-CN'
})

const t = computed(() => i18n[locale.value as keyof typeof i18n])
</script>

<template>
  <div class="not-found">
    <p class="code">404</p>
    <h1 class="title">{{ t.title }}</h1>
    <p class="subtitle">{{ t.subtitle }}</p>
    <a class="link" :href="t.home">{{ t.link }}</a>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 2rem;
}

.code {
  font-size: 6rem;
  font-weight: 700;
  line-height: 1;
  color: var(--vp-c-brand-1);
  margin: 0;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1rem 0 0.25rem;
  color: var(--vp-c-text-1);
}

.subtitle {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 0 0 2rem;
}

.link {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  color: var(--vp-c-white);
  background-color: var(--vp-c-brand-1);
  transition: background-color 0.25s;
  text-decoration: none;
}

.link:hover {
  background-color: var(--vp-c-brand-2);
}
</style>
