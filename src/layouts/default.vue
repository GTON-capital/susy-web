<template>
  <div class="page-wrapper">
    <navbar-block></navbar-block>
    <main>
      <Nuxt />
    </main>
    <footer-block></footer-block>
  </div>
</template>

<script>
import navbarBlock from "~/components/Navbar"
import footerBlock from "~/components/Footer"

export default {
  components: {
    navbarBlock,
    footerBlock,
  },
  computed: {
    isOpenNav() {
      return this.$store.getters["app/isOpenNav"]
    },
  },
  head() {
    const themes = this.$store.getters["theme/themes"]
    const themeName = this.$store.getters["theme/theme"]
    const theme = themes[themeName]
    let className = "theme-" + themeName
    if (this.isOpenNav) {
      className += " html-overflow-hidden"
    }
    let title = "SuSy | Seamless Cross-Chain Swaps"

    switch (themeName) {
      case "susy":
        title = "SuSy | Seamless Cross-Chain Swaps"
        break
      case "gravity":
        title = "Gravity"
        break
    }

    return {
      title,
      htmlAttrs: {
        class: className,
      },
      meta: theme.head.meta,
      link: theme.head.link,
    }
  },
}
</script>
