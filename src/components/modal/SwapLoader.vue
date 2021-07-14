<template>
  <modal name="plain-loader">
    <div>
      <div class="text">{{ loader.text }}</div>
      <div ref="inner" class="loader" />
    </div>
  </modal>
</template>

<script lang="ts">
import Vue from "vue"
import lottie, { AnimationItem } from "lottie-web"

export default Vue.extend({
  name: "SwapLoader",
  props: ["loader"],
  data() {
    return {
      anim: null as null | AnimationItem,
    }
  },
  mounted() {
    const callback = this.init.bind(this)
    setTimeout(() => callback, 300)
  },
  methods: {
    init() {
      const loader = this.$refs.inner

      if (!loader) return

      this.anim = lottie.loadAnimation({
        container: loader as Element,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/img/anims/susy-loader2.json",
      })

      this.anim.play()
    },
  },
})
</script>

<style scoped>
.text {
  font-size: 18px;
  text-align: center;
  padding: 20px 0;
}
.loader {
  height: 450px;
}
</style>
