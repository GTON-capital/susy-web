<template>
  <div class="page-wrapper" :class="wrapperClass">
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
    wrapperClass() {
      const classes = {}
      classes['theme-' + this.$store.getters['theme/theme']] = true
      classes['page-wrapper-overflow-hidden'] = this.isOpenNav
      return classes
    },
  },
}
</script>
