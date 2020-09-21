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
      <ConnectWalletModal @connect="handleWalletConnect"/>
      <StatusModal :message="swapForm.message" @close="onPopModal" />
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { Subscription } from 'rxjs'

// MODAL
import ConnectWalletModal from '~/components/modal/ConnectWallet'
// import WalletProviderModal from '~/components/modal/WalletProvider'
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

import Web3WalletConnector from '~/services/wallets/web3'
import { Wallets, WalletState, ExtensionWallet, WalletProvider } from '~/store/wallet/types'

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
    // WalletProviderModal,
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

      // @ts-ignore
      this.handleWalletConnected()
    })

    // @ts-ignore
    this.propertiesObs = buildPropertyChecker(1800, this.propertyObserveMap)

    // @ts-ignore
    const sub = this.propertiesObs.subscribe(async walletData => {
      const result = await walletData

      this.swapForm = {
        ...this.swapForm,
        ...result
      }
    })

    // @ts-ignore
    this.subs.push(sub)
  },
  beforeDestroy() {
    // @ts-ignore
    this.cleanSubs()
  },
  methods: {
    propertyObserveMap: async function(num: number) {
      const currentWallet = this.$store.getters['wallet/currentWallet']

      if (!currentWallet) { return {} }

      if (currentWallet.provider === WalletProvider.WavesKeeper) {
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
        (sub as Subscription).unsubscribe()
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
    handleWalletConnect: async function (wallet: ExtensionWallet) {

      if (wallet.provider === WalletProvider.Metamask) {
        const connector = new Web3WalletConnector()
        const isConnected = connector.ethEnabled()

        if (!isConnected) {
          return
        }

        this.$store.commit('wallet/updateWalletData', {
          provider: wallet.provider,
          body: {
            isConnected: true,
            value: window.web3.eth.accounts.givenProvider.selectedAddress,
            checked: true,
          },
        })

        return
      }

      if (wallet.provider === WalletProvider.WavesKeeper) {
        const keeper = new Keeper()
        const address = await keeper.getAddress()

        this.$store.commit('wallet/updateWalletData', {
          provider: wallet.provider,
          body: {
            isConnected: true,
            value: address as string,
            checked: true,
          },
        })
      }
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

      if (!config.wavesChain?.luport) { return }

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
