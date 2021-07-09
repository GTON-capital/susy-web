<template>
  <card-swap>
    <template v-slot:header>
      <SwapHint />
    </template>

    <simple-wrapper-slim-sm>
      <form-group-between>
        <template v-slot:left>
          <search-select v-model="swapForm.sourceChain" :data="chains.origin" :placeholder="sourceChainLabel" :modal-heading="sourceChainLabel">
            <template v-slot:label>
              Origin
            </template>
          </search-select>
        </template>
        <template v-slot:center>
          <button class="btn btn-circle btn-secondary-gradient" @click="$emit('reverse-chains')">
            <icon>
              <exchange-icon></exchange-icon>
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

    <form-group-between-shift1>
      <template v-slot:left>
        <form-input :value="swapForm.sourceAddress" readonly :icon="wallet.wallet.icon">
          <template v-slot:label>
            From address
          </template>
        </form-input>
      </template>
      <template v-slot:right>
        <btn class="btn-link link-invert btn-block" @click="$emit('change-wallet')">
          Change wallet
        </btn>
      </template>
    </form-group-between-shift1>

    <hr class="d-md-none" style="margin: 5px 0 14px 0;" />

    <form-input v-model="swapForm.destinationAddress">
      <template v-slot:label>
        To address
      </template>
    </form-input>

    <simple-wrapper-slim-sm>
      <form-group-between-shift>
        <template v-slot:left>
          <search-select v-model="swapForm.token" :data="tokens" placeholder="Select a token..." modal-heading="Select a token" @input="$emit('select-token')">
            <template v-slot:label>
              Token
              <span class="text-secondary float-right font-weight-normal"> Balance: {{ swapForm.formattedBalance }} </span>
            </template>
          </search-select>
        </template>
        <template v-slot:right>
          <form-input v-model="swapForm.tokenAmount" type="number">
            <template v-slot:label>
              Receive
              <span class="text-secondary float-right font-weight-normal">
                <!-- Gas: 100 Gwei -->
              </span>
            </template>
          </form-input>
        </template>
      </form-group-between-shift>
    </simple-wrapper-slim-sm>

    <template v-slot:footer>
      <btn class="btn-primary" @click="$emit('unlock')" v-if="!allowanceReceived && isOriginChainEVM">
        <!-- <btn class="btn-primary" @click="$emit('unlock')" v-if="false"> -->
        Approve
      </btn>
      <btn class="btn-primary" @click="$emit('next')" v-else>
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
import FormGroupBetweenShift1 from "~/components/FormGroupBetweenShift1.vue"

import SwapHint from "~/components/swap/SwapHint"

import { isEVMChain } from "~/chains/chain"

export default {
  name: "CardSwapWalletConnected",
  // props: ['swapForm', 'chains', 'tokens', 'onWalletConnect', 'allowanceReceived'],
  props: ["swapProps", "onWalletConnect", "allowanceReceived"],
  components: {
    SwapHint,
    Btn,
    FormInput,
    SimpleWrapperSlimSm,
    FormGroupBetween,
    SearchSelect,
    CardSwap,
    FormGroupBetweenShift,
    FormGroupBetweenShift1,
    exchangeIcon: () => import("assets/icons/exchange.svg?inline"),
  },
  computed: {
    swapForm() {
      return this.swapProps.swapForm
    },
    chains() {
      return this.swapProps.chains
    },
    tokens() {
      return this.swapProps.tokens
    },
    theme() {
      return this.$store.getters["theme/theme"]
    },
    isOriginChainEVM() {
      const origin = this.swapForm.sourceChain
      const isEVM = isEVMChain(origin)
      console.log({ isEVM })
      return isEVM
    },
    wallet() {
      const wallet = this.$store.getters["wallet/currentWallet"]

      if (wallet && !this.swapForm.sourceAddress) {
        this.swapForm.sourceAddress = wallet.value
      }

      return wallet
    },
  },
  data: function () {
    return {
      sourceChainLabel: "Select source chain",
      destinationChainLabel: "Select destination chain",
    }
  },
}
</script>
