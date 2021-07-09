import { WalletAdapter } from "~/services/wallet-adapters"
import { IBPort } from "~/services/solana/instruction"

export interface ExtensionWallet {
  wallet: {
    id: string
    label: string
    icon: string
  }
  provider: string
  isConnected: boolean
  label: string
  value?: string
  // getWalletAdapter?: () => WalletAdapter
  walletAdapter?: WalletAdapter
  checked?: boolean
  // instructionBuilder?: IBPort.InstructionBuilder
  invoker?: IBPort.Invoker
}

export type Wallets = {
  [key: string]: ExtensionWallet
  metamask: ExtensionWallet
  keeper: ExtensionWallet
}

export enum WalletProvider {
  Metamask = "metamask",
  WavesKeeper = "keeper",
  MathWallet = "mathwallet",
}

export type WalletState = Wallets
