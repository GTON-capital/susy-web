<template>
  <modal name="susy-loader">
    <div>
      <div class="text">{{ loader.text }}</div>
      <div class="loader" ref="loader" />
    </div>
  </modal>
</template>

<script lang="ts">
import Vue from 'vue'
import lottie from 'lottie-web'

export default Vue.extend({
  name: 'SwapLoader',
  props: ['loader'],
  data: function() {
    return {
      loaderInitialised: false
    }
  },
  beforeUpdate() { 
    const loader = this.$refs.loader;

    if (!this.loaderInitialised && loader) {
      lottie.loadAnimation({
        container: loader as Element,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/img/anims/susy-loader.json'
      });

      this.loaderInitialised = true
    }
  },
})
</script>

<style scoped>
.text {
  font-size: 18px;
  text-align: center; padding: 20px 0;
}
.loader {
  height: 450px;
}
</style>