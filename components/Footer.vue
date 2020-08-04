<template>
  <component
    :is="theme + '-footer'"
    :is-disabled-cookies-box="isDisabledCookiesBox"
  ></component>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Footer',
  components: {
    SusyFooter: () => import('~/components/SusyFooter.vue'),
    GravityFooter: () => import('~/components/GravityFooter.vue'),
  },
  props: {
    isDisabledCookiesBox: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    theme() {
      return this.$store.getters['theme/theme']
    },
  },
})
</script>
