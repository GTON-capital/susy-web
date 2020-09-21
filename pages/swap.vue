<template>
  <div class="container">
    <CardSwapNoWallet
      v-if="swapState === 0"
      :chains="chains"
      :tokens="tokens"
      :swapForm="swapForm"
      :onWalletConnect="onWalletConnect"
      @reverse-chains="onReverseChains"
    />
    <CardSwapWalletConnected
      v-if="swapState === 1"
      :chains="chains"
      :tokens="tokens"
      :swapForm="swapForm"
      @next="checkSwapDetails"
      @change-wallet="onWalletConnect"
      @reverse-chains="onReverseChains"
    />
    <CardSwapFinalized
      v-if="swapState === 2"
      :chains="chains"
      :tokens="tokens"
      :onWalletConnect="onWalletConnect"
      :swapForm="swapForm"
      @swap="handleSwapConfirm"
      @back="handleSwapDeny"
    />
    <client-only>
      <ActionLogsModal :page="page" />
      <ConnectWalletModal />
      <StatusModal :message="swapForm.message" @close="onPopModal" />
    </client-only>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

// MODAL
import ConnectWalletModal from '~/components/modal/ConnectWallet'
import WalletProvider from '~/components/modal/WalletProvider'
import ActionLogsModal from '~/components/modal/ActionLogsModal'
import StatusModal from '~/components/modal/StatusModal'

// SWAP
import WithdrawCard from '~/components/swap/WithdrawCard.vue'
import CardSwap from '~/components/swap/CardSwap'
import CardSwapFinal from '~/components/swap/CardSwapFinal.vue'

// SWAP INTERMEDIATE
import CardSwapNoWallet from '~/components/swap/intermediate/CardSwapNoWallet.vue'
import CardSwapWalletConnected from '~/components/swap/intermediate/CardSwapWalletConnected.vue'
import CardSwapFinalized from '~/components/swap/intermediate/CardSwapFinalized.vue'

import Keeper, { LUPortInvoker } from '~/services/wallets/keeper'
// import { WalletProvider as WalletProviderEnum } from '~/services/wallets/types'
import { processConfig } from '~/services/misc/config'
import { buildPropertyChecker } from '~/services/wallets/checker'


const AvailableTokens = {
  SignTestnet: {
    label: 'SIGN Testnet',
    icon: '/img/icons/signature-chain.png',
    bg: 'black',
    decimals: 8,
    assetId: 'Gf9t8FA4H3ssoZPCwrg3KwUFCci8zuUFP9ssRsUY3s6a',
  },
  SignStagenet: {
    label: 'SIGN Stagenet',
    icon: '/img/icons/signature-chain.png',
    bg: 'black',
    assetId: '6x8nupBUrX3u1VQcL4jFsf9UyyqacUNbVsKB9WHJ61Qm',
    decimals: 8,
  },
  SusyStagenet: {
    label: 'SuSy token Stagenet',
    icon: '/img/icons/waves.svg',
    bg: 'black',
    assetId: 'Ftnm2XbEWTF54z84UHg7LwPcuBZicXEgvhUdmFt84EWH',
    decimals: 8,
  },
}

const AvailableChains = {
  Ethereum: {
    id: '1',
    label: 'Ethereum',
    icon: '/img/icons/ethereum.svg',
  },
  Waves: {
    id: '2',
    label: 'Waves',
    icon: '/img/icons/waves.svg',
  },
}

const availableTokens = [
  AvailableTokens.SignTestnet,
  AvailableTokens.SignStagenet,
]

export default Vue.extend({
  components: {
    WalletProvider,
    ConnectWalletModal,
    CardSwapNoWallet,
    CardSwapFinalized,
    StatusModal,
  },
  data: () => ({
    page: 10,
    tokens: availableTokens,
    chains: [AvailableChains.Waves, AvailableChains.Ethereum],
    swapState: 0,
    swapForm: {
      sourceChain: AvailableChains.Waves,
      destinationChain: AvailableChains.Ethereum,
      sourceAddress: '',
      destinationAddress: '',
      token: AvailableTokens.SignStagenet,
      tokenAmount: 0,
      currentBalance: 0,
      formattedBalance: 0,
      message: '',
    },
    propertiesObs: null,
    subs: []
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

      if (!currentWallet) {
        return
      }

      this.handleWalletConnected()
    })

    this.propertiesObs = buildPropertyChecker(1800, this.propertyObserveMap)

    const sub = this.propertiesObs.subscribe(async walletData => {
      const result = await walletData

      this.swapForm = {
        ...this.swapForm,
        ...result
      }
    })

    this.subs.push(sub)
  },
  beforeDestroy() {
    this.cleanSubs()
  },
  methods: {
    propertyObserveMap: async function(num) {
      const currentWallet = this.$store.getters['wallet/currentWallet']

      if (!currentWallet) { return {} }

      if (currentWallet.provider === 'keeper') {
        const keeper = new Keeper();
        const plugin = await keeper.getPlugin()

        if (!plugin) { return {} }

        const publicState = await plugin.publicState()

        if (!publicState) { return {} }

        const { address } = publicState.account
        const { server } = publicState.network
        const { assetId } = this.swapForm.token

        try {
          const balanceInfo = await axios.get(`/assets/balance/${address}/${assetId}`, { baseURL: server })
          const { balance } = balanceInfo.data

          return {
            sourceAddress: address,
            currentBalance: balance,
            formattedBalance: balance / Math.pow(10, this.swapForm.token.decimals)
          }
        } catch (err) {
          return {}
        }
      }

      return {}
    },
    cleanSubs: function () {
      for (const sub of this.subs) {
        sub.unsubscribe()
      }
    },
    onPopModal: function () {
      this.$modal.pop()
    },
    onReverseChains: function () {
      const sourceChain = { ...this.swapForm.sourceChain }
      this.swapForm.sourceChain = { ...this.swapForm.destinationChain }
      this.swapForm.destinationChain = sourceChain
    },
    onWalletConnect: function () {
      this.$modal.push('accounts')
    },
    checkSwapDetails: function () {
      this.swapState = 2
    },
    handleWalletConnected: function () {
      this.swapState = 1
    },
    handleSwapConfirm: async function () {
      const { sourceChain } = this.swapForm

      this.swapForm.message = ''

      if (sourceChain.label !== AvailableChains.Waves.label) {
        return
      }

      const invoker = new LUPortInvoker(new Keeper())
      const config = processConfig()
      const { swapForm: form } = this

      try {
        const result = await invoker.sendTransferRequest({
          dApp: config.wavesChain.luport,
          receiver: form.destinationAddress,
          // swapAmount: Math.pow(10, form.token.decimals) * form.tokenAmount,
          swapAmount: form.tokenAmount,
          swapAssetID: form.token.assetId,
        })

        console.log({ result })
        this.swapForm.message = `Swap has been successfully submitted.`
        this.$modal.push('status')
      } catch (err) {
        console.log({ err })
        this.swapForm.message = `${err.message}. ${err.data}`
        this.$modal.push('status')
      }
    },
    handleSwapDeny: function () {
      this.swapState = 1
    },
  },
})
</script>

<style lang="scss"></style>
