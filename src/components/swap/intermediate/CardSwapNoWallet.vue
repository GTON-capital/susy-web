<template>
  <card-swap>
    <template v-slot:header>
      <SwapHint />
    </template>
    <simple-wrapper-slim-sm>
      <form-group-between>
        <template v-slot:left>
          <search-select v-model="swapForm.sourceChain" :data="chains.origin" disabled :placeholder="sourceChainLabel" :modal-heading="sourceChainLabel">
            <template v-slot:label>
              Origin
            </template>
          </search-select>
        </template>
        <template v-slot:center>
          <button class="btn btn-circle btn-secondary-gradient" @click="$emit('reverse-chains')">
            <icon>
              <exchange-icon> </exchange-icon>
            </icon>
          </button>
        </template>
        <template v-slot:right>
          <search-select v-model="swapForm.destinationChain" :data="chains.destination" :placeholder="destinationChainLabel" :modal-heading="destinationChainLabel">
            <template v-slot:label>
              Destination
            </template>
          </search-select>
        </template>
      </form-group-between>
    </simple-wrapper-slim-sm>

    <btn
      class="btn-link btn-block"
      :class="{
        'link-invert': theme === 'susy',
        'text-primary': theme === 'gravity',
      }"
      @click="onWalletConnect"
    >
      Connect wallet
    </btn>

    <!-- <hr /> -->
    <br />

    <!-- <form-input v-model="swapForm.destinationAddress">
      <template v-slot:label>
        To address
      </template>
    </form-input> -->

    <simple-wrapper-slim-sm>
      <form-group-between-shift>
        <template v-slot:left>
          <search-select v-model="swapForm.token" :data="swapProps.tokens" placeholder="Select a token..." modal-heading="Select a token" @input="$emit('select-token')">
            <template v-slot:label>
              Token
            </template>
          </search-select>
        </template>
        <template v-slot:right>
          <form-input v-model="swapForm.tokenAmount" type="number">
            <template v-slot:label>
              Amount
            </template>
            <template v-slot:error v-if="formErrors">
              {{ formErrors.message }}
            </template>
          </form-input>
        </template>
      </form-group-between-shift>
    </simple-wrapper-slim-sm>

    <template v-slot:footer disabled>
      <btn class="btn-primary btn-block">
        Next
      </btn>
    </template>
  </card-swap>
</template>

<script>
import Btn from "~/components/Btn.vue"
import FormInput from "~/components/FormInput.vue"
import SimpleWrapperSlimSm from "~/components/SimpleWrapperSlimSm.vue"
import FormGroupBetween from "~/components/FormGroupBetween.vue"
import SearchSelect from "~/components/SearchSelect.vue"
import CardSwap from "~/components/swap/CardSwap"
import FormGroupBetweenShift from "~/components/FormGroupBetweenShift.vue"

import SwapHint from "~/components/swap/SwapHint"

export default {
  name: "CardSwapNoWallet",
  components: {
    SwapHint,
    Btn,
    FormInput,
    SimpleWrapperSlimSm,
    FormGroupBetween,
    SearchSelect,
    CardSwap,
    FormGroupBetweenShift,
    exchangeIcon: () => import("assets/icons/exchange.svg?inline"),
  },
  props: ["swapProps", "onWalletConnect", "formErrors"],
  data() {
    return {
      sourceChainLabel: "Select source chain",
      destinationChainLabel: "Select destination chain",
    }
  },
  computed: {
    theme() {
      return this.$store.getters["theme/theme"]
    },
    chains() {
      return this.swapProps.chains
    },
    swapForm() {
      return this.swapProps.swapForm
    },
  },
}
</script>

<style lang="scss" scoped>
// .go-max {
//   background: linear-gradient(0.64deg, #5d7c80 -97.93%, #ffffff 190.55%);
// }
</style>
