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
      :allowanceReceived="allowanceReceived"
      :chains="chains"
      :tokens="tokens"
      :swapForm="swapForm"
      @next="checkSwapDetails"
      @unlock="unlockERC20"
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
      <ConnectWalletModal @connect="handleWalletConnect" />
      <StatusModal
        :message="swapForm.message"
        @close="onPopModal"
        :sourceChain="swapForm.sourceChain"
        :destinationChain="swapForm.destinationChain"
      />
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { Subscription } from 'rxjs'

// MODAL
import ConnectWalletModal from '~/components/modal/ConnectWallet.vue'
// import WalletProviderModal from '~/components/modal/WalletProvider'
import ActionLogsModal from '~/components/modal/ActionLogsModal.vue'
import StatusModal from '~/components/modal/StatusModal.vue'

// SWAP
import WithdrawCard from '~/components/swap/WithdrawCard.vue'
import CardSwap from '~/components/swap/CardSwap.vue'
import CardSwapFinal from '~/components/swap/CardSwapFinal.vue'

// SWAP INTERMEDIATE
import CardSwapNoWallet from '~/components/swap/intermediate/CardSwapNoWallet.vue'
import CardSwapWalletConnected from '~/components/swap/intermediate/CardSwapWalletConnected.vue'
import CardSwapFinalized from '~/components/swap/intermediate/CardSwapFinalized.vue'

import Keeper, { LUPortInvoker } from '~/services/wallets/keeper'

import Web3WalletConnector, { Web3Invoker } from '~/services/wallets/web3'
import {
  Wallets,
  WalletState,
  ExtensionWallet,
  WalletProvider,
} from '~/store/wallet/types'

// import { processConfig } from '~/services/misc/config'
import { castFloatToDecimalsVersion } from '~/misc/bn'
import { buildPropertyChecker } from '~/services/wallets/checker'
import { AvailableChains, Chain } from '~/chains/chain'
import {
  getAvailableTokens,
  AvailableTokens,
  formLinkForChain,
} from '~/chains/token'


const availableTokens = getAvailableTokens()

interface SwapMessage {
  text: string
  linkA?: string
  linkB?: string
}

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
    chains: [
      AvailableChains.Waves,
      AvailableChains.Ethereum,
      AvailableChains.BSC,
    ],
    swapState: 0,
    swapForm: {
      sourceChain: AvailableChains.Waves,
      destinationChain: AvailableChains.BSC,
      sourceAddress: '',
      destinationAddress: '',
      token: AvailableTokens.USDNMainnet,
      tokenAmount: 0,
      currentBalance: 0,
      formattedBalance: 0,
      message: {} as SwapMessage,
    },
    propertiesObs: null,
    subs: [],
    allowanceReceived: false
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
    const sub = this.propertiesObs.subscribe(async (walletData) => {
      const result = await walletData

      this.swapForm = {
        ...this.swapForm,
        ...result,
      }
    })

    // @ts-ignore
    this.subs.push(sub)

    // this.swapForm.message = {
    //   text: 'Swap has been sfgk dnsf g',
    //   linkA: 'A',
    //   linkB: 'B',
    // }
    // this.$modal.push('status')
  },
  beforeDestroy() {
    // @ts-ignore
    this.cleanSubs()
  },
  methods: {
    propertyObserveMap: async function (num: number) {
      const currentWallet = this.$store.getters['wallet/currentWallet']


      if (!currentWallet) {
        return {}
      }

      if (!this.swapForm.token.bridgeConfig) {
        return {}
      }

      const { sourcePort, destinationPort } = this.swapForm.token.bridgeConfig

      if (currentWallet.provider === WalletProvider.WavesKeeper) {
        // reset
        this.allowanceReceived = false

        const keeper = new Keeper()
        const plugin = await keeper.getPlugin()

        if (!plugin) {
          return {}
        }

        const publicState = await plugin.publicState()

        if (!publicState) {
          return {}
        }

        const { address } = publicState.account
        const { server } = publicState.network
        const { assetId } = this.swapForm.token

        try {
          const balanceInfo = await axios.get(
            `/assets/balance/${address}/${assetId}`,
            { baseURL: server }
          )
          const { balance } = balanceInfo.data

          return {
            sourceAddress: address,
            currentBalance: balance,
            formattedBalance:
              balance / Math.pow(10, this.swapForm.token.decimals),
          }
        } catch (err) {
          return {}
        }
      }

      if (currentWallet.provider === WalletProvider.Metamask) {
        try {

          if (!destinationPort) {
            throw new Error('IB Port is invalid')
          }
          const currentWalletAddress =
            window.web3.eth.accounts.givenProvider.selectedAddress

          const invoker = new Web3Invoker()

          let { balance, allowance } = await invoker.getBalanceAndAllowance(
            currentWalletAddress,
            this.swapForm.token.ERC20!,
            destinationPort
          )

          balance = Number(balance)
          // console.log({ balance }, this.swapForm.token.decimals)

          return {
            sourceAddress: currentWalletAddress,
            currentBalance: balance,
            formattedBalance: balance / Math.pow(10, 18),
          }
        } catch (err) {
          console.log(err)
          return {}
        }
      }

      return {}
    },
    unlockERC20: async function () {
      const invoker = new Web3Invoker()
      const amountValue = castFloatToDecimalsVersion(String(this.swapForm.tokenAmount), 18)

      if (!this.swapForm.token.bridgeConfig) {
        return {}
      }

      const { sourcePort, destinationPort } = this.swapForm.token.bridgeConfig

      console.log(
        { amountValue: amountValue.toString() },
        destinationPort,
        this.swapForm.token.ERC20!,
        amountValue.toString()
      )

      try {
        await invoker.approve(
          destinationPort,
          this.swapForm.token.ERC20!,
          amountValue.toString()
        )
        this.allowanceReceived = true
      } catch (err) {
        this.allowanceReceived = false
      }

    },
    cleanSubs: function () {
      for (const sub of this.subs) {
        ;(sub as Subscription).unsubscribe()
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
      const { tokenAmount, destinationAddress } = this.swapForm
      if (!destinationAddress || !tokenAmount) {
        return
      }

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
    buildSuccessMessage: function (
      sourceChain: Chain,
      destinationChain: Chain,
      txA: string,
      txB: string
    ): SwapMessage {
      return {
        text: `
          Swap has been successfully submitted. \n
          Check your transactions here:\n
        `,
        linkA: formLinkForChain(sourceChain, txA),
        linkB: formLinkForChain(destinationChain, txB),
      }
    },
    handleSwapEthereumWaves: async function () {
      try {
        // invokeSendUnlockRequest
        const invoker = new Web3Invoker()

        if (!this.swapForm.token.bridgeConfig) {
          throw new Error('Bridge config is not provided for this token.')
        }

        const { destinationPort } = this.swapForm.token.bridgeConfig
        const { swapForm: form } = this

        if (!destinationPort) {
          throw new Error('IB Port is invalid')
        }

        const result = await invoker.invokeSendUnlockRequest(
          form.destinationAddress,
          { value: String(form.tokenAmount), type: undefined },
          destinationPort
        )

        console.log({ result })
        this.swapForm.message = {
          text: `Swap has been successfully submitted.`,
        }
        this.$modal.push('status')
      } catch (err) {
        console.log({ err })
        this.swapForm.message = { text: `${err.message}. ${err.data}` }
        this.$modal.push('status')
      }
    },
    handleSwapWavesEthereum: async function () {
      const invoker = new LUPortInvoker(new Keeper())
      if (!this.swapForm.token.bridgeConfig) {
        return
      }

      const { sourcePort } = this.swapForm.token.bridgeConfig
      const { swapForm: form } = this


      try {
        const result = await invoker.sendTransferRequest({
          dApp: sourcePort,
          receiver: form.destinationAddress,
          // swapAmount: Math.pow(10, form.token.decimals) * form.tokenAmount,
          swapAmount: form.tokenAmount,
          swapAssetID: form.token.assetId,
        })

        console.log({ result })
        // @ts-ignore
        this.swapForm.message = this.buildSuccessMessage(
          form.sourceChain,
          form.destinationChain,
          form.sourceAddress,
          form.destinationAddress
        )
        this.$modal.push('status')
      } catch (err) {
        console.log({ err })
        this.swapForm.message = { text: `${err.message}. ${err.data}` }
        this.$modal.push('status')
      }
    },
    handleSwapConfirm: async function () {
      const { sourceChain } = this.swapForm

      this.swapForm.message = { text: '' }

      switch (sourceChain.id) {
        case (AvailableChains.Ethereum.id, AvailableChains.BSC.id):
          // @ts-ignore
          await this.handleSwapEthereumWaves()
          break
        case AvailableChains.Waves.id:
          // @ts-ignore
          await this.handleSwapWavesEthereum()
          break
      }
    },
    handleSwapDeny: function () {
      this.swapState = 1
    },
  },
})
</script>

<style lang="scss">
// .btn.btn-circle.btn-secondary-gradient {
//   visibility: hidden;
// }
</style>
