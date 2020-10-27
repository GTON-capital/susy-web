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

import Web3WalletConnector, { Web3Invoker } from '~/services/wallets/web3'
import {
  Wallets,
  WalletState,
  ExtensionWallet,
  WalletProvider,
} from '~/store/wallet/types'

import { processConfig } from '~/services/misc/config'
import { buildPropertyChecker } from '~/services/wallets/checker'

const AvailableTokens = {
  SignTestnet: {
    ticker: 'SIGN',
    label: 'SIGN Testnet',
    icon: '/img/icons/signature-chain.png',
    bg: 'black',
    decimals: 8,
    assetId: 'Gf9t8FA4H3ssoZPCwrg3KwUFCci8zuUFP9ssRsUY3s6a',
  },
  SignStagenet: {
    ticker: 'SIGN',
    label: 'SIGN Stagenet',
    icon: '/img/icons/signature-chain.png',
    bg: 'black',
    assetId: '6x8nupBUrX3u1VQcL4jFsf9UyyqacUNbVsKB9WHJ61Qm',
    ERC20: '0xc2dda926711eb9b94b89c886aabb8b11d6ac014d',
    decimals: 8,
  },
  SusyStagenet: {
    ticker: 'SIGN',
    label: 'SuSy token Stagenet',
    icon: '/img/icons/waves.svg',
    bg: 'black',
    assetId: 'Ftnm2XbEWTF54z84UHg7LwPcuBZicXEgvhUdmFt84EWH',
    decimals: 8,
  },
  WBNBStagenet: {
    ticker: 'WBNB',
    label: 'WBNB Stagenet',
    icon: 'https://cryptoai.trade/wp-content/uploads/2020/03/bnb-2.png',
    bg: 'black',
    assetId: 'Ap4heStRGQbHAxR6qb9UFtJ3kBiGuumdnsd9JzTHwTTL',
    ERC20: '0xb834BBbE424Ca134b372e7D275Ef628CDCB4F65E',
    decimals: 6,
  },
}

type Chain = { id: string; label: string; icon: string }
type AvailableChainsDict = { Ethereum: Chain; Waves: Chain; BSC: Chain }

const AvailableChains: AvailableChainsDict = {
  Ethereum: {
    id: '1',
    label: 'ETH Ropsten',
    icon: '/img/icons/ethereum.svg',
  },
  Waves: {
    id: '2',
    label: 'Waves Stagenet',
    icon: '/img/icons/waves.svg',
  },
  BSC: {
    id: '3',
    label: 'BSC Testnet',
    icon: 'https://cryptoai.trade/wp-content/uploads/2020/03/bnb-2.png',
  },
}

function formLinkForChain(chain: Chain, address: string): string {
  switch (chain.id) {
    case AvailableChains.BSC.id:
      return `https://testnet.bscscan.com/address/${address}#tokentxns`
    case AvailableChains.Ethereum.id:
      return `https://ropsten.etherscan.io/address/${address}#tokentxns `
    case AvailableChains.Waves.id:
      return `https://wavesexplorer.com/stagenet/address/${address} `
  }

  return ''
}

const availableTokens = [
  // AvailableTokens.SignTestnet,
  AvailableTokens.SignStagenet,
  AvailableTokens.WBNBStagenet,
]

interface SwapMessage {
  text: string
  linkA?: string
  linkB?: string
}

// function web3NumFormat() {
//   const { BN } = window.web3.utils

//   amountValue = new BN(amountValue, 10)
// }

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
      token: AvailableTokens.WBNBStagenet,
      tokenAmount: 0,
      currentBalance: 0,
      formattedBalance: 0,
      needAllowance: false,
      message: {} as SwapMessage,
    },
    propertiesObs: null,
    subs: [],
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
      const config = processConfig()

      if (!currentWallet) {
        return {}
      }

      if (currentWallet.provider === WalletProvider.WavesKeeper) {
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
          if (!config.ethereumChain?.ibport) {
            throw new Error('IB Port is invalid')
          }
          const currentWalletAddress =
            window.web3.eth.accounts.givenProvider.selectedAddress

          const invoker = new Web3Invoker()
          const { balance, allowance } = await invoker.getBalanceAndAllowance(
            currentWalletAddress,
            this.swapForm.token.ERC20,
            '0x' + config.ethereumChain.ibport
          )
          console.log({ balance })
          return {
            sourceAddress: currentWalletAddress,
            currentBalance: balance,
            formattedBalance:
              balance / Math.pow(10, this.swapForm.token.decimals),
            needAllowance: allowance <= balance,
          }
        } catch (err) {
          console.log(err)
          return {}
        }
      }

      return {}
    },
    unlockERC20: function () {
      const invoker = new Web3Invoker()
      const config = processConfig()

      invoker.approve(
        '0x' + config.ethereumChain?.ibport,
        this.swapForm.token.ERC20
      )
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
      // invokeSendUnlockRequest
      const invoker = new Web3Invoker()
      const config = processConfig()
      const { swapForm: form } = this

      try {
        if (!config.ethereumChain?.ibport) {
          throw new Error('IB Port is invalid')
        }

        const result = await invoker.invokeSendUnlockRequest(
          form.destinationAddress,
          { value: form.tokenAmount, type: undefined },
          config.ethereumChain.ibport
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
      const config = processConfig()
      const { swapForm: form } = this

      if (!config.wavesChain?.luport) {
        return
      }

      try {
        const result = await invoker.sendTransferRequest({
          dApp: config.wavesChain.luport,
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
.btn.btn-circle.btn-secondary-gradient {
  visibility: hidden;
}
</style>
