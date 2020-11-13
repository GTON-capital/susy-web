<template>
  <div class="page-wrapper">
    <bug-bounty></bug-bounty>
    <navbar-block></navbar-block>
    <main>
      <Nuxt />
    </main>
    <footer-block></footer-block>
  </div>
</template>

<script>
import navbarBlock from '~/components/Navbar'
import footerBlock from '~/components/Footer'
import bugBounty from '../components/BugBounty.vue'

export default {
  components: {
    bugBounty,
    navbarBlock,
    footerBlock,
  },
  computed: {
    isOpenNav() {
      return this.$store.getters['app/isOpenNav']
    },
  },
  head() {
    const themes = this.$store.getters['theme/themes']
    const themeName = this.$store.getters['theme/theme']
    const theme = themes[themeName]
    let className = 'theme-' + themeName
    if (this.isOpenNav) {
      className += ' html-overflow-hidden'
    }
    let title = 'Susy'

    switch (themeName) {
      case 'susy':
        title = 'Susy'
        break
      case 'gravity':
        title = 'Gravity'
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
