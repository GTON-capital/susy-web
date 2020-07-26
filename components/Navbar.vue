<template>
  <nav class="nav">
    123
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {},
  computed: {
    isAuth() {
      return this.$store.getters['auth/isAuth']
    },
  },
})
</script>

<style lang="scss">
$nav-panel-height: 42px;

.nav {
  padding-top: 8px;
  height: 108px;
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
