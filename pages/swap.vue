<template>
  <div class="container">


    <CardSwapNoWallet
      :wallets="wallets"
      :walletA="walletFirst"
      :walletB="walletSecond"
      :walletC="walletThree"
      :onWalletConnect="onWalletConnect"
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
    // CardSwap,
    // Btn,
    // FormInput,
    // SimpleWrapperSlimSm,
    // FormGroupBetween,
    // FormGroupBetweenShift,
    // SearchSelect,
    // Icon,
    // exchangeIcon: () => import('assets/icons/exchange.svg?inline'),
  },
  data: () => ({
    wallets: [],
    walletThree: undefined,
    wavesKeeper: new Keeper(),
  }),
  computed: {
    theme() {
      return this.$store.getters['theme/theme']
    },
  },
  mounted() {
    this.$store.commit('app/SET_IS_HIDE_MOBILE_TITLE', false)
    const wallets = [
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
    ]
    this.wallets = wallets
  },
  methods: {
    walletRotate: function () {
      const walletFirst = { ...this.walletFirst }
      this.walletFirst = { ...this.walletSecond }
      this.walletSecond = walletFirst
    },
    onWalletConnect: function() {
      this.$modal.push('accounts')
    }
  },
})
</script>

<style lang="scss"></style>
