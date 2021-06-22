<template>
  <div class="container">
    <CardSwapNoWallet v-if="swapState === 0" :swap-props="cardSwapProps" :on-wallet-connect="onWalletConnect" @reverse-chains="onReverseChains" @select-token="handleTokenSelect" />
    <CardSwapWalletConnected
      v-if="swapState === 1"
      :allowance-received="allowanceReceived"
      :swap-props="cardSwapProps"
      @next="checkSwapDetails"
      @unlock="unlockERC20"
      @change-wallet="onWalletConnect"
      @reverse-chains="onReverseChains"
      @select-token="handleTokenSelect"
    />
    <CardSwapFinalized v-if="swapState === 2" :on-wallet-connect="onWalletConnect" :swap-props="cardSwapProps" @swap="handleSwapConfirm" @back="handleSwapDeny" />
    <client-only>
      <ActionLogsModal :page="page" />
      <ConnectWalletModal @connect="handleWalletConnect" />
      <StatusModal :message="swapForm.message" :source-chain="swapForm.sourceChain" :destination-chain="swapForm.destinationChain" @close="onPopModal" />
      <SwapLoader ref="loader" :loader="loader" />
    </client-only>
    <div>
      <!-- <div ref="loader" style="width: 100%; z-index: 0; height: 100vh; position: absolute; top: 0; left: 0"/> -->
    </div>
    <!-- <modal name="susy-loader">
      <div>
        <div style="text-align: center; padding: 20px 0;">{{ loader.text }}</div>
        <div ref="loader" style="height: 450px;"/>
      </div>
    </modal> -->
    <!-- <SwapLoader :loader="loader"/> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import axios from "axios"
import { Subscription } from "rxjs"

// MODAL
import ConnectWalletModal from "~/components/modal/ConnectWallet.vue"
// import WalletProviderModal from '~/components/modal/WalletProvider'
import StatusModal from "~/components/modal/StatusModal.vue"

// SWAP

// SWAP INTERMEDIATE
import CardSwapNoWallet from "~/components/swap/intermediate/CardSwapNoWallet.vue"
import CardSwapFinalized from "~/components/swap/intermediate/CardSwapFinalized.vue"

import Keeper, { LUPortInvoker } from "~/services/wallets/keeper"

import Web3WalletConnector, { Web3Invoker } from "~/services/wallets/web3"
import { ExtensionWallet, WalletProvider } from "~/store/wallet/types"

// import { processConfig } from '~/services/misc/config'
import { castFloatToDecimalsVersion } from "~/misc/bn"
import { buildPropertyChecker } from "~/services/wallets/checker"
import { AvailableChains, Chain, availableEVMChains } from "~/chains/chain"
import { Token, AvailableTokens, getAvailableTokens, formLinkForChain, pickBridgeGateway, availableOriginChains, availableDestChains } from "~/chains/token"

const availableTokens = getAvailableTokens()

type DirectionChainsCfg = {
  origin: Chain[]
  destination: Chain[]
}

interface SwapMessage {
  text: string
  linkA?: string
  linkB?: string
}

const SwapLoaderMessage = {
  Processing: "Swap is processing",
  Allowance: "Waiting for allowance approval",
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
    swapState: 0,
    swapForm: {
      isDirect: true,
      sourceChain: AvailableChains.Fantom,
      destinationChain: AvailableChains.Solana,
      sourceAddress: "",
      destinationAddress: "",
      token: AvailableTokens.GTONMainnet as Token,
      tokenAmount: 0,
      currentBalance: 0,
      formattedBalance: 0,
      message: {} as SwapMessage,
    },
    propertiesObs: null,
    subs: [],
    allowanceReceived: false,
    loader: {
      callCount: 0,
      text: SwapLoaderMessage.Processing,
    },
  }),
  computed: {
    theme() {
      return this.$store.getters["theme/theme"]
    },
    availableOriginChains() {
      return availableOriginChains(this.swapForm.token.bridge)
    },
    availableDestChains() {
      return availableDestChains(this.swapForm.token.bridge)
    },
    cardSwapProps() {
      const { tokens, swapForm } = this
      return {
        chains: (swapForm.isDirect
          ? {
              // @ts-ignore
              origin: this.availableOriginChains,
              // @ts-ignore
              destination: this.availableDestChains,
            }
          : {
              // @ts-ignore
              origin: this.availableDestChains,
              // @ts-ignore
              destination: this.availableOriginChains,
            }) as DirectionChainsCfg,
        tokens,
        swapForm,
      }
    },
  },
  mounted() {
    this.$store.commit("app/SET_IS_HIDE_MOBILE_TITLE", false)

    this.$store.subscribe((mutation, state) => {
      const currentWallet = this.$store.getters["wallet/currentWallet"]

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
    hideLoader() {
      // this.$modal.pop('susy-loader');
    },
    showLoader() {
      // this.$modal.push('susy-loader')
    },
    handleTokenSelect() {
      // set default chains for token
      const [origin, dest] = [this.availableOriginChains, this.availableDestChains]

      if (this.swapForm.isDirect) {
        this.swapForm.sourceChain = origin[0]
        this.swapForm.destinationChain = dest[0]
      } else {
        this.swapForm.sourceChain = dest[0]
        this.swapForm.destinationChain = origin[0]
      }
    },
    getCurrentBridgeToken() {
      const gateway = this.pickBridgeGateway()!
      const { token } = gateway.cfg

      const [originToken, destToken] = [token.origin, token.dest]

      if (this.swapForm.sourceChain.id === gateway.origin.id) {
        return originToken
      }

      return destToken
    },
    pickBridgeGateway() {
      const { isDirect } = this.swapForm

      let listOfChains = [this.swapForm.sourceChain, this.swapForm.destinationChain]

      if (!isDirect) {
        listOfChains = listOfChains.reverse()
      }

      const [originChain, destChain] = listOfChains
      return pickBridgeGateway(this.swapForm.token.bridge!, originChain, destChain)
    },
    async propertyObserveMap(num: number) {
      const currentWallet = this.$store.getters["wallet/currentWallet"]

      if (!currentWallet) {
        return {}
      }

      const gateway = this.pickBridgeGateway()
      const { destinationPort } = gateway!.cfg

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

        const { assetId, decimals } = this.getCurrentBridgeToken()

        try {
          const balanceInfo = await axios.get(`/assets/balance/${address}/${assetId}`, { baseURL: server })
          const { balance } = balanceInfo.data

          return {
            sourceAddress: address,
            currentBalance: balance,
            formattedBalance: balance / Math.pow(10, decimals),
          }
        } catch (err) {
          return {}
        }
      }

      if (currentWallet.provider === WalletProvider.Metamask) {
        try {
          if (!destinationPort) {
            throw new Error("IB Port is invalid")
          }
          const currentWalletAddress = window.web3.eth.accounts.givenProvider.selectedAddress

          const invoker = new Web3Invoker()
          const { assetId } = this.getCurrentBridgeToken()

          let { balance } = await invoker.getBalanceAndAllowance(currentWalletAddress, assetId, destinationPort)

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
    async unlockERC20() {
      const invoker = new Web3Invoker()
      const amountValue = castFloatToDecimalsVersion(String(this.swapForm.tokenAmount), 18)

      // if (!this.swapForm.token.bridgeConfig) {
      //   return {}
      // }

      const gateway = this.pickBridgeGateway()
      const { destinationPort } = gateway!.cfg

      // console.log(
      //   { amountValue: amountValue.toString() },
      //   destinationPort,
      //   this.swapForm.token.ERC20!,
      //   amountValue.toString()
      // )

      try {
        // @ts-ignore
        this.showLoader()

        const currentToken = this.getCurrentBridgeToken()

        await invoker.approve(destinationPort, currentToken.assetId, amountValue.toString())
        this.allowanceReceived = true
      } catch (err) {
        this.allowanceReceived = false
      } finally {
        // @ts-ignore
        this.hideLoader()
      }
    },
    cleanSubs() {
      for (const sub of this.subs) {
        ;(sub as Subscription).unsubscribe()
      }
    },
    onPopModal() {
      this.$modal.pop()
    },
    onReverseChains() {
      const sourceChain = { ...this.swapForm.sourceChain }
      this.swapForm.sourceChain = { ...this.swapForm.destinationChain }
      this.swapForm.destinationChain = sourceChain
      this.swapForm.isDirect = !this.swapForm.isDirect
    },
    onWalletConnect() {
      this.$modal.push("accounts")
    },
    checkSwapDetails() {
      const { tokenAmount, destinationAddress } = this.swapForm
      if (!destinationAddress || !tokenAmount) {
        return
      }

      this.swapState = 2
    },
    handleWalletConnected() {
      this.swapState = 1
    },
    async handleWalletConnect(wallet: ExtensionWallet) {
      if (wallet.provider === WalletProvider.Metamask) {
        const connector = new Web3WalletConnector()
        const isConnected = connector.ethEnabled()

        if (!isConnected) {
          return
        }

        this.$store.commit("wallet/updateWalletData", {
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

        this.$store.commit("wallet/updateWalletData", {
          provider: wallet.provider,
          body: {
            isConnected: true,
            value: address as string,
            checked: true,
          },
        })
      }
    },
    buildSuccessMessage(sourceChain: Chain, destinationChain: Chain, txA: string, txB: string): SwapMessage {
      return {
        text: `
          Swap has been successfully submitted. \n
          Check your transactions here:\n
        `,
        linkA: formLinkForChain(sourceChain, txA),
        linkB: formLinkForChain(destinationChain, txB),
      }
    },
    async handleSwapEthereumWaves() {
      try {
        // invokeSendUnlockRequest

        // @ts-ignore
        this.showLoader()
        const invoker = new Web3Invoker()

        // if (!this.swapForm.token.bridgeConfig) {
        //   throw new Error('Bridge config is not provided for this token.')
        // }
        const gateway = this.pickBridgeGateway()

        const { destinationPort } = gateway!.cfg

        const { swapForm: form } = this

        if (!destinationPort) {
          throw new Error("IB Port is invalid")
        }

        const result = await invoker.invokeSendUnlockRequest(form.destinationAddress, { value: String(form.tokenAmount), type: undefined }, destinationPort)

        this.swapForm.message = {
          text: `Swap has been successfully submitted.`,
        }
        this.$modal.push("status")
      } catch (err) {
        console.log({ err })
        this.swapForm.message = { text: `${err.message}. ${err.data}` }
        this.$modal.push("status")
      } finally {
        // @ts-ignore
        this.hideLoader()
      }
    },
    async handleSwapWavesEthereum() {
      const invoker = new LUPortInvoker(new Keeper())
      // if (!this.swapForm.token.bridgeConfig) {
      //   return
      // }

      // const { sourcePort } = this.swapForm.token.bridgeConfig

      const gateway = this.pickBridgeGateway()
      const { sourcePort } = gateway!.cfg
      const { swapForm: form } = this

      try {
        // @ts-ignore
        this.showLoader()

        const currentToken = this.getCurrentBridgeToken()

        const result = await invoker.sendTransferRequest({
          dApp: sourcePort,
          receiver: form.destinationAddress,
          // swapAmount: Math.pow(10, form.token.decimals) * form.tokenAmount,
          swapAmount: form.tokenAmount,
          // TODO: H
          swapAssetID: currentToken.assetId,
        })

        console.log({ result })
        // @ts-ignore
        this.swapForm.message = this.buildSuccessMessage(form.sourceChain, form.destinationChain, form.sourceAddress, form.destinationAddress)
        this.$modal.push("status")
      } catch (err) {
        console.log({ err })
        this.swapForm.message = { text: `${err.message}. ${err.data}` }
        this.$modal.push("status")
      } finally {
        // @ts-ignore
        this.hideLoader()
      }
    },
    async handleSwapConfirm() {
      const { sourceChain } = this.swapForm

      this.swapForm.message = { text: "" }

      if (
        availableEVMChains()
          .map((x) => x.id)
          .includes(sourceChain.id)
      ) {
        console.log("hit evm chain swap")
        await this.handleSwapEthereumWaves()
      } else if ([AvailableChains.Waves.id].includes(sourceChain.id)) {
        console.log("hit waves chain swap")
        await this.handleSwapWavesEthereum()
      }
    },
    handleSwapDeny() {
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
