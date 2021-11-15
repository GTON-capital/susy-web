import susy from "./src/themes/susy"
import gravity from "./src/themes/gravity"

const THEME = "susy" // susy, gravity
// Comment:cvaize
// themes - Для возможности переключения тем прямо в приложении
// просто добавьте имеющиеся темы и переключайте в store/theme.js
const themes = { susy, gravity }

export default {
  server: {
    host: "0.0.0.0",
  },
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  srcDir: "src/",
  mode: "universal",
  env: {
    theme: THEME,
    themes,
  },
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, shrink-to-fit=no",
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: "/swap/gton",
        components: {
          default: resolve(__dirname, "src/pages/swap/index.vue"),
          // default: resolve(__dirname, "pages/users"), // or routes[index].component
          // modal: resolve(__dirname, "components/modal.vue"),
        },
      })
    },
  },
  /*
   ** Global CSS
   */
  css: [{ src: "~/assets/scss/app.scss", lang: "sass" }],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: "~plugins/dropdown", ssr: false },
    { src: "~plugins/click-outside", ssr: false },
    { src: "~plugins/modal", ssr: false },    
    { src: '~/plugins/facebook.js', mode: 'client' },
    { src: '~/plugins/gtag.ts', mode: 'client' },
    { src: "~plugins/clipboard", ssr: true },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    ["@nuxt/typescript-build", { typeCheck: false }],
    ["@nuxtjs/google-analytics", { id: "UA-178874521-1" }],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/gtm", "@nuxtjs/style-resources", "@nuxtjs/svg", "@nuxtjs/dotenv", ["nuxt-lazy-load", { directiveOnly: true }]],
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  /*
   ** Global SASS variables and mixins
   */
  styleResources: {
    scss: ["~/assets/scss/_import.scss"],
  },
  gtm: {
    id: 'GTM-KF4GFM3'
  }
}
