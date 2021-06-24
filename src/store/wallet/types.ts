import { WalletAdapter } from "~/services/wallet-adapters"
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
  walletAdapter?: WalletAdapter
  checked?: boolean
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
