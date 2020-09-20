<template>
  <div class="container">
    <CardSwapNoWallet v-if="swapState === 0"
      :chainA="chainA"
      :chainB="chainB"
      :chains="chains"
      :tokens="tokens"
      :onWalletConnect="onWalletConnect"
    />
    <CardSwapWalletConnected v-if="swapState === 1"
      :chainA="chainA"
      :chainB="chainB"
      :chains="chains"
      :tokens="tokens"
      @next="checkSwapDetails"
    />
    <CardSwapFinalized v-if="swapState === 2"
      :chainA="chainA"
      :chainB="chainB"
      :chains="chains"
      :tokens="tokens"
      :onWalletConnect="onWalletConnect"
      @swap="handleSwapConfirm"
      @back="handleSwapDeny"
    />
    <client-only>
      <ActionLogsModal :page="page" />
      <ConnectWalletModal
        :walletSecond="walletSecond"
        :walletFirst="walletFirst"
        :wavesKeeper="wavesKeeper"
      />
      <WalletProvider :walletSecond="walletSecond" :walletFirst="walletFirst" />
    </client-only>
  </div>
</template>

<script>
import Vue from 'vue'

// MODAL
import ConnectWalletModal from '~/components/modal/ConnectWallet'
import WalletProvider from '~/components/modal/WalletProvider'
import ActionLogsModal from '~/components/modal/ActionLogsModal'

// SWAP
import WithdrawCard from '~/components/swap/WithdrawCard.vue'
import CardSwap from '~/components/swap/CardSwap'
import CardSwapFinal from '~/components/swap/CardSwapFinal.vue'

// SWAP INTERMEDIATE
import CardSwapNoWallet from '~/components/swap/intermediate/CardSwapNoWallet.vue'
import CardSwapWalletConnected from '~/components/swap/intermediate/CardSwapWalletConnected.vue'
import CardSwapFinalized from '~/components/swap/intermediate/CardSwapFinalized.vue'

import Keeper from '~/services/wallets/Keeper'

export default Vue.extend({
  components: {
    WalletProvider,
    ConnectWalletModal,
    CardSwapNoWallet,
    CardSwapFinalized
  },
  data: () => ({
    tokens: [
      {
        id: '1',
        label: 'Ethereum',
        icon: '/img/icons/ethereum.svg',
      },
      {
        id: '2',
        label: 'RBBT',
        icon: '/img/icons/waves.svg',
      },
    ],
    chains: [
      {
        id: '1',
        label: 'Ethereum',
        icon: '/img/icons/ethereum.svg',
      },
      {
        id: '2',
        label: 'Waves',
        icon: '/img/icons/waves.svg',
      },
      {
        id: '3',
        label: 'NEO',
        icon: '/img/icons/neo.svg',
      },
      {
        id: '4',
        label: 'Tron',
        icon: '/img/icons/tron.svg',
      },
    ],
    chainA: {
      id: '1',
      label: 'Ethereum',
      icon: '/img/icons/ethereum.svg',
    },
    chainB: {
      id: '2',
      label: 'Waves',
      icon: '/img/icons/waves.svg',
    },
    swapState: 0,
  }),
  computed: {
    theme() {
      return this.$store.getters['theme/theme']
    },
  },
  mounted() {
    this.$store.commit('app/SET_IS_HIDE_MOBILE_TITLE', false)


    this.$store.subscribe((mutation, state) => {
      const currentWallet = this.$store.getters['wallet/currentWallet']

      if (!currentWallet) { return }

      this.handleWalletConnected()
    });
  },
  methods: {
    walletRotate: function () {
      const walletFirst = { ...this.walletFirst }
      this.walletFirst = { ...this.walletSecond }
      this.walletSecond = walletFirst
    },
    onWalletConnect: function () {
      this.$modal.push('accounts')
    },
    checkSwapDetails: function() {
      this.swapState = 2
    },
    handleWalletConnected: function() {
      this.swapState = 1
    },
    handleSwapConfirm: function() {

    },
    handleSwapDeny: function() {
      this.swapState = 1
    }
  },
})
</script>

<style lang="scss"></style>
