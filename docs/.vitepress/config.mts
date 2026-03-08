import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'

const SITE_URL = 'https://cli.fishxcode.com'
const SITE_TITLE = 'FishXCode CLI'
const SITE_DESC = 'AI 编码工具管理器 — 一键接入 FishXCode API，支持 claude-code、aider、codex、opencode 等主流工具'

const BASE = (process.env.VITEPRESS_BASE ?? '/').replace(/([^/])$/, '$1/')

function p(path: string) {
  return BASE.replace(/\/$/, '') + path
}

export default withPwa(defineConfig({
  base: BASE,
  title: SITE_TITLE,
  description: SITE_DESC,
  lastUpdated: true,
  cleanUrls: true,
  rewrites: {
    'zh-CN/:path': ':path',
  },
  sitemap: {
    hostname: SITE_URL,
  },
  head: [
    ['link', { rel: 'icon', href: p('/logo.svg') }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: SITE_TITLE }],
    ['meta', { property: 'og:title', content: SITE_TITLE }],
    ['meta', { property: 'og:description', content: SITE_DESC }],
    ['meta', { property: 'og:url', content: SITE_URL }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:site', content: '@fishxcode' }],
  ],
  vite: {
    plugins: [groupIconVitePlugin()],
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: SITE_TITLE,
      short_name: 'FishX CLI',
      description: SITE_DESC,
      theme_color: '#c9973e',
      icons: [
        { src: '/logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{css,js,html,svg,png,jpg,ico,txt,woff2}'],
    },
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '快速开始', link: '/quick-start' },
          { text: '命令参考', link: '/commands' },
          { text: '工具列表', link: '/tools' },
          { text: '发布日志', link: '/release' },
          { text: '注册账号', link: 'https://fishxcode.com/register?aff=9CTW' },
        ],
        sidebar: [
          {
            text: '入门',
            items: [
              { text: '快速开始', link: '/quick-start' },
            ],
          },
          {
            text: '参考',
            items: [
              { text: '命令参考', link: '/commands' },
              { text: '工具列表', link: '/tools' },
              { text: '发布日志', link: '/release' },
            ],
          },
        ],
        editLink: {
          pattern: 'https://github.com/fishxcode/fishxcode-cli/edit/main/docs/zh-CN/:path',
          text: '在 GitHub 上编辑此页',
        },
        lastUpdated: { text: '最后更新于' },
        docFooter: { prev: '上一页', next: '下一页' },
        outline: { label: '页面导航', level: [2, 3] },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Quick Start', link: '/en/quick-start' },
          { text: 'Commands', link: '/en/commands' },
          { text: 'Tools', link: '/en/tools' },
          { text: 'Release', link: '/en/release' },
          { text: 'Register', link: 'https://fishxcode.com/register?aff=9CTW' },
        ],
        sidebar: [
          {
            text: 'Getting Started',
            items: [
              { text: 'Quick Start', link: '/en/quick-start' },
            ],
          },
          {
            text: 'Reference',
            items: [
              { text: 'Commands', link: '/en/commands' },
              { text: 'Tools', link: '/en/tools' },
              { text: 'Release Notes', link: '/en/release' },
            ],
          },
        ],
        editLink: {
          pattern: 'https://github.com/fishxcode/fishxcode-cli/edit/main/docs/en/:path',
          text: 'Edit this page on GitHub',
        },
        lastUpdated: { text: 'Last updated' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        outline: { label: 'On this page', level: [2, 3] },
      },
    },
    fr: {
      label: 'Français',
      lang: 'fr-FR',
      link: '/fr/',
      themeConfig: {
        nav: [
          { text: 'Accueil', link: '/fr/' },
          { text: 'Démarrage', link: '/fr/quick-start' },
          { text: 'Commandes', link: '/fr/commands' },
          { text: 'Outils', link: '/fr/tools' },
          { text: 'Notes', link: '/fr/release' },
          { text: "S'inscrire", link: 'https://fishxcode.com/register?aff=9CTW' },
        ],
        sidebar: [
          {
            text: 'Démarrage',
            items: [
              { text: 'Démarrage rapide', link: '/fr/quick-start' },
            ],
          },
          {
            text: 'Référence',
            items: [
              { text: 'Commandes', link: '/fr/commands' },
              { text: 'Outils', link: '/fr/tools' },
              { text: 'Notes de version', link: '/fr/release' },
            ],
          },
        ],
        editLink: {
          pattern: 'https://github.com/fishxcode/fishxcode-cli/edit/main/docs/fr/:path',
          text: 'Modifier cette page sur GitHub',
        },
        lastUpdated: { text: 'Dernière mise à jour' },
        docFooter: { prev: 'Page précédente', next: 'Page suivante' },
        outline: { label: 'Sur cette page', level: [2, 3] },
      },
    },
    es: {
      label: 'Español',
      lang: 'es-ES',
      link: '/es/',
      themeConfig: {
        nav: [
          { text: 'Inicio', link: '/es/' },
          { text: 'Comenzar', link: '/es/quick-start' },
          { text: 'Comandos', link: '/es/commands' },
          { text: 'Herramientas', link: '/es/tools' },
          { text: 'Versiones', link: '/es/release' },
          { text: 'Registrarse', link: 'https://fishxcode.com/register?aff=9CTW' },
        ],
        sidebar: [
          {
            text: 'Comenzar',
            items: [
              { text: 'Inicio rápido', link: '/es/quick-start' },
            ],
          },
          {
            text: 'Referencia',
            items: [
              { text: 'Comandos', link: '/es/commands' },
              { text: 'Herramientas', link: '/es/tools' },
              { text: 'Notas de versión', link: '/es/release' },
            ],
          },
        ],
        editLink: {
          pattern: 'https://github.com/fishxcode/fishxcode-cli/edit/main/docs/es/:path',
          text: 'Editar esta página en GitHub',
        },
        lastUpdated: { text: 'Última actualización' },
        docFooter: { prev: 'Página anterior', next: 'Página siguiente' },
        outline: { label: 'En esta página', level: [2, 3] },
      },
    },
    pt: {
      label: 'Português',
      lang: 'pt-BR',
      link: '/pt/',
      themeConfig: {
        nav: [
          { text: 'Início', link: '/pt/' },
          { text: 'Começar', link: '/pt/quick-start' },
          { text: 'Comandos', link: '/pt/commands' },
          { text: 'Ferramentas', link: '/pt/tools' },
          { text: 'Versões', link: '/pt/release' },
          { text: 'Registrar', link: 'https://fishxcode.com/register?aff=9CTW' },
        ],
        sidebar: [
          {
            text: 'Começar',
            items: [
              { text: 'Início rápido', link: '/pt/quick-start' },
            ],
          },
          {
            text: 'Referência',
            items: [
              { text: 'Comandos', link: '/pt/commands' },
              { text: 'Ferramentas', link: '/pt/tools' },
              { text: 'Notas de versão', link: '/pt/release' },
            ],
          },
        ],
        editLink: {
          pattern: 'https://github.com/fishxcode/fishxcode-cli/edit/main/docs/pt/:path',
          text: 'Editar esta página no GitHub',
        },
        lastUpdated: { text: 'Última atualização' },
        docFooter: { prev: 'Página anterior', next: 'Próxima página' },
        outline: { label: 'Nesta página', level: [2, 3] },
      },
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
          fr: {
            translations: {
              button: { buttonText: 'Rechercher', buttonAriaLabel: 'Rechercher' },
              modal: {
                noResultsText: 'Aucun résultat trouvé',
                resetButtonTitle: 'Réinitialiser',
                footer: { selectText: 'Sélectionner', navigateText: 'Naviguer', closeText: 'Fermer' },
              },
            },
          },
          es: {
            translations: {
              button: { buttonText: 'Buscar', buttonAriaLabel: 'Buscar' },
              modal: {
                noResultsText: 'No se encontraron resultados',
                resetButtonTitle: 'Restablecer',
                footer: { selectText: 'Seleccionar', navigateText: 'Navegar', closeText: 'Cerrar' },
              },
            },
          },
          pt: {
            translations: {
              button: { buttonText: 'Pesquisar', buttonAriaLabel: 'Pesquisar' },
              modal: {
                noResultsText: 'Nenhum resultado encontrado',
                resetButtonTitle: 'Limpar',
                footer: { selectText: 'Selecionar', navigateText: 'Navegar', closeText: 'Fechar' },
              },
            },
          },
        },
      },
    },
    socialLinks: [
      { icon: 'x', link: 'https://x.com/fishxcode' },
      { icon: 'github', link: 'https://github.com/fishxcode/fishxcode-cli' },
    ],
    footer: {
      message: '<a href="https://fishxcode.com" target="_blank">主站</a> | <a href="https://doc.fishxcode.com" target="_blank">文档站</a> | <a href="https://github.com/fishxcode/fishxcode-cli" target="_blank">GitHub</a>',
      copyright: `Copyright © ${new Date().getFullYear()} FishXCode`,
    },
  },
}))
