/* eslint-disable no-console */
<template>
  <div class="container">
    <CardSwapNoWallet v-if="swapState === 0" :swap-props="cardSwapProps" :form-errors="formErrors" :on-wallet-connect="onWalletConnect" @reverse-chains="onReverseChains" @select-token="handleTokenSelect" />
    <CardSwapWalletConnected
      v-if="swapState === 1"
      :allowance-received="allowanceReceived"
      :form-errors="formErrors"
      :swap-props="cardSwapProps"
      @next="checkSwapDetails"
      @unlock="unlockERC20"
      @change-wallet="onWalletConnect"
      @set-max="setMaxAmount"
      @reverse-chains="onReverseChains"
      @select-token="handleTokenSelect"
    />
    <CardSwapFinalized v-if="swapState === 2" :on-wallet-connect="onWalletConnect" :swap-props="cardSwapProps" @swap="handleSwapConfirm" @back="handleSwapDeny" />
    <client-only>
      <ActionLogsModal :page="page" />
      <ConnectTwoWalletsModal @connect="handleWalletConnect" />
      <StatusModal :message="swapForm.message" :source-chain="swapForm.sourceChain" :destination-chain="swapForm.destinationChain" @close="onPopModal" />
      <SwapLoader ref="loader" :loader="loader" />
      <ProcessingTransferModal ref="txsloader" :loader="loader" :transfer-props="processingTransferProps" />
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import axios from "axios"
import { Subscription, Subject } from "rxjs"
import { PublicKey } from "@solana/web3.js"

import Web3 from "web3"

// MODAL
import { formValidatorBuilder, SwapProps, SwapError } from "./form"

import ConnectTwoWalletsModal from "~/components/modal/ConnectTwoWallets.vue"
import ProcessingTransferModal from "~/components/modal/ProcessingTransferModal.vue"
import StatusModal from "~/components/modal/StatusModal.vue"

// SWAP

// SWAP INTERMEDIATE
import CardSwapNoWallet from "~/components/swap/intermediate/CardSwapNoWallet.vue"
import CardSwapFinalized from "~/components/swap/intermediate/CardSwapFinalized.vue"

import Keeper, { LUPortInvoker } from "~/services/wallets/keeper"

import Web3WalletConnector, { Web3Invoker } from "~/services/wallets/web3"
import { ExtensionWallet, WalletProvider, walletSupportsSolana } from "~/store/wallet/types"

// import { processConfig } from '~/services/misc/config'
import { castFloatToDecimalsVersion } from "~/misc/bn"
import { buildPropertyChecker } from "~/services/wallets/checker"
import { AvailableChains, Chain, availableEVMChains, SOLANA_CHAIN, isEVMChain } from "~/chains/chain"
import { Token, AvailableTokens, formLinkForChain, pickBridgeGateway, availableOriginChains, availableDestChains, GatewayBridge } from "~/chains/token"

import { IBPort } from "~/services/solana/instruction"
import { MathWalletAdapter, PhantomWalletAdapter, WalletAdapter } from "~/services/wallet-adapters"

import { SolanaDepositAwaiter } from "~/services/solana/awaiter"
import { EVMDepositAwaiter } from "~/services/wallets/web3-awaiter/web3-awaiter"
import { EVMTokenTransferEvent } from "~/src/services/wallets/web3-awaiter/types"

// const availableTokens = getAvailableTokens()
const availableTokens = [AvailableTokens.GTONMainnet]

type DirectionChainsCfg = {
  origin: Chain[]
  destination: Chain[]
}

type ProcessingTransferTxs = {
  inputTx: string | null
  outputTx: string | null
}

type TokenProcessingTransfer = {
  logo: string
  label: string
  chainLogo: string
  chainLabel: string
}

type ProcessingTransferProps = {
  // token: Token
  amount: number
  bridge: GatewayBridge
  inputLabel: string
  outputLabel: string
  inputTx: string | null
  outputTx: string | null
  inputToken: TokenProcessingTransfer
  outputToken: TokenProcessingTransfer
  // inputTokenLogo: string
  // inputTokenLogo: string
  // outputTokenLogo: string
  // inputChainLogo: string
  // outputChainLogo: string
}

interface SwapMessage {
  text: string
  linkA?: string
  linkB?: string
}

const SwapLoaderType = {
  Plain: "plain-loader",
  Transactions: "susy-loader",
}

const SwapLoaderMessage = {
  Processing: "Transfer is processing",
  Allowance: "Waiting for allowance approval",
}

export default Vue.extend({
  components: {
    // WalletProviderModal,
    // ConnectWalletModal,
    ConnectTwoWalletsModal,
    CardSwapNoWallet,
    CardSwapFinalized,
    StatusModal,
    ProcessingTransferModal,
  },
  data: () => ({
    transferIsBeingProcessed: false,
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
      tokenAmount: "",
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
    solanaDepositAwaiter: null as SolanaDepositAwaiter | null,
    formErrors: null as null | Error,
    processingTransferSubscription: null as Subscription | null,
    processingTransferTxs: { inputTx: null, outputTx: null } as ProcessingTransferTxs,
  }),
  computed: {
    processingTransferProps(): ProcessingTransferProps {
      const gateway = this.pickBridgeGateway()!
      const isDirect = this.swapForm.isDirect

      const labels = isDirect
        ? {
            inputLabel: "Lock",
            outputLabel: "Mint",
          }
        : {
            inputLabel: "Burn",
            outputLabel: "Unlock",
          }

      // const logos = this.swapForm.isDirect
      //   ? {
      //       inputTokenLogo: this.swapForm.token.icon as string,
      //       inputChainLabel: gateway!.origin.label,
      //       outputChainLabel: gateway!.destination.label,
      //       outputTokenLogo: this.swapForm.token.iconWrapped as string,
      //       inputChainLogo: gateway!.origin.icon,
      //       outputChainLogo: gateway!.destination.icon,
      //     }
      //   : {
      //       inputTokenLogo: this.swapForm.token.iconWrapped as string,
      //       inputChainLabel: gateway!.destination.label,
      //       outputChainLabel: gateway!.origin.label,
      //       outputTokenLogo: this.swapForm.token.icon as string,
      //       inputChainLogo: gateway!.destination.icon,
      //       outputChainLogo: gateway!.origin.icon,
      //     }
      let tokensList: TokenProcessingTransfer[] = [
        {
          logo: this.swapForm.token.icon as string,
          label: this.swapForm.token.label as string,
          chainLogo: gateway!.origin.icon,
          chainLabel: gateway!.origin.label,
        },
        {
          logo: this.swapForm.token.iconWrapped as string,
          label: this.swapForm.token.labelWrapped as string,

          chainLogo: gateway!.destination.icon,
          chainLabel: gateway!.destination.label,
        },
      ]

      if (!isDirect) {
        tokensList = tokensList.reverse()
      }

      const [inputToken, outputToken] = tokensList

      return {
        ...labels,
        bridge: gateway!,
        inputToken,
        outputToken,

        amount: Number(this.swapForm.tokenAmount),
        inputTx: this.processingTransferTxs.inputTx,
        outputTx: this.processingTransferTxs.outputTx,
      }
    },
    formValidatorProps(): SwapProps {
      return {
        amount: Number(this.swapForm.tokenAmount),
        balance: this.swapForm.formattedBalance,
        // @ts-ignore
        metamaskChainIDGetter: typeof window !== "undefined" && window.web3?.eth?.getChainId,
      }
    },
    formValidate() {
      const formValidate = formValidatorBuilder(this.formValidatorProps)
      return formValidate
    },
    // async formErrors() {
    //   // @ts-ignore
    //   return await this.formValidate(this.formValidatorProps)
    // },
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
      const connectedWallets = this.$store.getters["wallet/connectedWallets"]
      // @ts-ignore
      const splittedWallets = this.splitWallets(connectedWallets)

      const { tokens, swapForm } = this
      return {
        originWallet: splittedWallets?.originWallet,
        destinationWallet: splittedWallets?.destinationWallet,
        transferIsBeingProcessed: this.transferIsBeingProcessed,
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
    wallet() {
      const wallet = this.$store.getters["wallet/currentWallet"]
      return wallet
    },
    connectedWallets() {
      const connectedWallets = this.$store.getters["wallet/connectedWallets"]
      return connectedWallets
    },
    bothWalletsConnected() {
      const connectedWallets = this.$store.getters["wallet/connectedWallets"]
      return connectedWallets && connectedWallets.length >= 2
    },
  },
  watch: {
    async formValidatorProps() {
      if (!this.bothWalletsConnected) {
        return
      }
      this.formErrors = await this.formValidate()
    },
    connectedWallets(connectedWallets) {
      if (!connectedWallets || connectedWallets.length < 2) {
        this.swapState = 0
        return
      }

      this.updateAddressFields()
    },
    // wallet(newWallet) {
    //   console.log({ newWallet, c: newWallet && !this.swapForm.sourceAddress, sa: this.swapForm.sourceAddress })

    //   if (newWallet && !this.swapForm.sourceAddress && newWallet.value) {
    //     this.swapForm.sourceAddress = newWallet.value
    //   }
    // },
  },
  mounted() {
    // if (isNil(window.localStorage.getItem("susy_authorized"))) {
    //   this.$router.push("/login")
    // }
    // this.showLoader(SwapLoaderType.Transactions, SwapLoaderMessage.Processing)

    this.$store.commit("app/SET_IS_HIDE_MOBILE_TITLE", false)

    this.$store.subscribe(() => {
      const currentWallet = this.$store.getters["wallet/currentWallet"]
      const connectedWallets = this.$store.getters["wallet/connectedWallets"]

      if (!currentWallet || !connectedWallets) {
        return
      }
      if (connectedWallets.length < 2) {
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

    // this.solanaDepositAwaiter =  new SolanaDepositAwaiter()
  },
  beforeDestroy() {
    // @ts-ignore
    this.cleanSubs()
  },
  methods: {
    setMaxAmount() {
      this.swapForm.tokenAmount = String(this.swapForm.formattedBalance)
    },
    updateAddressFields() {
      const splittedWallets = this.splitWallets()!
      if (!splittedWallets) {
        return
      }
      const { originWallet, destinationWallet } = splittedWallets
      // console.log({ originWallet, destinationWallet })

      this.swapForm.sourceAddress = originWallet.value!
      this.swapForm.destinationAddress = destinationWallet.value!
    },
    splitWallets(): {
      originWallet: ExtensionWallet
      destinationWallet: ExtensionWallet
    } | null {
      const connectedWallets = this.connectedWallets as ExtensionWallet[]
      if (!connectedWallets || connectedWallets.length < 2) {
        return null
      }
      const originWallet = connectedWallets.find((x) => x.provider === WalletProvider.Metamask)!
      const destinationWallet = connectedWallets.find((x) => x.provider === WalletProvider.Phantom)!

      if (!this.swapForm.isDirect) {
        return {
          originWallet: destinationWallet,
          destinationWallet: originWallet,
        }
      }

      return {
        originWallet,
        destinationWallet,
      }
    },
    hideLoader(modalName: string) {
      // @ts-ignore
      // this.$modal.pop("susy-loader")
      this.$modal.pop(modalName)
    },
    async showLoader(modalName: string, newText: string) {
      // this.loader.text = !newText ? SwapLoaderMessage.Processing : newText
      this.loader.text = newText

      // this.$modal.push("susy-loader")
      this.$modal.push(modalName)

      switch (modalName) {
        case SwapLoaderType.Transactions:
          await new Promise((resolve) => setTimeout(() => resolve(0), 300))

          // @ts-ignore
          this.$refs.txsloader.init()

          break
        case SwapLoaderType.Plain:
          await new Promise((resolve) => setTimeout(() => resolve(0), 300))
          // @ts-ignore
          this.$refs.loader.init()

          break
      }
      // @ts-ignore
      // this.$refs.loader.anim.play()

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

      let tokenList = [token.origin, token.dest]
      if (!this.swapForm.isDirect) {
        tokenList = tokenList.reverse()
      }

      const [originToken, destToken] = tokenList

      console.log({ originToken, destToken, formSource: this.swapForm.sourceChain.id, gatewayOrigin: gateway.origin.id })

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
      if (!this.bothWalletsConnected) {
        return {}
      }

      if (this.formErrors !== null && this.formErrors.message !== SwapError.InsufficientBalance.message) {
        return {}
      }
      // const currentWallet = this.$store.getters["wallet/currentWallet"]

      // if (!currentWallet) {
      //   return {}
      // }

      // if (currentWallet.provider === WalletProvider.MathWallet || currentWallet.provider === WalletProvider.Phantom) {
      const splittedWallets = this.splitWallets()

      if (!splittedWallets) {
        return {}
      }
      const { originWallet: currentWallet } = splittedWallets
      // const currentWallet = originWallet.wallet

      if (walletSupportsSolana(currentWallet.provider as WalletProvider)) {
        const address = currentWallet.value
        const emptyResult = {
          sourceAddress: address,
          currentBalance: 0,
          formattedBalance: 0,
        }

        const walletAdapter = new PhantomWalletAdapter()
        await walletAdapter.connect()

        const invoker = this.getSolanaInvoker(walletAdapter)
        // console.log({ invoker })

        if (!invoker) {
          return emptyResult
        }

        const currentBridge = this.pickBridgeGateway()!

        const { TOKEN_DATA_ACCOUNT } = currentBridge.cfg.meta!

        const memorizedAccount = await invoker.getExistingTokenAccount(new PublicKey(TOKEN_DATA_ACCOUNT))

        if (!memorizedAccount) {
          return emptyResult
        }

        const response = await axios.post("https://api.mainnet-beta.solana.com", {
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountBalance",
          params: [memorizedAccount.toBase58()],
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
          // window.web3.eth.accounts.givenProvider.

          const invoker = new Web3Invoker()
          const { assetId } = this.getCurrentBridgeToken()

          // console.log({ currentWalletAddress, assetId })
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
    async unlockERC20() {
      if (this.formErrors !== null) {
        return
      }

      const invoker = new Web3Invoker()
      const amountValue = castFloatToDecimalsVersion(String(this.swapForm.tokenAmount), 18)

      const gateway = this.pickBridgeGateway()
      if (!gateway) {
        return
      }

      const formOrigin = this.swapForm.sourceChain
      // if (formOrigin!.id === SOLANA_CHAIN) {
      //   return this.handleApproveSolana(gateway, gateway.origin)
      // }

      let spender = gateway!.cfg.destinationPort
      if (isEVMChain(formOrigin)) {
        spender = gateway!.cfg.sourcePort
      }

      try {
        // @ts-ignore
        this.showLoader(SwapLoaderType.Plain, SwapLoaderMessage.Allowance)

        const currentToken = this.getCurrentBridgeToken()

        await invoker.approve(spender, currentToken.assetId, amountValue.toString())
        this.allowanceReceived = true
      } catch (err) {
        this.allowanceReceived = false
      } finally {
        // @ts-ignore
        this.hideLoader(SwapLoaderType.Plain)
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

      this.updateAddressFields()
    },
    onWalletConnect() {
      this.$modal.push("two-wallets-modal")
      // this.$modal.push("accounts")
    },
    checkSwapDetails() {
      const { tokenAmount, destinationAddress } = this.swapForm

      if (!destinationAddress || !tokenAmount) {
        return
      }

      if (this.formErrors !== null) {
        return
      }

      this.swapState = 2
    },
    handleWalletConnected() {
      this.swapState = 1
    },
    async handleWalletConnect(wallet: ExtensionWallet) {
      if (wallet.provider === WalletProvider.Phantom) {
        // @ts-ignore
        const isPhantomInstalled = window.solana && window.solana.isPhantom

        if (!isPhantomInstalled) {
          console.error("phantom is not installed")
          return
        }

        const phantomWallet = new PhantomWalletAdapter()

        phantomWallet.on("connect", () => {
          // await new Promise((resolve) => setTimeout(() => resolve(0), 2000))

          console.log({ phantomWallet, initializer: phantomWallet.publicKey.toBase58() })

          try {
            this.$store.commit("wallet/updateWalletData", {
              provider: wallet.provider,
              body: {
                isConnected: phantomWallet.connected,
                value: phantomWallet.publicKey.toBase58(),
                checked: true,
              },
            })
          } catch (err) {
            console.log({ err })
          }
        })

        await phantomWallet.connect()

        return
      }
      if (wallet.provider === WalletProvider.MathWallet) {
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

        const mathWallet = new MathWalletAdapter()

        mathWallet.on("connect", () => {
          // await new Promise((resolve) => setTimeout(() => resolve(0), 2000))

          console.log({ mathWallet, initializer: mathWallet.publicKey.toBase58() })

          try {
            this.$store.commit("wallet/updateWalletData", {
              provider: wallet.provider,
              body: {
                isConnected: mathWallet.connected,
                value: mathWallet.publicKey.toBase58(),
                checked: true,
              },
            })
          } catch (err) {
            console.log({ err })
          }
        })

        await mathWallet.connect()

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
        this.transferIsBeingProcessed = true
        // invokeSendUnlockRequest

        // this.showLoader(SwapLoaderType.Transactions, )
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
        this.hideLoader()

        this.swapForm.message = {
          text: `Transfer has been successfully submitted.`,
        }
        this.$modal.push("status")
      } catch (err) {
        this.hideLoader()
        console.log({ err })
        this.swapForm.message = { text: `${err.message}. ${err.data}` }
        this.$modal.push("status")
      } finally {
        this.transferIsBeingProcessed = false

        // @ts-ignore
        this.hideLoader()
      }
    },
    async handleSwapWavesEthereum() {
      const invoker = new LUPortInvoker(new Keeper())

      const gateway = this.pickBridgeGateway()
      const { sourcePort } = gateway!.cfg
      const { swapForm: form } = this

      try {
        this.transferIsBeingProcessed = true

        // @ts-ignore
        this.showLoader()

        const currentToken = this.getCurrentBridgeToken()

        const result = await invoker.sendTransferRequest({
          dApp: sourcePort,
          receiver: form.destinationAddress,
          swapAmount: Number(form.tokenAmount),
          swapAssetID: currentToken.assetId,
        })
        this.hideLoader()

        // @ts-ignore
        this.swapForm.message = this.buildSuccessMessage(form.sourceChain, form.destinationChain, form.sourceAddress, form.destinationAddress)
        this.$modal.push("status")
      } catch (err) {
        this.hideLoader()

        console.log({ err })
        this.swapForm.message = { text: `${err.message}. ${err.data}` }
        this.$modal.push("status")
      } finally {
        // @ts-ignore
        this.hideLoader()
        this.transferIsBeingProcessed = false
      }
    },
    getSolanaInvoker(walletAdapter: WalletAdapter): IBPort.Invoker | null {
      const currentBridge = this.pickBridgeGateway()!

      if (!currentBridge.cfg.meta) {
        return null
      }

      const { IBPORT_PROGRAM_ID, TOKEN_DATA_ACCOUNT, TOKEN_OWNER, IBPORT_DATA_ACCOUNT } = currentBridge.cfg.meta!

      // const
      const invoker = new IBPort.Invoker(
        walletAdapter,
        {
          initializer: walletAdapter.publicKey,
          ibportProgram: new PublicKey(IBPORT_PROGRAM_ID),
          ibportDataAccount: new PublicKey(IBPORT_DATA_ACCOUNT),
          tokenProgramAccount: new PublicKey(TOKEN_DATA_ACCOUNT),
          tokenOwner: new PublicKey(TOKEN_OWNER),
        },
        "https://api.mainnet-beta.solana.com"
      )

      return invoker
    },
    async handleSolanaAndEVMSwap(sourceChain: Chain) {
      this.transferIsBeingProcessed = true
      const currentWallet = this.$store.getters["wallet/currentWallet"]

      if (!currentWallet) {
        console.error("wallet not connected")
        return
      }

      // const mathWallet = new MathWalletAdapter()
      // const walletAdapter = currentWallet.walletAdapter
      const walletAdapter = new PhantomWalletAdapter()
      await walletAdapter.connect()

      await new Promise((resolve) => setTimeout(() => resolve(0), 1000))

      const invoker = this.getSolanaInvoker(walletAdapter)

      if (!invoker) {
        console.error("invoker is not available")
        return
      }

      this.processingTransferTxs.inputTx = null
      this.processingTransferTxs.outputTx = null

      if (sourceChain.id === SOLANA_CHAIN) {
        const gateway = this.pickBridgeGateway()
        if (!gateway || !gateway.cfg.meta) {
          return
        }
        const { TOKEN_DATA_ACCOUNT, IBPORT_PROGRAM_PDA } = gateway.cfg.meta

        const holderTokenAccount = await invoker.getExistingTokenAccount(new PublicKey(TOKEN_DATA_ACCOUNT))

        if (!holderTokenAccount) {
          return
        }

        const web3 = new Web3()

        const evmReceiver = new Uint8Array(web3.utils.hexToBytes(String(this.swapForm.destinationAddress)))

        const uiAmount = Number(this.swapForm.tokenAmount)
        const amount = uiAmount * Math.pow(10, gateway.cfg.token.dest.decimals)

        try {
          this.showLoader(SwapLoaderType.Transactions, SwapLoaderMessage.Processing)

          const awaiterProps = {
            // nodeURL: "https://rpc-mainnet.maticvigil.com/v1/2f581f46c671855c44af99074a017ccdb82ae83f",
            nodeURL: "https://api.polygonscan.com",
            recipient: String(this.swapForm.destinationAddress),
            tokenAddress: gateway.cfg.token.origin.assetId,
            amount: castFloatToDecimalsVersion(String(this.swapForm.tokenAmount), gateway.cfg.token.origin.decimals).toString(),
            timeout: 5000,
          }

          console.log({ awaiterProps })
          const subject = new Subject<EVMTokenTransferEvent>()
          const observer = (event: EVMTokenTransferEvent) => {
            this.processingTransferTxs.outputTx = event.hash
            this.processingTransferSubscription?.unsubscribe()
          }

          this.processingTransferSubscription = subject.subscribe(observer.bind(this))

          const createTransferUnwrapRequestTx = await invoker.createTransferUnwrapRequest(uiAmount, amount, evmReceiver, holderTokenAccount, holderTokenAccount, new PublicKey(IBPORT_PROGRAM_PDA))

          this.processingTransferTxs.inputTx = createTransferUnwrapRequestTx

          const evmAwaiter = new EVMDepositAwaiter(awaiterProps, subject)
          evmAwaiter.watch()
        } catch (err) {
          this.hideLoader(SwapLoaderType.Transactions)

          console.log({ err })
          this.swapForm.message = { text: `${err.message}.` }
          this.$modal.push("status")
        } finally {
          this.transferIsBeingProcessed = false
        }
      } else {
        console.log({ walletAdapter, initializer: walletAdapter.publicKey.toBase58() })

        const gateway = this.pickBridgeGateway()
        if (!gateway || !gateway.cfg.meta) {
          return
        }
        const { TOKEN_DATA_ACCOUNT } = gateway.cfg.meta

        const destinationAddress = await invoker.createOrGetExistingTokenAccount(new PublicKey(TOKEN_DATA_ACCOUNT))

        console.log({ destinationAddress, destinationAddressB58: destinationAddress?.toBase58() })

        await this.handleEVMLUPortLock(destinationAddress)
      }
    },
    async handleEVMLUPortLock(destinationAddress: PublicKey) {
      try {
        // invokeSendUnlockRequest

        this.showLoader(SwapLoaderType.Transactions, SwapLoaderMessage.Processing)
        const invoker = new Web3Invoker()

        const gateway = this.pickBridgeGateway()

        let { destinationPort } = gateway!.cfg

        if (isEVMChain(gateway!.origin)) {
          destinationPort = gateway!.cfg.sourcePort
        }

        const { swapForm: form } = this

        if (!destinationPort) {
          throw new Error("IB Port is invalid")
        }

        const response = (await invoker.invokeLUPortLock(destinationAddress, { value: String(form.tokenAmount), type: undefined }, destinationPort)) as {
          transactionHash: string
        }

        this.processingTransferTxs.inputTx = response.transactionHash

        const subject = new Subject<string>()
        const observer = (outputTx: string) => {
          this.processingTransferTxs.outputTx = outputTx
          this.processingTransferSubscription?.unsubscribe()
        }

        this.processingTransferSubscription = subject.subscribe(observer.bind(this))

        const { TOKEN_DATA_ACCOUNT, IBPORT_DATA_ACCOUNT } = gateway!.cfg.meta!

        this.solanaDepositAwaiter = new SolanaDepositAwaiter(
          {
            tokenMint: TOKEN_DATA_ACCOUNT,
            receiverTokenDataAccount: destinationAddress.toBase58(),
            programDataAccount: IBPORT_DATA_ACCOUNT,
            targetAmount: Number(this.swapForm.tokenAmount),
          },
          subject
        )

        this.solanaDepositAwaiter.start()
      } catch (err) {
        console.log({ err })
        this.swapForm.message = { text: `${err.message}. ${err.data}` }
        this.hideLoader(SwapLoaderType.Transactions)
        this.$modal.push("status")
      } finally {
        this.transferIsBeingProcessed = false
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
        await this.handleSolanaAndEVMSwap(sourceChain)
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
