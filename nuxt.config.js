import susy from './themes/susy'
import gravity from './themes/gravity'

const THEME = 'gravity' // susy, gravity
// Comment:cvaize
// themes - Для возможности переключения тем прямо в приложении
// просто добавьте имеющиеся темы и переключайте в store/theme.js
const themes = { susy, gravity }
const theme = themes[THEME]

let title = 'Susy'

switch (THEME) {
  case 'susy':
    title = 'Susy'
    break
  case 'gravity':
    title = 'Gravity'
    break
}

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  env: {
    theme: THEME,
    themes,
  },
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title,
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      ...theme.head.meta,
    ],
    link: [...theme.head.link],
  },
  /*
   ** Global CSS
   */
  css: [{ src: '~/assets/scss/app.scss', lang: 'sass' }],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~plugins/modal', ssr: false },
    { src: '~plugins/clipboard', ssr: true },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/svg',
    ['nuxt-lazy-load', { directiveOnly: true }],
  ],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  /*
   ** Global SASS variables and mixins
   */
  styleResources: {
    scss: ['~/assets/scss/_import.scss'],
  },
}
