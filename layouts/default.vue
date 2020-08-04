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
import navbarBlock from '~/components/Navbar'
import footerBlock from '~/components/Footer'

export default {
  components: {
    navbarBlock,
    footerBlock,
  },
  computed: {
    isOpenNav() {
      return this.$store.getters['app/isOpenNav']
    },
  },
  head() {
    let className = 'theme-' + this.$store.getters['theme/theme']
    if (this.isOpenNav) {
      className += ' html-overflow-hidden'
    }
    return {
      htmlAttrs: {
        class: className,
      },
    }
  },
}
</script>
