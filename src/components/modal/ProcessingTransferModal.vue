<template>
  <modal name="susy-loader">
    <div class="loader-container">
      <div class="text">{{ loader.text }}</div>
      <div class="data-container">
        <div class="chains-container bordered">
          <div class="cross-chain-tx">
            <div v-if="!transferProps.inputTx" ref="input" class="small-loader" />
            <CopyClipboard v-else class="copy" :value="transferProps.inputTx" />
            <span>{{ transferProps.inputLabel }}</span>
            <span>{{ transferProps.amount }}</span>
            <img :src="transferProps.inputToken.logo" class="ch-img" />
            <span>{{ transferProps.inputToken.label }}</span>
            <img src="/img/icons/Arrow 17.svg" />
            <img :src="transferProps.inputToken.chainLogo" class="ch-img" />
            <span>{{ transferProps.inputToken.chainLabel }}</span>
          </div>
        </div>
        <div class="chains-container bordered">
          <div class="cross-chain-tx">
            <div v-if="!transferProps.outputTx" ref="output" class="small-loader" />
            <CopyClipboard v-else class="copy" :value="transferProps.outputTx" />
            <span>{{ transferProps.outputLabel }}</span>
            <span>{{ transferProps.amount }}</span>
            <img :src="transferProps.outputToken.logo" class="ch-img" />
            <span>{{ transferProps.outputToken.label }}</span>
            <img src="/img/icons/Arrow 17.svg" />
            <img :src="transferProps.outputToken.chainLogo" class="ch-img" />
            <span>{{ transferProps.outputToken.chainLabel }}</span>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import Vue from "vue"
import lottie, { AnimationItem } from "lottie-web"

import CopyClipboard from "~/components/CopyClipboard.vue"

export default Vue.extend({
  name: "ProcessingTransferModal",
  props: ["loader", "transferProps"],
  components: {
    CopyClipboard,
  },
  data() {
    return {
      anim: null as null | AnimationItem,
      lockTxAnim: null as null | AnimationItem,
      transferTxAnim: null as null | AnimationItem,
    }
  },
  mounted() {
    const callback = this.init.bind(this)
    setTimeout(() => callback, 300)
  },
  methods: {
    init() {
      // const loader = this.$refs.inputLoader

      // if (!loader) return

      // this.anim = lottie.loadAnimation({
      //   container: loader as Element,
      //   renderer: "svg",
      //   loop: true,
      //   autoplay: true,
      //   path: "/img/anims/susy-loader2.json",
      // })

      // this.anim.play()
      this.lockTxAnim = this.loadAnim(this.$refs.input)
      this.transferTxAnim = this.loadAnim(this.$refs.output)

      console.log(this.lockTxAnim, this.transferTxAnim)

      this.lockTxAnim!.play()
      this.transferTxAnim!.play()
    },
    loadAnim(loader: any): AnimationItem | null {
      // if (!loader) return null

      return lottie.loadAnimation({
        container: loader as Element,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/img/anims/susy-loader2.json",
      })
    },
  },
})
</script>

<style lang="scss" scoped>
$bg-color: #f3f9f9;

.text {
  font-size: 18px;
  text-align: center;
  padding-top: 20px;
  position: relative;
  z-index: 1;
}
.loader {
  height: 200px;
  margin-top: -35px;
}
.loader-container {
  position: relative;
  font-size: 14px;
}
.data-container {
  padding: 0 70px;
  padding-bottom: 48px;
}

.chains-container {
  &.bordered:nth-child(1) {
    margin-top: 24px;
  }
  &.bordered {
    margin-top: 12px;
  }
}

.bordered {
  border-radius: 8px;
  background-color: $bg-color;
}

.internal {
  padding: 16px 0;
  margin: auto;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;

  &.chains {
    width: 280px;
  }
  &.tokens {
    width: 228px;
    font-size: 18px;
  }
}
.sep {
  font-weight: 100;
  font-size: unset;
  margin: auto;
  transform: scaleX(4) scaleY(1.1);
  padding-bottom: 3px;
  line-height: 0.1;
}

.small-loader {
  width: 100px;
  height: 50px;
  transform: scale(1.5);

  rect {
    fill: red;
  }
}
.cross-chain-tx {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 90%;
  justify-content: space-between;
  align-items: center;
  height: 96px;
}

.copy {
  margin-left: 40px;
  cursor: pointer;
}

.ch-img {
  max-width: 30px;
  max-height: 30px;
}
</style>
