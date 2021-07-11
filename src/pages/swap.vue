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
  </div>
</template>

<script lang="ts">
import _ from "lodash"
import bs58 from "bs58"
import Vue from "vue"
import axios from "axios"
import { Subscription } from "rxjs"
import { PublicKey } from "@solana/web3.js"

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
import { AvailableChains, Chain, availableEVMChains, SOLANA_CHAIN, isEVMChain } from "~/chains/chain"
import { Token, AvailableTokens, getAvailableTokens, formLinkForChain, pickBridgeGateway, availableOriginChains, availableDestChains, GatewayBridge } from "~/chains/token"

import { IBPort } from "~/services/solana/instruction"
import { MathWalletAdapter } from "~/services/wallet-adapters"

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
  Processing: "Transfer is processing",
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
      sourceChain: AvailableChains.Polygon,
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
    // this.showLoader(SwapLoaderMessage.Allowance)

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
      // @ts-ignore
      this.$modal.pop("susy-loader")
    },
    async showLoader(newText?: string) {
      this.loader.text = !newText ? SwapLoaderMessage.Processing : newText

      this.$modal.push("susy-loader")

      await new Promise((resolve) => setTimeout(() => resolve(0), 300))
      // @ts-ignore
      this.$refs.loader.init()
      // @ts-ignore
      this.$refs.loader.anim.play()

      // // @ts-ignore
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
    async propertyObserveMap() {
      const currentWallet = this.$store.getters["wallet/currentWallet"]

      if (!currentWallet) {
        return {}
      }

      if (currentWallet.provider === WalletProvider.MathWallet) {
        const address = currentWallet.walletAdapter?.publicKey.toBase58()
        const emptyResult = {
          sourceAddress: address,
          currentBalance: 0,
          formattedBalance: 0,
        }
        const invoker = this.getSolanaInvoker(currentWallet.walletAdapter)

        if (!invoker) {
          return emptyResult
        }

        const currentBridge = this.pickBridgeGateway()!

        const { TOKEN_DATA_ACCOUNT } = currentBridge.cfg.meta!

        const memorizedAccount = invoker!.getMemorizedTokenAccount(new PublicKey(TOKEN_DATA_ACCOUNT))

        if (!memorizedAccount) {
          return emptyResult
        }

        const response = await axios.post("https://api.mainnet-beta.solana.com", {
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountBalance",
          params: [memorizedAccount.publicKey.toBase58()],
        })

        const result: {
          jsonrpc: string
          result: {
            context: {
              slot: number
            }
            value: {
              amount: string
              decimals: number
              uiAmount: number
              uiAmountString: string
            }
          }
          id: number
        } = response.data

        // console.log({ result })
        try {
          const obj = {
            sourceAddress: address,
            currentBalance: result.result.value.amount,
            formattedBalance: result.result.value.uiAmount,
          }
          // console.log({ obj })
          return obj
        } catch (err) {
          console.log({ err })
          return emptyResult
        }
      }

      // const gateway = this.pickBridgeGateway()
      // const { destinationPort } = gateway!.cfg

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
            formattedBalance: String(balance / Math.pow(10, decimals)).slice(0, 12),
          }
        } catch (err) {
          return {}
        }
      }

      if (currentWallet.provider === WalletProvider.Metamask) {
        try {
          const currentWalletAddress = window.web3.eth.accounts.givenProvider.selectedAddress

          const invoker = new Web3Invoker()
          const { assetId } = this.getCurrentBridgeToken()

          console.log({ currentWalletAddress, assetId })
          let { balance } = await invoker.getBalanceAndAllowance(currentWalletAddress, assetId, "")

          balance = Number(balance)
          // console.log({ balance }, this.swapForm.token.decimals)

          return {
            sourceAddress: currentWalletAddress,
            currentBalance: balance,
            formattedBalance: String(balance / Math.pow(10, 18)).slice(0, 12),
          }
        } catch (err) {
          console.log(err)
          return {}
        }
      }

      return {}
    },
    async handleApproveSolana(gateway: GatewayBridge, _chain: Chain) {
      const currentWallet = this.$store.getters["wallet/currentWallet"]

      if (!currentWallet) {
        return {}
      }

      if (currentWallet.provider !== WalletProvider.MathWallet) {
        return
      }

      const invoker = this.getSolanaInvoker(currentWallet.walletAdapter)
      if (!invoker) {
        return
      }
      const { IBPORT_PROGRAM_ID, TOKEN_DATA_ACCOUNT, TOKEN_OWNER } = gateway.cfg.meta!

      const tokenAccount = invoker.getMemorizedTokenAccount(new PublicKey(TOKEN_DATA_ACCOUNT))

      console.log({ tokenAccount })

      if (!tokenAccount) {
        return
      }

      const approveAmount = this.swapForm.tokenAmount
      console.log({ approveAmount, destinationPort: gateway.cfg.destinationPort })

      try {
        // const spender = new PublicKey(bs58.decode(gateway.cfg.destinationPort))
        const spender = new PublicKey(gateway.cfg.destinationPort)

        const approveTx = await invoker.approveSPLToken(approveAmount, tokenAccount.publicKey, invoker.initializer, spender)
        // const approveTx = await invoker.approveSPLToken(approveAmount, spender, spender)

        console.log({ approveTx })
      } catch (err) {
        console.log({ err: err.stack })
      }
    },
    async unlockERC20() {
      const invoker = new Web3Invoker()
      const amountValue = castFloatToDecimalsVersion(String(this.swapForm.tokenAmount), 18)

      // if (!this.swapForm.token.bridgeConfig) {
      //   return {}
      // }

      const gateway = this.pickBridgeGateway()
      if (!gateway) {
        return
      }

      if (isEVMChain(gateway.destination)) {
        return this.handleApproveSolana(gateway, gateway.origin)
      }

      let spender = gateway!.cfg.destinationPort

      if (isEVMChain(gateway!.origin)) {
        spender = gateway!.cfg.sourcePort
      }

      // console.log(
      //   { amountValue: amountValue.toString() },
      //   destinationPort,
      //   this.swapForm.token.ERC20!,
      //   amountValue.toString()
      // )

      try {
        // @ts-ignore
        this.showLoader(SwapLoaderMessage.Allowance)

        const currentToken = this.getCurrentBridgeToken()

        await invoker.approve(spender, currentToken.assetId, amountValue.toString())
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
      if (wallet.provider === WalletProvider.MathWallet) {
        const mathWallet = new MathWalletAdapter()

        // const IBPORT_PROGRAM_ID = "AH3QKaj942UUxDjaRaGh7hvdadsD8yfU9LRTa9KXfJkZ"
        // const TOKEN_DATA_ACCOUNT = "nVZnRKdr3pmcgnJvYDE8iafgiMiBqxiffQMcyv5ETdA"
        // const TOKEN_OWNER = "2ANEXknub11fKbmELve361E7rbPFCsu3qEey7oai2Et9"

        // const instructionBuilder = new IBPort.InstructionBuilder({
        //   initializer: mathWallet.publicKey,
        //   ibportProgram: new PublicKey(IBPORT_PROGRAM_ID),
        //   tokenProgramAccount: new PublicKey(TOKEN_DATA_ACCOUNT),
        //   spenderTokenAccount: new PublicKey(""),
        //   tokenOwner: new PublicKey(TOKEN_OWNER),
        // })
        await mathWallet.connect()
        await new Promise((resolve) => setTimeout(() => resolve(0), 100))

        console.log({ mathWallet, initializer: mathWallet.publicKey.toBase58() })

        try {
          this.$store.commit("wallet/updateWalletData", {
            provider: wallet.provider,
            body: {
              isConnected: mathWallet.connected,
              value: mathWallet.publicKey.toBase58(),
              checked: true,
              walletAdapter: mathWallet,
            },
          })
        } catch (err) {
          console.log({ err })
        }

        return
      }

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
          Transfer has been successfully submitted. \n
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
          text: `Transfer has been successfully submitted.`,
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
    getSolanaInvoker(mathWallet: MathWalletAdapter): IBPort.Invoker | null {
      const currentBridge = this.pickBridgeGateway()!

      if (!currentBridge.cfg.meta) {
        return null
      }

      const { IBPORT_PROGRAM_ID, TOKEN_DATA_ACCOUNT, TOKEN_OWNER } = currentBridge.cfg.meta!

      // const
      const invoker = new IBPort.Invoker(
        mathWallet,
        {
          initializer: mathWallet.publicKey,
          ibportProgram: new PublicKey(IBPORT_PROGRAM_ID),
          tokenProgramAccount: new PublicKey(TOKEN_DATA_ACCOUNT),
          spenderTokenAccount: new PublicKey(TOKEN_OWNER), // wrong
          tokenOwner: new PublicKey(TOKEN_OWNER),
        },
        "https://api.mainnet-beta.solana.com"
      )

      return invoker
    },
    async handleSolanaAndEVMSwap(sourceChain: Chain, destinationChain: Chain) {
      console.log({ sourceChain, destinationChain })
      const currentWallet = this.$store.getters["wallet/currentWallet"]

      if (!currentWallet) {
        console.error("wallet not connected")
        return
      }

      const mathWallet = new MathWalletAdapter()

      await mathWallet.connect()
      await new Promise((resolve) => setTimeout(() => resolve(0), 1000))

      const invoker = this.getSolanaInvoker(mathWallet)

      if (!invoker) {
        console.error("invoker is not available")
        return
      }

      if (sourceChain.id === SOLANA_CHAIN) {
        //         {
        //     "jsonrpc": "2.0",
        //     "id": 1,
        //     "method": "getTokenAccountBalance",
        //     "params": [
        //         "DK4U8VsNh7ZJs3myAiwtPijkkLdg8ZM4SNokASjN8znK"
        //     ]
        // }
        // TODO
        // if (currentWallet.provider !== WalletProvider.MathWallet) {
        //   console.log("connected wallet is not mathwallet")
        //   return
        // }
        // const mathWallet = currentWallet.walletAdapter!
        // const createTokenAccount = invoker.createTokenAccount.bind(invoker)
        // const createTokenAccount = invoker.createOrGetMemorizedTokenAccount.bind(invoker)
        // // setTimeout(() => createTokenAccount(new PublicKey(TOKEN_DATA_ACCOUNT)), 1000)
        // setTimeout(async () => {
        //   const createAccount = await createTokenAccount(new PublicKey(TOKEN_DATA_ACCOUNT))
        //   console.log({ createAccount, tag: "outside" })
        // }, 1000)
        // const tokenHolderAddress = await invoker.createOrGetMemorizedTokenAccount(new PublicKey(TOKEN_DATA_ACCOUNT))
        // const tokenHolderAddress = await invoker.createOrGetMemorizedTokenAccount(new PublicKey(TOKEN_DATA_ACCOUNT))
        // await this.handleSolanaIBPortBurn(invoker, destinationAddress!.publicKey)
      } else {
        console.log({ mathWallet, initializer: mathWallet.publicKey.toBase58() })

        const gateway = this.pickBridgeGateway()
        if (!gateway || !gateway.cfg.meta) {
          return
        }
        const { TOKEN_DATA_ACCOUNT } = gateway.cfg.meta

        const destinationAddress = await invoker.createOrGetMemorizedTokenAccount(new PublicKey(TOKEN_DATA_ACCOUNT))

        console.log({ destinationAddress, destinationAddressB58: destinationAddress?.publicKey.toBase58() })

        await this.handleEVMLUPortLock(destinationAddress!.publicKey)
      }
    },
    async handleSolanaIBPortBurn() {},
    async handleEVMLUPortLock(destinationAddress: PublicKey) {
      try {
        // invokeSendUnlockRequest

        // @ts-ignore
        this.showLoader()
        const invoker = new Web3Invoker()

        // if (!this.swapForm.token.bridgeConfig) {
        //   throw new Error('Bridge config is not provided for this token.')
        // }
        const gateway = this.pickBridgeGateway()

        let { destinationPort } = gateway!.cfg

        if (isEVMChain(gateway!.origin)) {
          destinationPort = gateway!.cfg.sourcePort
        }

        const { swapForm: form } = this

        if (!destinationPort) {
          throw new Error("IB Port is invalid")
        }

        const result = await invoker.invokeLUPortLock(destinationAddress, { value: String(form.tokenAmount), type: undefined }, destinationPort)

        this.swapForm.message = {
          text: `Transfer has been successfully submitted.`,
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
    async handleSwapConfirm() {
      const { sourceChain, destinationChain } = this.swapForm

      this.swapForm.message = { text: "" }

      const isEVMChainInAction =
        _.intersection(
          availableEVMChains().map((x) => x.id),
          [sourceChain.id, destinationChain.id]
        ).length > 0

      if ([sourceChain.id, destinationChain.id].includes(SOLANA_CHAIN) && isEVMChainInAction) {
        await this.handleSolanaAndEVMSwap(sourceChain, destinationChain)
        return
      }

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
