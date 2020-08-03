<template>
  <component :is="theme + '-footer'"></component>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Footer',
  components: {
    SusyFooter: () => import('~/components/SusyFooter.vue'),
    GravityFooter: () => import('~/components/GravityFooter.vue'),
  },
  computed: {
    theme() {
      return this.$store.getters['theme/theme']
    },
  },
})
</script>
